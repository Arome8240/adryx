import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { PaymentService } from '../solana/payment.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from '../../common/enums';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async create(
    advertiserId: string,
    createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.campaignModel.create({
      ...createCampaignDto,
      advertiserId,
      status: CampaignStatus.DRAFT,
      spent: 0,
    });

    return campaign;
  }

  async findAll(advertiserId?: string): Promise<Campaign[]> {
    const query = advertiserId ? { advertiserId } : {};
    return this.campaignModel
      .find(query)
      .populate('advertiser')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('advertiser')
      .exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(
    id: string,
    advertiserId: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findOneAndUpdate(
        { _id: id, advertiserId },
        { $set: updateCampaignDto },
        { new: true },
      )
      .exec();

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async remove(id: string, advertiserId: string): Promise<void> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.status === CampaignStatus.ACTIVE) {
      throw new BadRequestException(
        'Cannot delete active campaign. Pause it first.',
      );
    }

    await this.campaignModel.findByIdAndDelete(id);
  }

  async fundCampaign(
    id: string,
    advertiserId: string,
    advertiserWallet: string,
    amountSol: number,
  ) {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Campaign is already funded');
    }

    // Create escrow on-chain
    const { signature, escrowPda } =
      await this.paymentService.createCampaignEscrow(
        id,
        advertiserWallet,
        amountSol,
      );

    // Update campaign
    await this.campaignModel.findByIdAndUpdate(id, {
      status: CampaignStatus.ACTIVE,
      budget: amountSol,
      solanaTxHash: signature,
    });

    return {
      campaignId: id,
      signature,
      escrowPda,
      status: CampaignStatus.ACTIVE,
    };
  }

  async pauseCampaign(id: string, advertiserId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.status !== CampaignStatus.ACTIVE) {
      throw new BadRequestException('Campaign is not active');
    }

    campaign.status = CampaignStatus.PAUSED;
    await campaign.save();

    return campaign;
  }

  async resumeCampaign(id: string, advertiserId: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findOne({ _id: id, advertiserId });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    if (campaign.status !== CampaignStatus.PAUSED) {
      throw new BadRequestException('Campaign is not paused');
    }

    campaign.status = CampaignStatus.ACTIVE;
    await campaign.save();

    return campaign;
  }

  async getCampaignBalance(id: string) {
    const campaign = await this.findOne(id);
    const onChainBalance = await this.paymentService.syncCampaignBalance(id);

    return {
      campaignId: id,
      budgetTotal: campaign.budget,
      spent: campaign.spent,
      remaining: campaign.budget - campaign.spent,
      onChainBalance,
    };
  }

  async getCampaignStats(id: string) {
    const campaign = await this.findOne(id);

    // Get interactions count
    const Interaction = this.campaignModel.db.model('Interaction');
    const impressions = await Interaction.countDocuments({
      campaignId: id,
      type: 'impression',
    });
    const clicks = await Interaction.countDocuments({
      campaignId: id,
      type: 'click',
    });

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgCpc = clicks > 0 ? campaign.spent / clicks : 0;

    return {
      campaignId: id,
      name: campaign.name,
      status: campaign.status,
      budget: campaign.budget,
      spent: campaign.spent,
      remaining: campaign.budget - campaign.spent,
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      avgCpc: avgCpc.toFixed(4),
    };
  }
}
