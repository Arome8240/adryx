import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ViewerDocument = Viewer & Document;

/**
 * Pseudonymous viewer identity. The primary key viewer_ref is a
 * deterministic hash (e.g. HMAC of session token) — never a raw wallet.
 * wallet_hash is a bytes32 of the hashed wallet address for segment
 * matching without exposing the raw address.
 */
@Schema({ timestamps: true, collection: 'viewers' })
export class Viewer {
  @Prop({ required: true, unique: true })
  viewerRef: string; // SHA-256 / HMAC hash — used as PK

  @Prop({ match: /^0x[0-9a-fA-F]{64}$/ })
  walletHash: string; // bytes32 — hashed wallet address (privacy-preserving)

  @Prop({ default: false })
  consent: boolean;

  @Prop()
  segment: string; // e.g. "defi-power-user", "nft-collector"
}

export const ViewerSchema = SchemaFactory.createForClass(Viewer);

ViewerSchema.index({ viewerRef: 1 }, { unique: true });
ViewerSchema.index({ segment: 1 });
