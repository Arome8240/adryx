import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import {
  Interaction,
  InteractionDocument,
} from '../../schemas/interaction.schema';
import { Placement, PlacementDocument } from '../../schemas/placement.schema';
import { Site, SiteDocument } from '../../schemas/site.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
    @InjectModel(Placement.name)
    private placementModel: Model<PlacementDocument>,
    @InjectModel(Site.name) private siteModel: Model<SiteDocument>,
  ) {}

  async getAdvertiserActivity(advertiserId: string, limit = 10) {
    const campaigns = await this.campaignModel
      .find({ advertiserId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('name status budget spent solanaTxHash updatedAt createdAt')
      .lean();

    return campaigns.map((c: any) => ({
      campaignId: c._id,
      name: c.name,
      status: c.status,
      budget: c.budget,
      spent: c.spent,
      hasTx: !!c.solanaTxHash,
      updatedAt: c.updatedAt,
    }));
  }

  async getAdvertiserTopCampaigns(advertiserId: string, limit = 10) {
    const campaigns = await this.campaignModel.find({ advertiserId });

    const stats = await Promise.all(
      campaigns.map(async (campaign) => {
        const impressions = await this.interactionModel.countDocuments({
          campaignId: campaign._id,
          type: 'impression',
        });
        const clicks = await this.interactionModel.countDocuments({
          campaignId: campaign._id,
          type: 'click',
        });
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        return {
          campaignId: campaign._id,
          name: campaign.name,
          status: campaign.status,
          impressions,
          clicks,
          ctr: parseFloat(ctr.toFixed(2)),
          spent: campaign.spent,
        };
      }),
    );

    return stats.sort((a, b) => b.ctr - a.ctr).slice(0, limit);
  }

  async getAdvertiserDashboard(advertiserId: string) {
    const campaigns = await this.campaignModel.find({ advertiserId });
    const campaignIds = campaigns.map((c) => c._id);

    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);

    const impressions = await this.interactionModel.countDocuments({
      campaignId: { $in: campaignIds },
      type: 'impression',
    });

    const clicks = await this.interactionModel.countDocuments({
      campaignId: { $in: campaignIds },
      type: 'click',
    });

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgCpc = clicks > 0 ? totalSpent / clicks : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      avgCpc: avgCpc.toFixed(4),
    };
  }

  async getPublisherDashboard(publisherId: string) {
    const sites = await this.siteModel.find({ publisherId });
    const placements = await this.placementModel.find({ publisherId });
    const placementIds = placements.map((p) => p._id);

    const impressions = await this.interactionModel.countDocuments({
      placementId: { $in: placementIds },
      type: 'impression',
    });

    const clicks = await this.interactionModel.countDocuments({
      placementId: { $in: placementIds },
      type: 'click',
    });

    const clickInteractions = await this.interactionModel.find({
      placementId: { $in: placementIds },
      type: 'click',
    });

    const totalEarnings = clickInteractions.reduce(
      (sum, interaction) => sum + (interaction.reward || 0),
      0,
    );

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    return {
      totalSites: sites.length,
      totalPlacements: placements.length,
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      totalEarnings: totalEarnings.toFixed(4),
    };
  }

  async getCampaignAnalytics(campaignId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interactions = await this.interactionModel.aggregate([
      {
        $match: {
          campaignId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          count: { $sum: 1 },
          totalReward: { $sum: '$reward' },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    return interactions;
  }

  async getSiteAnalytics(siteId: string, days: number = 30) {
    const placements = await this.placementModel.find({ siteId });
    const placementIds = placements.map((p) => p._id);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interactions = await this.interactionModel.aggregate([
      {
        $match: {
          placementId: { $in: placementIds },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          count: { $sum: 1 },
          totalReward: { $sum: '$reward' },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    return interactions;
  }

  async getTopPerformingCampaigns(limit: number = 10) {
    const campaigns = await this.campaignModel.find({ status: 'active' });

    const campaignStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const impressions = await this.interactionModel.countDocuments({
          campaignId: campaign._id,
          type: 'impression',
        });

        const clicks = await this.interactionModel.countDocuments({
          campaignId: campaign._id,
          type: 'click',
        });

        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        return {
          campaignId: campaign._id,
          name: campaign.name,
          impressions,
          clicks,
          ctr,
          spent: campaign.spent,
        };
      }),
    );

    return campaignStats.sort((a, b) => b.ctr - a.ctr).slice(0, limit);
  }

  async getTopEarningSites(limit: number = 10) {
    const earnings = await this.interactionModel.aggregate([
      {
        $match: {
          type: 'click',
          reward: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: 'placements',
          localField: 'placementId',
          foreignField: '_id',
          as: 'placement',
        },
      },
      {
        $unwind: '$placement',
      },
      {
        $group: {
          _id: '$placement.siteId',
          totalEarnings: { $sum: '$reward' },
          totalClicks: { $sum: 1 },
        },
      },
      {
        $sort: { totalEarnings: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    return earnings;
  }
}
