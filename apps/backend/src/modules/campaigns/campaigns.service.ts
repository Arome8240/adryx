import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from '../../common/enums';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(advertiserId: string, dto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignModel.create({
      ...dto,
      advertiserId,
      status: CampaignStatus.DRAFT,
      spent: 0,
      budgetUsdc: dto.budget ?? 0,
    });
  }

  async findAll(advertiserId?: string): Promise<Campaign[]> {
    const query = advertiserId ? { advertiserId } : {};
    return this.campaignModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    return campaign;
  }

  async update(id: string, advertiserId: string, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOneAndUpdate({ _id: id, advertiserId }, { $set: dto }, { new: true })
      .exec();
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    return campaign;
  }

  async remove(id: string, advertiserId: string): Promise<void> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    if (campaign.status === CampaignStatus.ACTIVE) {
      throw new BadRequestException('Pause the campaign before deleting it.');
    }
    await this.campaignModel.findByIdAndDelete(id);
  }

  /**
   * Called by the on-chain integration layer after CampaignEscrow is deployed.
   * Records the escrow contract address and activates the campaign.
   */
  async recordEscrow(id: string, advertiserId: string, escrowId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Campaign is already funded.');
    }
    campaign.escrowId = escrowId;
    campaign.status = CampaignStatus.ACTIVE;
    return campaign.save();
  }

  async pauseCampaign(id: string, advertiserId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new BadRequestException('Campaign is not active.');
    }
    campaign.status = CampaignStatus.PAUSED;
    return campaign.save();
  }

  async resumeCampaign(id: string, advertiserId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    if (campaign.status !== CampaignStatus.PAUSED) {
      throw new BadRequestException('Campaign is not paused.');
    }
    campaign.status = CampaignStatus.ACTIVE;
    return campaign.save();
  }

  async topUpCampaign(id: string, advertiserId: string, additionalUsdc: number): Promise<object> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    if (campaign.status !== CampaignStatus.ACTIVE && campaign.status !== CampaignStatus.PAUSED) {
      throw new BadRequestException('Only active or paused campaigns can be topped up.');
    }
    const updated = await this.campaignModel.findByIdAndUpdate(
      id,
      { $inc: { budget: additionalUsdc, budgetUsdc: additionalUsdc } },
      { new: true },
    );
    return { campaignId: id, addedUsdc: additionalUsdc, newBudgetUsdc: updated!.budgetUsdc };
  }

  async duplicateCampaign(id: string, advertiserId: string): Promise<Campaign> {
    const src = await this.campaignModel.findOne({ _id: id, advertiserId });
    if (!src) throw new NotFoundException(`Campaign ${id} not found`);
    return this.campaignModel.create({
      name:       `${src.name} (Copy)`,
      description: src.description,
      format:     src.format,
      budget:     src.budget,
      budgetUsdc: src.budgetUsdc,
      targeting:  src.targeting,
      startDate:  src.startDate,
      endDate:    src.endDate,
      targetUrl:  src.targetUrl,
      creativeUrl: src.creativeUrl,
      advertiserId,
      status: CampaignStatus.DRAFT,
      spent: 0,
    });
  }

  async getCampaignStats(id: string) {
    const campaign = await this.findOne(id);

    // Count attested impressions via the ERD Impression model
    const Impression = this.campaignModel.db.model('Impression');
    const Creative   = this.campaignModel.db.model('Creative');

    const creatives = await Creative.find({ campaignId: id }).select('_id').lean();
    const creativeIds = creatives.map((c: any) => c._id);

    const [total, attested] = await Promise.all([
      Impression.countDocuments({ creativeId: { $in: creativeIds } }),
      Impression.countDocuments({ creativeId: { $in: creativeIds }, proofId: { $ne: null } }),
    ]);

    const attestRate = total > 0 ? (attested / total) * 100 : 0;

    return {
      campaignId:   id,
      name:         campaign.name,
      status:       campaign.status,
      budgetUsdc:   campaign.budgetUsdc ?? campaign.budget,
      spent:        campaign.spent,
      remaining:    (campaign.budgetUsdc ?? campaign.budget) - campaign.spent,
      escrowId:     campaign.escrowId,
      impressions:  total,
      attested,
      attestRate:   attestRate.toFixed(2),
    };
  }
}
