import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from '../../schemas/interaction.schema';
import { PaymentService } from '../solana/payment.service';
import { InteractionType } from '../../common/enums';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async recordImpression(
    campaignId: string,
    placementId: string,
    userIp: string,
    userAgent: string,
  ) {
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

    if (!interaction) {
      throw new Error('Interaction not found');
    }

    return interaction;
  }

  async getCampaignInteractions(campaignId: string, type?: InteractionType) {
    const query: any = { campaignId };
    if (type) {
      query.type = type;
    }

    return await this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async getPlacementInteractions(placementId: string, type?: InteractionType) {
    const query: any = { placementId };
    if (type) {
      query.type = type;
    }

    return await this.interactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }
}
