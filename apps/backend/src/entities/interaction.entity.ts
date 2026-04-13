import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { InteractionType } from '../common/enums';
import { Campaign } from './campaign.entity';
import { Placement } from './placement.entity';

@Entity('interactions')
@Index(['campaignId', 'placementId', 'type', 'createdAt'])
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  type: InteractionType;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @Column({ name: 'placement_id' })
  placementId: string;

  @Column({ nullable: true, name: 'user_ip' })
  userIp: string;

  @Column({ nullable: true, name: 'user_agent' })
  userAgent: string;

  @Column({ nullable: true, name: 'solana_tx_hash' })
  solanaTxHash: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, default: 0 })
  reward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Campaign, (campaign) => campaign.interactions)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @ManyToOne(() => Placement, (placement) => placement.interactions)
  @JoinColumn({ name: 'placement_id' })
  placement: Placement;
}
