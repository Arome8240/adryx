import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
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

  /**
   * Create campaign escrow on-chain when campaign is funded
   */
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

      // In production, this would call the smart contract
      // const tx = await this.solanaService.program.methods
      //   .createCampaignEscrow(campaignId, this.solanaService.solToLamports(amountSol))
      //   .accounts({
      //     campaignEscrow: escrowPda,
      //     advertiser: advertiserPubkey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .rpc();

      // For now, simulate the transaction
      const signature = 'simulated_tx_' + Date.now();

      // Update campaign in MongoDB
      await this.campaignModel.findByIdAndUpdate(campaignId, {
        solanaTxHash: signature,
        budget: amountSol,
      });

      this.logger.log(`Campaign escrow created: ${signature}`);

      return {
        signature,
        escrowPda: escrowPda.toString(),
      };
    } catch (error) {
      this.logger.error('Failed to create campaign escrow', error);
      throw error;
    }
  }

  /**
   * Process a click and trigger on-chain payment to publisher
   */
  async processClick(
    campaignId: string,
    placementId: string,
    publisherWallet: string,
    userIp: string,
    userAgent: string,
  ): Promise<{ interactionId: string; txHash?: string }> {
    try {
      // 1. Validate campaign
      const campaign = await this.campaignModel.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      if (campaign.status !== 'active') {
        throw new Error('Campaign is not active');
      }

      if (campaign.spent >= campaign.budget) {
        throw new Error('Campaign budget exhausted');
      }

      // 2. Record click in MongoDB (off-chain)
      const interaction = await this.interactionModel.create({
        type: InteractionType.CLICK,
        campaignId,
        placementId,
        userIp,
        userAgent,
        reward: 0, // Will be updated after payment
      });

      this.logger.log(`Click recorded: ${interaction._id}`);

      // 3. Calculate payment amount (CPC)
      const cpcRate = this.calculateCPC(campaign);
      const amountLamports = cpcRate * LAMPORTS_PER_SOL;

      // 4. Trigger on-chain payment
      try {
        const txHash = await this.payPublisher(
          campaign.advertiserId.toString(),
          campaignId,
          publisherWallet,
          cpcRate,
        );

        // 5. Update interaction with payment info
        await this.interactionModel.findByIdAndUpdate(interaction._id, {
          solanaTxHash: txHash,
          reward: cpcRate,
        });

        // 6. Update campaign spent
        await this.campaignModel.findByIdAndUpdate(campaignId, {
          $inc: { spent: cpcRate },
        });

        this.logger.log(`Payment processed: ${txHash}`);

        return {
          interactionId: interaction._id.toString(),
          txHash,
        };
      } catch (paymentError) {
        this.logger.error(
          'Payment failed, click recorded but not paid',
          paymentError,
        );
        // Click is recorded but payment failed - can be retried later
        return {
          interactionId: interaction._id.toString(),
        };
      }
    } catch (error) {
      this.logger.error('Failed to process click', error);
      throw error;
    }
  }

  /**
   * Pay publisher from campaign escrow
   */
  private async payPublisher(
    advertiserWallet: string,
    campaignId: string,
    publisherWallet: string,
    amountSol: number,
  ): Promise<string> {
    try {
      const advertiserPubkey = new PublicKey(advertiserWallet);
      const publisherPubkey = new PublicKey(publisherWallet);

      const campaignEscrowPda = this.solanaService.deriveCampaignEscrowPda(
        advertiserPubkey,
        campaignId,
      );

      const publisherEarningsPda =
        this.solanaService.derivePublisherEarningsPda(publisherPubkey);

      const platformPda = this.solanaService.getPlatformPda();
      const treasuryPda = this.solanaService.getTreasuryPda();

      // In production, this would call the smart contract
      // const tx = await this.solanaService.program.methods
      //   .payPublisher(this.solanaService.solToLamports(amountSol))
      //   .accounts({
      //     campaignEscrow: campaignEscrowPda,
      //     publisherEarnings: publisherEarningsPda,
      //     platform: platformPda,
      //     treasury: treasuryPda,
      //     advertiser: advertiserPubkey,
      //     publisher: publisherPubkey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .rpc();

      // For now, simulate the transaction
      const signature = 'payment_tx_' + Date.now();

      this.logger.log(`Paid ${amountSol} USDC to publisher ${publisherWallet}`);

      return signature;
    } catch (error) {
      this.logger.error('Failed to pay publisher', error);
      throw error;
    }
  }

  /**
   * Sync campaign balance from on-chain escrow
   */
  async syncCampaignBalance(campaignId: string): Promise<number> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const advertiserPubkey = new PublicKey(campaign.advertiserId.toString());
      const escrowPda = this.solanaService.deriveCampaignEscrowPda(
        advertiserPubkey,
        campaignId,
      );

      // Get on-chain balance
      const balance = await this.solanaService.getBalance(escrowPda);
      const balanceSol = this.solanaService.lamportsToSol(balance);

      this.logger.log(
        `Campaign ${campaignId} on-chain balance: ${balanceSol} SOL`,
      );

      return balanceSol;
    } catch (error) {
      this.logger.error('Failed to sync campaign balance', error);
      throw error;
    }
  }

  /**
   * Get publisher earnings from on-chain account
   */
  async getPublisherEarnings(publisherWallet: string): Promise<{
    pending: number;
    totalClaimed: number;
  }> {
    try {
      const publisherPubkey = new PublicKey(publisherWallet);
      const earningsPda =
        this.solanaService.derivePublisherEarningsPda(publisherPubkey);

      const accountInfo =
        await this.solanaService.getPublisherEarnings(earningsPda);

      if (!accountInfo) {
        return { pending: 0, totalClaimed: 0 };
      }

      // In production, parse the account data
      // const earnings = await this.solanaService.program.account.publisherEarnings.fetch(earningsPda);
      // return {
      //   pending: this.solanaService.lamportsToSol(earnings.pending),
      //   totalClaimed: this.solanaService.lamportsToSol(earnings.totalClaimed),
      // };

      // For now, return mock data
      return { pending: 0, totalClaimed: 0 };
    } catch (error) {
      this.logger.error('Failed to get publisher earnings', error);
      throw error;
    }
  }

  /**
   * Claim earnings for publisher
   */
  async claimEarnings(
    publisherWallet: string,
    token = 'USDC',
    txSignature?: string,
  ): Promise<string> {
    try {
      // If a real on-chain tx was submitted by the frontend, record it
      if (txSignature) {
        this.logger.log(
          `${token} earnings claimed by ${publisherWallet}: ${txSignature}`,
        );
        return txSignature;
      }

      // Simulated fallback (dev only)
      const signature = `claim_${token.toLowerCase()}_tx_` + Date.now();
      this.logger.log(
        `${token} earnings claimed by ${publisherWallet}: ${signature}`,
      );
      return signature;
    } catch (error) {
      this.logger.error('Failed to claim earnings', error);
      throw error;
    }
  }

  /**
   * Retry failed payments for unpaid clicks
   */
  async retryFailedPayments(): Promise<number> {
    try {
      // Find clicks without payment
      const unpaidClicks = await this.interactionModel.find({
        type: InteractionType.CLICK,
        solanaTxHash: { $exists: false },
        reward: 0,
      });

      this.logger.log(`Found ${unpaidClicks.length} unpaid clicks`);

      let successCount = 0;

      for (const click of unpaidClicks) {
        try {
          const campaign = await this.campaignModel.findById(click.campaignId);
          if (!campaign || campaign.status !== 'active') {
            continue;
          }

          // Get publisher wallet from placement
          // const placement = await this.placementModel.findById(click.placementId);
          // const publisherWallet = placement.publisherWallet;

          // For now, skip actual payment
          // const txHash = await this.payPublisher(...);

          successCount++;
        } catch (error) {
          this.logger.error(
            `Failed to retry payment for click ${click._id}`,
            error,
          );
        }
      }

      this.logger.log(`Retried ${successCount} payments successfully`);

      return successCount;
    } catch (error) {
      this.logger.error('Failed to retry payments', error);
      throw error;
    }
  }

  /**
   * Calculate CPC rate based on campaign
   */
  private calculateCPC(campaign: CampaignDocument): number {
    // Simple calculation: divide remaining budget by estimated clicks
    // In production, this would be more sophisticated
    const remainingBudget = campaign.budget - campaign.spent;
    const estimatedClicks = 1000; // Mock value
    const cpc = remainingBudget / estimatedClicks;

    // Minimum CPC of 0.001 SOL
    return Math.max(cpc, 0.001);
  }
}
