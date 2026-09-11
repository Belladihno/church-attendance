import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Member } from '../members/entities/member.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { AttendanceStatus, MemberStatus, ServiceType } from '@church/types';

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const SYSTEM_START = { year: 2026, month: 9 };

function getSundaysOfMonth(year: number, month: number): string[] {
  if (year < SYSTEM_START.year || (year === SYSTEM_START.year && month < SYSTEM_START.month)) return [];
  const sundays: string[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    if (date.getDay() === 0) {
      sundays.push(toISODate(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return sundays;
}

function getLastNSundays(n: number, from: Date = new Date()): string[] {
  const sundays: string[] = [];
  const d = new Date(from);
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  for (let i = 0; i < n; i++) {
    const s = new Date(d);
    s.setDate(d.getDate() - i * 7);
    sundays.push(toISODate(s));
  }
  return sundays.reverse();
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
  ) {}

  // Single mark — atomic upsert, no TOCTOU
  async mark(dto: MarkAttendanceDto): Promise<Attendance> {
    const member = await this.membersRepo.findOne({ where: { id: dto.memberId } });
    if (!member)
      throw new NotFoundException(
        { message: 'Member not found', error: 'Not Found', statusCode: 404, errorCode: 'ATTENDANCE-001' },
        { errorCode: 'ATTENDANCE-001' },
      );

    const result = await this.attendanceRepo
      .createQueryBuilder()
      .insert()
      .into(Attendance)
      .values({
        memberId: dto.memberId,
        date: dto.date,
        serviceType: dto.serviceType,
        status: dto.status,
      })
      .orUpdate(['status'], ['member_id', 'date', 'service_type'])
      .returning('*')
      .execute();

    return result.raw[0];
  }

  // Bulk mark — single upsert for whole batch, no transaction needed
  async bulkMark(dto: BulkMarkAttendanceDto): Promise<void> {
    if (!dto.records.length) return;

    const values = dto.records.map((r) => ({
      memberId: r.memberId,
      date: dto.date,
      serviceType: dto.serviceType,
      status: r.status,
    }));

    await this.attendanceRepo
      .createQueryBuilder()
      .insert()
      .into(Attendance)
      .values(values)
      .orUpdate(['status'], ['member_id', 'date', 'service_type'])
      .execute();
  }

  async getGrid(query: AttendanceQueryDto) {
    const sundays = getSundaysOfMonth(query.year, query.month);
    const where: any = { status: MemberStatus.ACTIVE };
    if (query.department) where.department = query.department;
    const members = await this.membersRepo.find({
      where,
      order: { lastName: 'ASC', firstName: 'ASC' },
    });

    const attendances = sundays.length
      ? await this.attendanceRepo.find({
          where: { serviceType: query.serviceType, date: In(sundays) },
        })
      : [];

    const map = new Map<string, AttendanceStatus>();
    for (const a of attendances) {
      map.set(`${a.memberId}|${a.date}`, a.status);
    }

    const grid = members.map((m) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      dateJoined: m.dateJoined,
      records: sundays.map((d) => map.get(`${m.id}|${d}`) ?? null),
    }));

    return { sundays, members: grid };
  }

  async getMemberHistory(memberId: string) {
    return this.attendanceRepo.find({
      where: { memberId },
      order: { date: 'DESC' },
    });
  }

  async getAttendanceRate(
    memberId: string,
    serviceType: ServiceType,
  ): Promise<number> {
    const member = await this.membersRepo.findOne({ where: { id: memberId } });
    if (!member)
      throw new NotFoundException(
        {
          message: 'Member not found',
          error: 'Not Found',
          statusCode: 404,
          errorCode: 'ATTENDANCE-001',
        },
        { errorCode: 'ATTENDANCE-001' },
      );
    const records = await this.attendanceRepo.find({
      where: { memberId, serviceType },
      order: { date: 'ASC' },
    });
    // Denominator = Sundays from dateJoined onward where a record exists
    const eligible = records.filter((r) => r.date >= member.dateJoined);
    if (eligible.length === 0) return 0;
    const present = eligible.filter(
      (r) => r.status === AttendanceStatus.PRESENT,
    ).length;
    return (present / eligible.length) * 100;
  }

  async getTrend(
    serviceType: ServiceType,
  ): Promise<{ previous: number; current: number; delta: number }> {
    const sundays = getLastNSundays(8);
    const prevSundays = sundays.slice(0, 4);
    const currSundays = sundays.slice(4, 8);

    const calc = async (dates: string[]) => {
      if (dates.length === 0) return 0;
      const records = await this.attendanceRepo.find({
        where: { date: In(dates), serviceType },
      });
      const totalMembers = await this.membersRepo.count({
        where: { status: MemberStatus.ACTIVE },
      });
      if (totalMembers === 0) return 0;
      // For each Sunday, rate = present / totalMembers
      let sum = 0;
      for (const d of dates) {
        const present = records.filter(
          (r) => r.date === d && r.status === AttendanceStatus.PRESENT,
        ).length;
        sum += (present / totalMembers) * 100;
      }
      return sum / dates.length;
    };

    const previous = await calc(prevSundays);
    const current = await calc(currSundays);
    return { previous, current, delta: current - previous };
  }
}