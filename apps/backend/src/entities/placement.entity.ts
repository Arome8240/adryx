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
import { AdFormat } from '../common/enums';
import { Site } from './site.entity';
import { Interaction } from './interaction.entity';

@Entity('placements')
export class Placement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: AdFormat,
  })
  format: AdFormat;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'site_id' })
  siteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Site, (site) => site.placements)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @OneToMany(() => Interaction, (interaction) => interaction.placement)
  interactions: Interaction[];
}
