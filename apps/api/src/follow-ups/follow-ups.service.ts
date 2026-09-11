import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FollowUp } from './entities/follow-up.entity';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { AttendanceStatus, MemberStatus } from '@church/types';

function getLastNSundays(n: number, from: Date = new Date()): string[] {
  const d = new Date(from);
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const s = new Date(d);
    s.setDate(d.getDate() - i * 7);
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, '0');
    const day = String(s.getDate()).padStart(2, '0');
    out.push(`${y}-${m}-${day}`);
  }
  return out.reverse();
}

@Injectable()
export class FollowUpsService {
  constructor(
    @InjectRepository(FollowUp)
    private followUpsRepo: Repository<FollowUp>,
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  private validateXor(dto: CreateFollowUpDto) {
    const hasMember = !!dto.memberId;
    const hasFirstTimer = !!dto.firstTimerId;
    if (hasMember === hasFirstTimer) {
      throw new BadRequestException(
        {
          message: 'Exactly one of memberId or firstTimerId must be provided',
          errorCode: 'FOLLOWUPS-001',
        },
        { errorCode: 'FOLLOWUPS-001' },
      );
    }
  }

  async create(dto: CreateFollowUpDto): Promise<FollowUp> {
    this.validateXor(dto);
    const followUp = this.followUpsRepo.create({
      memberId: dto.memberId ?? null,
      firstTimerId: dto.firstTimerId ?? null,
      reason: dto.reason,
      assignedTo: dto.assignedTo ?? null,
      status: dto.status ?? undefined,
      contactDate: dto.contactDate ?? null,
      notes: dto.notes ?? null,
    });
    return this.followUpsRepo.save(followUp);
  }

  async findAll(filter: { status?: string; assignedTo?: string }) {
    const where: any = {};
    if (filter.status) where.status = filter.status;
    if (filter.assignedTo) where.assignedTo = filter.assignedTo;
    return this.followUpsRepo.find({
      where,
      relations: { member: true, firstTimer: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FollowUp> {
    const fu = await this.followUpsRepo.findOne({
      where: { id },
      relations: { member: true, firstTimer: true },
    });
    if (!fu) {
      throw new NotFoundException(
        { message: 'Follow-up not found', errorCode: 'FOLLOWUPS-002' },
        { errorCode: 'FOLLOWUPS-002' },
      );
    }
    return fu;
  }

  async update(id: string, dto: UpdateFollowUpDto): Promise<FollowUp> {
    const fu = await this.findOne(id);
    if (dto.memberId !== undefined || dto.firstTimerId !== undefined) {
      const hasMember =
        dto.memberId !== undefined ? !!dto.memberId : !!fu.memberId;
      const hasFirstTimer =
        dto.firstTimerId !== undefined ? !!dto.firstTimerId : !!fu.firstTimerId;
      if (hasMember === hasFirstTimer) {
        throw new BadRequestException(
          {
            message: 'Exactly one of memberId or firstTimerId must be set',
            errorCode: 'FOLLOWUPS-001',
          },
          { errorCode: 'FOLLOWUPS-001' },
        );
      }
    }
    Object.assign(fu, dto);
    return this.followUpsRepo.save(fu);
  }

  async detectAbsences(threshold: number): Promise<Member[]> {
    const sundays = getLastNSundays(threshold);
    const members = await this.membersRepo.find({
      where: { status: MemberStatus.ACTIVE },
    });
    if (members.length === 0) return [];

    const attendances = await this.attendanceRepo.find({
      where: { date: In(sundays), status: AttendanceStatus.ABSENT },
    });

    // Build map memberId -> set of absent dates
    const absentMap = new Map<string, Set<string>>();
    for (const a of attendances) {
      if (!absentMap.has(a.memberId)) absentMap.set(a.memberId, new Set());
      absentMap.get(a.memberId)!.add(a.date);
    }

    const result: Member[] = [];
    for (const m of members) {
      const set = absentMap.get(m.id);
      if (!set) continue;
      // Check consecutive from most recent Sunday backward
      let consecutive = 0;
      for (let i = sundays.length - 1; i >= 0; i--) {
        if (set.has(sundays[i])) consecutive++;
        else break;
      }
      if (consecutive >= threshold) result.push(m);
    }
    return result;
  }
}
