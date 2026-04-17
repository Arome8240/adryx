import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { UserRole } from '../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  name: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.PUBLISHER })
  role: UserRole;

  @Prop()
  walletAddress: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  // Virtual fields for relations (populated)
  campaigns: Types.ObjectId[];
  sites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtuals for relations
UserSchema.virtual('campaigns', {
  ref: 'Campaign',
  localField: '_id',
  foreignField: 'advertiserId',
});

UserSchema.virtual('sites', {
  ref: 'Site',
  localField: '_id',
  foreignField: 'publisherId',
});

// Enable virtuals in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
