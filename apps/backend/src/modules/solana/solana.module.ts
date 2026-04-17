import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SolanaService } from './solana.service';
import { PaymentService } from './payment.service';
import { SolanaController } from './solana.controller';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import {
  Interaction,
  InteractionSchema,
} from '../../schemas/interaction.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Interaction.name, schema: InteractionSchema },
    ]),
  ],
  controllers: [SolanaController],
  providers: [SolanaService, PaymentService],
  exports: [SolanaService, PaymentService],
})
export class SolanaModule {}
