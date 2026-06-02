import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { Impression, ImpressionSchema } from '../../schemas/impression.schema';
import { AdSlot, AdSlotSchema } from '../../schemas/ad-slot.schema';
import { Publisher, PublisherSchema } from '../../schemas/publisher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name,   schema: CampaignSchema },
      { name: Impression.name, schema: ImpressionSchema },
      { name: AdSlot.name,     schema: AdSlotSchema },
      { name: Publisher.name,  schema: PublisherSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
