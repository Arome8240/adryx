import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { Impression, ImpressionDocument } from '../../schemas/impression.schema';
import { AdSlot, AdSlotDocument } from '../../schemas/ad-slot.schema';
import { Publisher, PublisherDocument } from '../../schemas/publisher.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Campaign.name)   private campaignModel:   Model<CampaignDocument>,
    @InjectModel(Impression.name) private impressionModel: Model<ImpressionDocument>,
    @InjectModel(AdSlot.name)     private adSlotModel:     Model<AdSlotDocument>,
    @InjectModel(Publisher.name)  private publisherModel:  Model<PublisherDocument>,
  ) {}

  // ── Advertiser analytics ────────────────────────────────────────────────────

  async getAdvertiserActivity(advertiserId: string, limit = 10) {
    const campaigns = await this.campaignModel
      .find({ advertiserId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('name status budget budgetUsdc spent escrowId updatedAt createdAt')
      .lean();

    return campaigns.map((c: any) => ({
      campaignId:  c._id,
      name:        c.name,
      status:      c.status,
      budgetUsdc:  c.budgetUsdc ?? c.budget,
      spent:       c.spent,
      hasEscrow:   !!c.escrowId,
      updatedAt:   c.updatedAt,
    }));
  }

  async getAdvertiserDashboard(advertiserId: string) {
    const campaigns = await this.campaignModel.find({ advertiserId });
    const campaignIds = campaigns.map(c => c._id);

    const totalBudget = campaigns.reduce((s, c) => s + (c.budgetUsdc ?? c.budget), 0);
    const totalSpent  = campaigns.reduce((s, c) => s + c.spent, 0);

    // Impressions served for this advertiser's campaigns
    // BidRequest → Impression: the creative links back to a campaign
    const [impressionCount, clickCount] = await Promise.all([
      this.impressionModel.countDocuments({
        creativeId: {
          $in: await this._creativeIdsForCampaigns(campaignIds),
        },
      }),
      // Placeholder: click-type impressions tracked via proofId presence as proxy
      this.impressionModel.countDocuments({
        creativeId: { $in: await this._creativeIdsForCampaigns(campaignIds) },
        proofId: { $ne: null },
      }),
    ]);

    const ctr    = impressionCount > 0 ? (clickCount / impressionCount) * 100 : 0;
    const avgCpc = clickCount > 0 ? totalSpent / clickCount : 0;

    return {
      totalCampaigns:    campaigns.length,
      activeCampaigns:   campaigns.filter(c => c.status === 'active').length,
      totalBudgetUsdc:   totalBudget,
      totalSpent,
      remaining:         totalBudget - totalSpent,
      impressions:       impressionCount,
      attestedProofs:    clickCount,
      ctr:               ctr.toFixed(2),
      avgCpc:            avgCpc.toFixed(4),
    };
  }

  async getAdvertiserTopCampaigns(advertiserId: string, limit = 10) {
    const campaigns = await this.campaignModel.find({ advertiserId });

    const stats = await Promise.all(
      campaigns.map(async campaign => {
        const creativeIds = await this._creativeIdsForCampaigns([campaign._id]);
        const impressions = await this.impressionModel.countDocuments({ creativeId: { $in: creativeIds } });
        const attested    = await this.impressionModel.countDocuments({ creativeId: { $in: creativeIds }, proofId: { $ne: null } });
        const ctr = impressions > 0 ? (attested / impressions) * 100 : 0;
        return {
          campaignId:  campaign._id,
          name:        campaign.name,
          status:      campaign.status,
          impressions,
          attested,
          ctr:         parseFloat(ctr.toFixed(2)),
          spent:       campaign.spent,
        };
      }),
    );

    return stats.sort((a, b) => b.ctr - a.ctr).slice(0, limit);
  }

  async getCampaignAnalytics(campaignId: string, days = 30) {
    const creativeIds = await this._creativeIdsForCampaigns([new Types.ObjectId(campaignId)]);
    const since = new Date(Date.now() - days * 86400_000);

    return this.impressionModel.aggregate([
      { $match: { creativeId: { $in: creativeIds }, servedAt: { $gte: since } } },
      { $group: {
          _id:     { date: { $dateToString: { format: '%Y-%m-%d', date: '$servedAt' } } },
          total:   { $sum: 1 },
          attested: { $sum: { $cond: [{ $ne: ['$proofId', null] }, 1, 0] } },
      }},
      { $sort: { '_id.date': 1 } },
    ]);
  }

  async getAllCampaignsAnalytics(advertiserId: string, days = 30) {
    const campaigns  = await this.campaignModel.find({ advertiserId });
    const campaignIds = campaigns.map(c => c._id);
    const creativeIds = await this._creativeIdsForCampaigns(campaignIds);
    const since = new Date(Date.now() - days * 86400_000);

    return this.impressionModel.aggregate([
      { $match: { creativeId: { $in: creativeIds }, servedAt: { $gte: since } } },
      { $group: {
          _id:     { date: { $dateToString: { format: '%Y-%m-%d', date: '$servedAt' } } },
          total:   { $sum: 1 },
          attested: { $sum: { $cond: [{ $ne: ['$proofId', null] }, 1, 0] } },
      }},
      { $sort: { '_id.date': 1 } },
    ]);
  }

  async getTopPerformingCampaigns(limit = 10) {
    const campaigns = await this.campaignModel.find({ status: 'active' });

    const stats = await Promise.all(
      campaigns.map(async campaign => {
        const creativeIds = await this._creativeIdsForCampaigns([campaign._id]);
        const impressions = await this.impressionModel.countDocuments({ creativeId: { $in: creativeIds } });
        const attested    = await this.impressionModel.countDocuments({ creativeId: { $in: creativeIds }, proofId: { $ne: null } });
        const ctr = impressions > 0 ? (attested / impressions) * 100 : 0;
        return { campaignId: campaign._id, name: campaign.name, impressions, attested, ctr, spent: campaign.spent };
      }),
    );

    return stats.sort((a, b) => b.ctr - a.ctr).slice(0, limit);
  }

  // ── Publisher analytics ─────────────────────────────────────────────────────

  async getPublisherDashboard(publisherId: string) {
    const publisher = await this.publisherModel.findById(publisherId).lean();
    const slots = await this.adSlotModel.find({ publisherId }).lean();
    const slotIds = slots.map(s => s._id);

    const [impressions, attested] = await Promise.all([
      this.impressionModel.countDocuments({ requestId: { $in: await this._requestIdsForSlots(slotIds) } }),
      this.impressionModel.countDocuments({ requestId: { $in: await this._requestIdsForSlots(slotIds) }, proofId: { $ne: null } }),
    ]);

    return {
      publisherName:   publisher?.appName ?? 'Unknown',
      payoutAddress:   publisher?.payoutAddress ?? null,
      totalSlots:      slots.length,
      impressions,
      attestedProofs:  attested,
      fillRate:        impressions > 0 ? ((attested / impressions) * 100).toFixed(2) : '0.00',
    };
  }

  async getPublisherActivity(publisherId: string, limit = 8) {
    return this.adSlotModel
      .find({ publisherId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('dimensions floorPrice context updatedAt')
      .lean();
  }

  async getPublisherTopSlots(publisherId: string, limit = 10) {
    const slots = await this.adSlotModel.find({ publisherId }).lean();

    const stats = await Promise.all(
      slots.map(async slot => {
        const reqIds = await this._requestIdsForSlots([slot._id]);
        const imps   = await this.impressionModel.countDocuments({ requestId: { $in: reqIds } });
        const proved = await this.impressionModel.countDocuments({ requestId: { $in: reqIds }, proofId: { $ne: null } });
        return { slotId: slot._id, dimensions: slot.dimensions, floorPrice: slot.floorPrice, impressions: imps, attestedProofs: proved };
      }),
    );

    return stats.sort((a, b) => b.impressions - a.impressions).slice(0, limit);
  }

  async getPublisherEarningsChart(publisherId: string, days = 30) {
    const slots = await this.adSlotModel.find({ publisherId }).lean();
    const reqIds = await this._requestIdsForSlots(slots.map(s => s._id));
    const since = new Date(Date.now() - days * 86400_000);

    return this.impressionModel.aggregate([
      { $match: { requestId: { $in: reqIds }, proofId: { $ne: null }, servedAt: { $gte: since } } },
      { $group: {
          _id:    { date: { $dateToString: { format: '%Y-%m-%d', date: '$servedAt' } } },
          proofs: { $sum: 1 },
      }},
      { $sort: { '_id.date': 1 } },
      { $project: { date: '$_id.date', proofs: 1, _id: 0 } },
    ]);
  }

  async getTopEarningPublishers(limit = 10) {
    return this.impressionModel.aggregate([
      { $match: { proofId: { $ne: null } } },
      { $lookup: { from: 'bid_requests', localField: 'requestId', foreignField: '_id', as: 'req' } },
      { $unwind: '$req' },
      { $lookup: { from: 'ad_slots', localField: 'req.slotId', foreignField: '_id', as: 'slot' } },
      { $unwind: '$slot' },
      { $group: { _id: '$slot.publisherId', attestedProofs: { $sum: 1 } } },
      { $sort: { attestedProofs: -1 } },
      { $limit: limit },
    ]);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Returns Creative _ids that belong to the given campaign _ids. */
  private async _creativeIdsForCampaigns(campaignIds: Types.ObjectId[]): Promise<Types.ObjectId[]> {
    // Dynamic import to avoid circular deps; Creative is not registered in this module
    const { default: mongoose } = await import('mongoose');
    const Creative = mongoose.model('Creative');
    const docs = await Creative.find({ campaignId: { $in: campaignIds } }).select('_id').lean();
    return docs.map((d: any) => d._id);
  }

  /** Returns BidRequest _ids that belong to the given ad slot _ids. */
  private async _requestIdsForSlots(slotIds: Types.ObjectId[]): Promise<Types.ObjectId[]> {
    const { default: mongoose } = await import('mongoose');
    const BidRequest = mongoose.model('BidRequest');
    const docs = await BidRequest.find({ slotId: { $in: slotIds } }).select('_id').lean();
    return docs.map((d: any) => d._id);
  }
}
