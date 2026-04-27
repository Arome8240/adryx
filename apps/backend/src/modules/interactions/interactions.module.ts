import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import {
  Interaction,
  InteractionSchema,
} from '../../schemas/interaction.schema';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { Placement, PlacementSchema } from '../../schemas/placement.schema';
import { SolanaModule } from '../solana/solana.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: Placement.name, schema: PlacementSchema },
    ]),
    SolanaModule,
  ],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}
