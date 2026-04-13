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
import { SiteType } from '../common/enums';
import { User } from './user.entity';
import { Placement } from './placement.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: SiteType,
    default: SiteType.WEBSITE,
  })
  type: SiteType;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'verification_code' })
  verificationCode: string;

  @Column({ nullable: true, name: 'verified_at' })
  verifiedAt: Date;

  @Column({ name: 'publisher_id' })
  publisherId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sites)
  @JoinColumn({ name: 'publisher_id' })
  publisher: User;

  @OneToMany(() => Placement, (placement) => placement.site)
  placements: Placement[];
}
