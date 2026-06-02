import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdSlotDocument = AdSlot & Document;

/**
 * A placement zone on a publisher's dApp.
 * context holds free-form targeting metadata (page category, audience tags, etc.).
 * floor_price is in micro-USDC (6 decimals) stored as a number.
 */
@Schema({ timestamps: true, collection: 'ad_slots' })
export class AdSlot {
  @Prop({ type: Types.ObjectId, ref: 'Publisher', required: true })
  publisherId: Types.ObjectId;

  @Prop({ required: true })
  dimensions: string; // e.g. "728x90", "300x250"

  @Prop({ required: true, type: Number, min: 0 })
  floorPrice: number; // USDC, 6-decimal precision stored as float

  @Prop({ type: Object, default: {} })
  context: Record<string, unknown>; // JSONB equivalent: page categories, audience hints
}

export const AdSlotSchema = SchemaFactory.createForClass(AdSlot);

AdSlotSchema.index({ publisherId: 1 });
AdSlotSchema.index({ floorPrice: 1 });
