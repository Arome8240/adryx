import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdFormat } from '../common/enums';

export type CreativeDocument = Creative & Document;

/**
 * Ad asset belonging to a campaign.
 * content_hash is a bytes32 stored as a hex string for on-chain verification.
 */
@Schema({ timestamps: true, collection: 'creatives' })
export class Creative {
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ required: true })
  assetUri: string;

  @Prop({ required: true, match: /^0x[0-9a-fA-F]{64}$/ })
  contentHash: string; // bytes32 hex — used for on-chain attestation

  @Prop({ type: String, enum: AdFormat, required: true })
  format: AdFormat;
}

export const CreativeSchema = SchemaFactory.createForClass(Creative);

CreativeSchema.index({ campaignId: 1 });
CreativeSchema.index({ contentHash: 1 }, { unique: true });
