import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SolanaService } from './solana.service';
import { CreateCampaignEscrowDto } from './dto/create-campaign-escrow.dto';
import { ProcessClickDto } from './dto/process-click.dto';
import { ClaimEarningsDto } from './dto/claim-earnings.dto';

@Controller('solana')
export class SolanaController {
  private readonly logger = new Logger(SolanaController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly solanaService: SolanaService,
  ) {}

  @Post('campaign-escrow')
  @HttpCode(HttpStatus.CREATED)
  async createCampaignEscrow(@Body() dto: CreateCampaignEscrowDto) {
    this.logger.log(`Creating campaign escrow for ${dto.campaignId}`);
    return await this.paymentService.createCampaignEscrow(
      dto.campaignId,
      dto.advertiserWallet,
      dto.amountSol,
    );
  }

  @Post('process-click')
  @HttpCode(HttpStatus.OK)
  async processClick(@Body() dto: ProcessClickDto) {
    this.logger.log(`Processing click for campaign ${dto.campaignId}`);
    return await this.paymentService.processClick(
      dto.campaignId,
      dto.placementId,
      dto.publisherWallet,
      dto.userIp || '',
      dto.userAgent || '',
    );
  }

  @Get('campaign/:campaignId/balance')
  async getCampaignBalance(@Param('campaignId') campaignId: string) {
    this.logger.log(`Getting balance for campaign ${campaignId}`);
    const balance = await this.paymentService.syncCampaignBalance(campaignId);
    return { campaignId, balance };
  }

  @Get('publisher/:wallet/earnings')
  async getPublisherEarnings(@Param('wallet') wallet: string) {
    this.logger.log(`Getting earnings for publisher ${wallet}`);
    const earnings = await this.paymentService.getPublisherEarnings(wallet);
    return { wallet, ...earnings };
  }

  @Post('claim-earnings')
  @HttpCode(HttpStatus.OK)
  async claimEarnings(@Body() dto: ClaimEarningsDto) {
    this.logger.log(
      `Claiming ${dto.token ?? 'USDC'} earnings for ${dto.publisherWallet}`,
    );
    const signature = await this.paymentService.claimEarnings(
      dto.publisherWallet,
      dto.token ?? 'USDC',
      dto.txSignature,
    );
    return { signature, token: dto.token ?? 'USDC' };
  }

  @Post('retry-failed-payments')
  @HttpCode(HttpStatus.OK)
  async retryFailedPayments() {
    this.logger.log('Retrying failed payments');
    const count = await this.paymentService.retryFailedPayments();
    return { retriedCount: count };
  }

  @Get('info')
  async getInfo() {
    return {
      wallet: this.solanaService.getWallet().publicKey.toString(),
      programId: this.solanaService.getProgramId().toString(),
      platformPda: this.solanaService.getPlatformPda().toString(),
      treasuryPda: this.solanaService.getTreasuryPda().toString(),
    };
  }
}
