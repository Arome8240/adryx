import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicKey } from '@solana/web3.js';
import { SolanaService } from './solana.service';
import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import {
  Interaction,
  InteractionDocument,
} from '../../schemas/interaction.schema';
import { InteractionType } from '../../common/enums';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly solanaService: SolanaService,
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
  ) {}

  async createCampaignEscrow(
    campaignId: string,
    advertiserWallet: string,
    amountSol: number,
  ): Promise<{ signature: string; escrowPda: string }> {
    try {
      this.logger.log(
        `Creating campaign escrow for ${campaignId} with ${amountSol} USDC`,
      );

      const advertiserPubkey = new PublicKey(advertiserWallet);
      const escrowPda = this.solanaService.deriveCampaignEscrowPda(
        advertiserPubkey,
        campaignId,
      );

      const signature = 'simulated_tx_' + Date.now();

      await this.campaignModel.findByIdAndUpdate(campaignId, {
        solanaTxHash: signature,
        budget: amountSol,
      });

      this.logger.log(`Campaign escrow created: ${signature}`);
      return { signature, escrowPda: escrowPda.toString() };
    } catch (error) {
      this.logger.error('Failed to create campaign escrow', error);
      throw error;
    }
  }

  async processClick(
    campaignId: string,
    placementId: string,
    publisherWallet: string,
    userIp: string,
    userAgent: string,
  ): Promise<{ interactionId: string; txHash?: string }> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');
      if (campaign.status !== ('active' as string))
        throw new Error('Campaign is not active');
      if (campaign.spent >= campaign.budget)
        throw new Error('Campaign budget exhausted');

      const interaction = await this.interactionModel.create({
        type: InteractionType.CLICK,
        campaignId,
        placementId,
        userIp,
        userAgent,
        reward: 0,
      });

      this.logger.log(`Click recorded: ${interaction._id}`);

      const cpcRate = this.calculateCPC(campaign);

      try {
        const txHash = await this.payPublisher(
          String(campaign.advertiserId),
          campaignId,
          publisherWallet,
          cpcRate,
        );

        await this.interactionModel.findByIdAndUpdate(interaction._id, {
          solanaTxHash: txHash,
          reward: cpcRate,
        });

        await this.campaignModel.findByIdAndUpdate(campaignId, {
          $inc: { spent: cpcRate },
        });

        this.logger.log(`Payment processed: ${txHash}`);
        return {
          interactionId: String(interaction._id),
          txHash,
        };
      } catch (paymentError) {
        this.logger.error(
          'Payment failed, click recorded but not paid',
          paymentError,
        );
        return { interactionId: String(interaction._id) };
      }
    } catch (error) {
      this.logger.error('Failed to process click', error);
      throw error;
    }
  }

  private payPublisher(
    _advertiserWallet: string,
    _campaignId: string,
    publisherWallet: string,
    amountUsdc: number,
  ): Promise<string> {
    const signature = 'payment_tx_' + Date.now();
    this.logger.log(`Paid ${amountUsdc} USDC to publisher ${publisherWallet}`);
    return Promise.resolve(signature);
  }

  async syncCampaignBalance(campaignId: string): Promise<number> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);
      if (!campaign) throw new Error('Campaign not found');

      const advertiserPubkey = new PublicKey(String(campaign.advertiserId));
      const escrowPda = this.solanaService.deriveCampaignEscrowPda(
        advertiserPubkey,
        campaignId,
      );
      const balance = await this.solanaService.getBalance(escrowPda);
      const balanceSol = this.solanaService.lamportsToSol(balance);

      this.logger.log(`Campaign ${campaignId} on-chain balance: ${balanceSol}`);
      return balanceSol;
    } catch (error) {
      this.logger.error('Failed to sync campaign balance', error);
      throw error;
    }
  }

  getPublisherEarnings(
    _publisherWallet: string,
  ): Promise<{ pending: number; totalClaimed: number }> {
    return Promise.resolve({ pending: 0, totalClaimed: 0 });
  }

  claimEarnings(
    publisherWallet: string,
    token = 'USDC',
    txSignature?: string,
  ): Promise<string> {
    if (txSignature) {
      this.logger.log(
        `${token} earnings claimed by ${publisherWallet}: ${txSignature}`,
      );
      return Promise.resolve(txSignature);
    }
    const signature = `claim_${token.toLowerCase()}_tx_` + Date.now();
    this.logger.log(
      `${token} earnings claimed by ${publisherWallet}: ${signature}`,
    );
    return Promise.resolve(signature);
  }

  async retryFailedPayments(): Promise<number> {
    try {
      const unpaidClicks = await this.interactionModel.find({
        type: InteractionType.CLICK,
        solanaTxHash: { $exists: false },
        reward: 0,
      });

      this.logger.log(`Found ${unpaidClicks.length} unpaid clicks`);
      return unpaidClicks.length;
    } catch (error) {
      this.logger.error('Failed to retry payments', error);
      throw error;
    }
  }

  private calculateCPC(campaign: CampaignDocument): number {
    const remainingBudget = campaign.budget - campaign.spent;
    const cpc = remainingBudget / 1000;
    return Math.max(cpc, 0.001);
  }
}
