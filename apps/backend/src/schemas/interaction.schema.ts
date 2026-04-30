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

// Indexes for performance
// Compound index for analytics queries (most common access pattern)
InteractionSchema.index({ campaignId: 1, type: 1, createdAt: -1 });
// Placement-based queries (publisher earnings, stats)
InteractionSchema.index({ placementId: 1, type: 1, createdAt: -1 });
// Fraud detection: duplicate click check by IP + placement
InteractionSchema.index({ placementId: 1, userIp: 1, type: 1, createdAt: -1 });
// Unpaid clicks retry queue
InteractionSchema.index({ type: 1, reward: 1, solanaTxHash: 1 });

// Enable virtuals in JSON
InteractionSchema.set('toJSON', { virtuals: true });
InteractionSchema.set('toObject', { virtuals: true });
