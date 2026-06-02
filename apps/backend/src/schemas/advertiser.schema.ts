import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KybStatus } from '../common/enums';

export type AdvertiserDocument = Advertiser & Document;

/**
 * Off-chain demand entity. One-to-one with a User (role=advertiser).
 * wallet_address is a cross-chain reference (↗) to an EVM address.
 */
@Schema({ timestamps: true, collection: 'advertisers' })
export class Advertiser {
  @Prop({ required: true })
  orgName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  walletAddress: string; // ↗ EVM address — FK to CampaignEscrow.advertiser_wallet

  @Prop({ type: String, enum: KybStatus, default: KybStatus.PENDING })
  kybStatus: KybStatus;
}

export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);

AdvertiserSchema.index({ walletAddress: 1 }, { unique: true });
AdvertiserSchema.index({ kybStatus: 1 });
