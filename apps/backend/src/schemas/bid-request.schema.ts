import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BidRequestDocument = BidRequest & Document;

/**
 * RTB bid request generated when a viewer loads a page with an ad slot.
 * auction_id (↗) is the uint ID of the on-chain Auction created for this
 * request once the RTB auction begins.
 */
@Schema({ timestamps: true, collection: 'bid_requests' })
export class BidRequest {
  @Prop({ type: Types.ObjectId, ref: 'AdSlot', required: true })
  slotId: Types.ObjectId;

  @Prop({ required: true })
  viewerRef: string; // FK → Viewer.viewer_ref (hash, not ObjectId)

  @Prop({ type: Number, default: null })
  auctionId: number | null; // ↗ on-chain Auction.auction_id (set after chain write)

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BidRequestSchema = SchemaFactory.createForClass(BidRequest);

BidRequestSchema.index({ slotId: 1, createdAt: -1 });
BidRequestSchema.index({ viewerRef: 1 });
BidRequestSchema.index({ auctionId: 1 });
