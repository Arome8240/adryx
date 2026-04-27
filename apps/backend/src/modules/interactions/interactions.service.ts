import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Interaction,
  InteractionDocument,
} from '../../schemas/interaction.schema';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { Placement, PlacementDocument } from '../../schemas/placement.schema';
import { PaymentService } from '../solana/payment.service';
import { InteractionType } from '../../common/enums';

// Minimum ms between clicks from the same IP on the same placement (anti-fraud)
const CLICK_COOLDOWN_MS = 30_000; // 30 seconds

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Placement.name)
    private placementModel: Model<PlacementDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async recordImpression(
    campaignId: string,
    placementId: string,
    userIp: string,
    userAgent: string,
  ) {
    // Validate campaign is active
    const campaign = await this.campaignModel.findById(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== ('active' as string))
      throw new BadRequestException('Campaign is not active');
    if (campaign.spent >= campaign.budget)
      throw new BadRequestException('Campaign budget exhausted');

    // Validate placement exists
    const placement = await this.placementModel.findById(placementId);
    if (!placement) throw new NotFoundException('Placement not found');

    const interaction = await this.interactionModel.create({
      type: InteractionType.IMPRESSION,
      campaignId,
      placementId,
      userIp,
      userAgent,
      reward: 0,
    });

    return {
      interactionId: interaction._id.toString(),
      type: 'impression',
    };
  }

  async recordClick(
    campaignId: string,
    placementId: string,
    publisherWallet: string,
    userIp: string,
    userAgent: string,
  ) {
    // Validate campaign
    const campaign = await this.campaignModel.findById(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== ('active' as string))
      throw new BadRequestException('Campaign is not active');
    if (campaign.spent >= campaign.budget)
      throw new BadRequestException('Campaign budget exhausted');

    // Validate placement
    const placement = await this.placementModel.findById(placementId);
    if (!placement) throw new NotFoundException('Placement not found');

    // Fraud check: duplicate click from same IP on same placement within cooldown
    if (userIp) {
      const cooldownStart = new Date(Date.now() - CLICK_COOLDOWN_MS);
      const recentClick = await this.interactionModel.findOne({
        placementId,
        type: InteractionType.CLICK,
        userIp,
        createdAt: { $gte: cooldownStart },
      });
      if (recentClick) {
        throw new BadRequestException(
          'Duplicate click detected — please wait before clicking again',
        );
      }
    }

    const { interactionId, txHash } = await this.paymentService.processClick(
      campaignId,
      placementId,
      publisherWallet,
      userIp,
      userAgent,
    );

    return {
      interactionId,
      type: 'click',
      txHash,
      paid: !!txHash,
    };
  }

  async getInteraction(interactionId: string) {
    const interaction = await this.interactionModel
      .findById(interactionId)
      .populate('campaign')
      .populate('placement')
      .exec();

    if (!interaction) throw new NotFoundException('Interaction not found');
    return interaction;
  }

  async getCampaignInteractions(campaignId: string, type?: InteractionType) {
    const query: any = { campaignId };
    if (type) query.type = type;
    return this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async getPlacementInteractions(placementId: string, type?: InteractionType) {
    const query: any = { placementId };
    if (type) query.type = type;
    return this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  /** Real-time earnings for a publisher — sum of all paid click rewards */
  async getPublisherEarnings(publisherId: string) {
    const placements = await this.placementModel.find({ publisherId });
    const placementIds = placements.map((p) => p._id);

    const result = await this.interactionModel.aggregate([
      {
        $match: {
          placementId: { $in: placementIds },
          type: InteractionType.CLICK,
          reward: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$reward' },
          totalClicks: { $sum: 1 },
          pendingEarnings: {
            $sum: {
              $cond: [{ $not: ['$solanaTxHash'] }, '$reward', 0],
            },
          },
          claimedEarnings: {
            $sum: {
              $cond: [{ $ifNull: ['$solanaTxHash', false] }, '$reward', 0],
            },
          },
        },
      },
    ]);

    const data = result[0] ?? {
      totalEarnings: 0,
      totalClicks: 0,
      pendingEarnings: 0,
      claimedEarnings: 0,
    };

    return {
      totalEarnings: parseFloat(data.totalEarnings.toFixed(4)),
      totalClicks: data.totalClicks,
      pendingEarnings: parseFloat(data.pendingEarnings.toFixed(4)),
      claimedEarnings: parseFloat(data.claimedEarnings.toFixed(4)),
    };
  }

  /** Per-placement earnings breakdown */
  async getPlacementEarnings(placementId: string) {
    const result = await this.interactionModel.aggregate([
      {
        $match: {
          placementId,
          type: InteractionType.CLICK,
          reward: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          earnings: { $sum: '$reward' },
          clicks: { $sum: 1 },
        },
      },
    ]);

    return {
      placementId,
      earnings: parseFloat((result[0]?.earnings ?? 0).toFixed(4)),
      clicks: result[0]?.clicks ?? 0,
    };
  }
}
