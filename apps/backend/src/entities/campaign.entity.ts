import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CampaignStatus, AdFormat } from '../common/enums';
import { User } from './user.entity';
import { Interaction } from './interaction.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({
    type: 'enum',
    enum: AdFormat,
  })
  format: AdFormat;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  spent: number;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ nullable: true, name: 'target_url' })
  targetUrl: string;

  @Column({ nullable: true, name: 'creative_url' })
  creativeUrl: string;

  @Column({ nullable: true, name: 'solana_tx_hash' })
  solanaTxHash: string;

  @Column({ name: 'advertiser_id' })
  advertiserId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.campaigns)
  @JoinColumn({ name: 'advertiser_id' })
  advertiser: User;

  @OneToMany(() => Interaction, (interaction) => interaction.campaign)
  interactions: Interaction[];
}
