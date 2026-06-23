import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { Publisher, PublisherSchema } from '../../schemas/publisher.schema';
import { Impression, ImpressionSchema } from '../../schemas/impression.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name,       schema: UserSchema },
      { name: Campaign.name,   schema: CampaignSchema },
      { name: Publisher.name,  schema: PublisherSchema },
      { name: Impression.name, schema: ImpressionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
