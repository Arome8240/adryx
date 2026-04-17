import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InteractionType } from '../common/enums';

export type InteractionDocument = Interaction & Document;

@Schema({ timestamps: true, collection: 'interactions' })
export class Interaction {
  @Prop({ type: String, enum: InteractionType, required: true })
  type: InteractionType;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Placement', required: true })
  placementId: Types.ObjectId;

  @Prop()
  userIp: string;

  @Prop()
  userAgent: string;

  @Prop()
  solanaTxHash: string;

  @Prop({ default: 0, type: Number })
  reward: number;

  // Virtual fields for relations
  campaign: Types.ObjectId;
  placement: Types.ObjectId;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);

// Add virtuals for relations
InteractionSchema.virtual('campaign', {
  ref: 'Campaign',
  localField: 'campaignId',
  foreignField: '_id',
  justOne: true,
});

InteractionSchema.virtual('placement', {
  ref: 'Placement',
  localField: 'placementId',
  foreignField: '_id',
  justOne: true,
});

// Add indexes for performance
InteractionSchema.index({ campaignId: 1, placementId: 1, type: 1, createdAt: -1 });

// Enable virtuals in JSON
InteractionSchema.set('toJSON', { virtuals: true });
InteractionSchema.set('toObject', { virtuals: true });
