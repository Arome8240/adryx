import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdFormat } from '../common/enums';

export type PlacementDocument = Placement & Document;

@Schema({ timestamps: true, collection: 'placements' })
export class Placement {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: String, enum: AdFormat, required: true })
  format: AdFormat;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Site', required: true })
  siteId: Types.ObjectId;

  // Virtual fields for relations
  site: Types.ObjectId;
  interactions: Types.ObjectId[];
}

export const PlacementSchema = SchemaFactory.createForClass(Placement);

// Add virtuals for relations
PlacementSchema.virtual('site', {
  ref: 'Site',
  localField: 'siteId',
  foreignField: '_id',
  justOne: true,
});

PlacementSchema.virtual('interactions', {
  ref: 'Interaction',
  localField: '_id',
  foreignField: 'placementId',
});

// Enable virtuals in JSON
PlacementSchema.set('toJSON', { virtuals: true });
PlacementSchema.set('toObject', { virtuals: true });
