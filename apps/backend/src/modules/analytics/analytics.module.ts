import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { Interaction, InteractionSchema } from '../../schemas/interaction.schema';
import { Placement, PlacementSchema } from '../../schemas/placement.schema';
import { Site, SiteSchema } from '../../schemas/site.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Interaction.name, schema: InteractionSchema },
      { name: Placement.name, schema: PlacementSchema },
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
