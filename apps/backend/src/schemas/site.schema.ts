import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SiteType } from '../common/enums';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true, collection: 'sites' })
export class Site {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: String, enum: SiteType, default: SiteType.WEBSITE })
  type: SiteType;

  @Prop()
  category: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ required: true })
  verificationCode: string;

  @Prop()
  verifiedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  publisherId: Types.ObjectId;

  // Virtual fields for relations
  publisher: Types.ObjectId;
  placements: Types.ObjectId[];
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Add virtuals for relations
SiteSchema.virtual('publisher', {
  ref: 'User',
  localField: 'publisherId',
  foreignField: '_id',
  justOne: true,
});

SiteSchema.virtual('placements', {
  ref: 'Placement',
  localField: '_id',
  foreignField: 'siteId',
});

// Enable virtuals in JSON
SiteSchema.set('toJSON', { virtuals: true });
SiteSchema.set('toObject', { virtuals: true });
