import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Gender, MemberStatus } from '@church/types';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', name: 'church_role' })
  churchRole: string;

  @Column({ type: 'varchar' })
  department: string;

  @Column({ type: 'varchar', name: 'sunday_school_class', nullable: true })
  sundaySchoolClass: string | null;

  @Column({ type: 'enum', enum: MemberStatus })
  status: MemberStatus;

  @Column({ type: 'date', name: 'date_joined' })
  dateJoined: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
