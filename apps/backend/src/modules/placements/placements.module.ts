import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacementsController } from './placements.controller';
import { PlacementsService } from './placements.service';
import { Placement, PlacementSchema } from '../../schemas/placement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Placement.name, schema: PlacementSchema },
    ]),
  ],
  controllers: [PlacementsController],
  providers: [PlacementsService],
  exports: [PlacementsService],
})
export class PlacementsModule {}
