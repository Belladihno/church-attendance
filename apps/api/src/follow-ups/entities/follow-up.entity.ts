import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FollowUpStatus } from '@church/types';
import { Member } from '../../members/entities/member.entity';
import { FirstTimer } from '../../first-timers/entities/first-timer.entity';

@Entity('follow_ups')
export class FollowUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'member_id', nullable: true })
  memberId: string | null;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member | null;

  @Column({ type: 'uuid', name: 'first_timer_id', nullable: true })
  firstTimerId: string | null;

  @ManyToOne(() => FirstTimer, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'first_timer_id' })
  firstTimer: FirstTimer | null;

  @Column({ type: 'varchar' })
  reason: string;

  @Column({ type: 'varchar', name: 'assigned_to', nullable: true })
  assignedTo: string | null;

  @Column({ type: 'enum', enum: FollowUpStatus, default: FollowUpStatus.PENDING })
  status: FollowUpStatus;

  @Column({ type: 'date', name: 'contact_date', nullable: true })
  contactDate: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
