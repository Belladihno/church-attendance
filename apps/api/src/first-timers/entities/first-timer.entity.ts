import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  VersionColumn,
} from 'typeorm';
import { Gender, ServiceType, FirstTimerFollowUpStatus } from '@church/types';
import { Member } from '../../members/entities/member.entity';

@Entity('first_timers')
@Unique('UQ_first_timers_phone_date', ['phone', 'dateAttended'])
export class FirstTimer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'date', name: 'date_attended' })
  dateAttended: string;

  @Column({ type: 'enum', enum: ServiceType, name: 'service_attended' })
  serviceAttended: ServiceType;

  @Column({ type: 'varchar', name: 'invited_by', nullable: true })
  invitedBy: string | null;

  @Column({ type: 'varchar', name: 'how_heard', nullable: true })
  howHeard: string | null;

  @Column({
    type: 'enum',
    enum: FirstTimerFollowUpStatus,
    name: 'follow_up_status',
    default: FirstTimerFollowUpStatus.PENDING,
  })
  followUpStatus: FirstTimerFollowUpStatus;

  @Column({ type: 'text', name: 'follow_up_notes', nullable: true })
  followUpNotes: string | null;

  @Column({ type: 'uuid', name: 'converted_to_id', nullable: true })
  convertedToId: string | null;

  @ManyToOne(() => Member, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'converted_to_id' })
  convertedTo: Member | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
