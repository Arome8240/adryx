import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publisher & Document;

/**
 * Off-chain supply entity representing a dApp or website.
 * payout_address is a cross-chain reference (↗) — the EVM address that
 * receives Settlement payouts.
 */
@Schema({ timestamps: true, collection: 'publishers' })
export class Publisher {
  @Prop({ required: true })
  appName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  domain: string;

  @Prop({ required: true, lowercase: true, trim: true })
  payoutAddress: string; // ↗ EVM address — FK to Settlement.publisher_wallet

  @Prop({ required: true, unique: true })
  sdkKey: string; // opaque token issued on registration
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);

PublisherSchema.index({ domain: 1 }, { unique: true });
PublisherSchema.index({ payoutAddress: 1 });
