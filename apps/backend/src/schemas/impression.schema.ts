import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImpressionDocument = Impression & Document;

/**
 * Record of a served ad impression (off-chain event).
 * proof_id (↗) is set by the Relayer after writing the ImpressionProof
 * attestation on-chain. Null until the Relayer confirms.
 */
@Schema({ timestamps: true, collection: 'impressions' })
export class Impression {
  @Prop({ type: Types.ObjectId, ref: 'BidRequest', required: true })
  requestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Creative', required: true })
  creativeId: Types.ObjectId;

  @Prop({ type: Number, default: null })
  proofId: number | null; // ↗ on-chain ImpressionProof.proof_id (set by Relayer)

  @Prop({ default: Date.now })
  servedAt: Date;
}

export const ImpressionSchema = SchemaFactory.createForClass(Impression);

ImpressionSchema.index({ requestId: 1 }, { unique: true });
ImpressionSchema.index({ creativeId: 1 });
ImpressionSchema.index({ proofId: 1 });
ImpressionSchema.index({ servedAt: -1 });
