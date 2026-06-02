import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CampaignStatus, AdFormat } from '../common/enums';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true, collection: 'campaigns' })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop({ type: String, enum: AdFormat, required: true })
  format: AdFormat;

  @Prop({ required: true, type: Number })
  budget: number;

  @Prop({ default: 0, type: Number })
  spent: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  targetUrl: string;

  @Prop()
  creativeUrl: string;

  @Prop()
  solanaTxHash: string;

  // ERD additions
  @Prop({ default: null, lowercase: true, trim: true })
  escrowId: string | null; // ↗ on-chain CampaignEscrow address (set after escrow deploy)

  @Prop({ type: Object, default: {} })
  targeting: Record<string, unknown>; // JSONB: geo, segments, formats, etc.

  @Prop({ required: true, type: Number, default: 0 })
  budgetUsdc: number; // canonical USDC budget (mirrors budget, kept for ERD alignment)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  advertiserId: Types.ObjectId;

  // Virtual fields for relations
  advertiser: Types.ObjectId;
  interactions: Types.ObjectId[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

// Add virtuals for relations
CampaignSchema.virtual('advertiser', {
  ref: 'User',
  localField: 'advertiserId',
  foreignField: '_id',
  justOne: true,
});

CampaignSchema.virtual('interactions', {
  ref: 'Interaction',
  localField: '_id',
  foreignField: 'campaignId',
});

// Enable virtuals in JSON
CampaignSchema.set('toJSON', { virtuals: true });
CampaignSchema.set('toObject', { virtuals: true });

// Indexes
CampaignSchema.index({ advertiserId: 1, status: 1 });
CampaignSchema.index({ advertiserId: 1, createdAt: -1 });
