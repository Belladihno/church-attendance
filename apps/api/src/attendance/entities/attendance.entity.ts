import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { AttendanceStatus, ServiceType } from '@church/types';
import { Member } from '../../members/entities/member.entity';

@Entity('attendances')
@Unique('UQ_attendance_member_date_service', ['memberId', 'date', 'serviceType'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'member_id' })
  memberId: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: ServiceType, name: 'service_type' })
  serviceType: ServiceType;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
