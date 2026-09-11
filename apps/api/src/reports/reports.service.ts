import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FollowUp } from '../follow-ups/entities/follow-up.entity';
import {
  AttendanceStatus,
  FollowUpStatus,
  MemberStatus,
  ServiceType,
} from '@church/types';

const WINDOW = 8;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function lastNSundays(n: number, from: Date = new Date()): string[] {
  const d = new Date(from);
  while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const s = new Date(d);
    s.setDate(d.getDate() - i * 7);
    out.push(toISODate(s));
  }
  return out.reverse();
}

export type DeptRow = { department: string; enrolled: number; rate: number | null };

export type FlaggedRow = {
  memberId: string;
  name: string;
  phone: string;
  department: string | null;
  churchRole: string;
  streak: number;
  reason: string | null;
  assignedTo: string | null;
  hasOpenTicket: boolean;
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(FollowUp)
    private followUpsRepo: Repository<FollowUp>,
  ) {}

  async getOverview() {
    const sundays = lastNSundays(WINDOW);

    const totalMembers = await this.membersRepo.count({
      where: { status: MemberStatus.ACTIVE },
    });

    const members = await this.membersRepo.find({
      where: { status: MemberStatus.ACTIVE },
    });
    const deptOf = new Map<string, string | null>();
    const memberById = new Map<string, Member>();
    for (const m of members) {
      deptOf.set(m.id, m.department);
      memberById.set(m.id, m);
    }

    const present = await this.attendanceRepo.find({
      where: { date: In(sundays), status: AttendanceStatus.PRESENT },
    });
    const absent = await this.attendanceRepo.find({
      where: { date: In(sundays), status: AttendanceStatus.ABSENT },
    });

    // Per-Sunday series for both service types
    const series = sundays.map((date) => ({
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
      main: present.filter(
        (r) => r.date === date && r.serviceType === ServiceType.SUNDAY_SERVICE,
      ).length,
      school: present.filter(
        (r) => r.date === date && r.serviceType === ServiceType.SUNDAY_SCHOOL,
      ).length,
    }));

    const mainCounts = series.map((s) => s.main);
    const avgAttendance =
      mainCounts.length > 0
        ? mainCounts.reduce((a, b) => a + b, 0) / mainCounts.length
        : 0;
    const half = Math.floor(mainCounts.length / 2);
    const prevAvg =
      half > 0
        ? mainCounts.slice(0, half).reduce((a, b) => a + b, 0) / half
        : 0;
    const currAvg =
      mainCounts.length - half > 0
        ? mainCounts.slice(half).reduce((a, b) => a + b, 0) /
          (mainCounts.length - half)
        : 0;
    const avgDeltaPct = prevAvg > 0 ? ((currAvg - prevAvg) / prevAvg) * 100 : 0;

    const attendanceRate =
      totalMembers > 0 && sundays.length > 0
        ? (mainCounts.reduce((a, b) => a + b, 0) /
            (totalMembers * sundays.length)) *
          100
        : 0;

    // Participation: active members present at least once in the window
    const everPresent = new Set(present.map((r) => r.memberId));
    const participation =
      totalMembers > 0 ? (everPresent.size / totalMembers) * 100 : 0;

    const mainTotal = mainCounts.reduce((a, b) => a + b, 0);
    const schoolTotal = series.map((s) => s.school).reduce((a, b) => a + b, 0);

    // Department consistency (Sunday Service)
    const enrolledByDept = new Map<string, number>();
    for (const m of members) {
      const key = m.department ?? 'NONE';
      enrolledByDept.set(key, (enrolledByDept.get(key) ?? 0) + 1);
    }
    const presentByDept = new Map<string, number>();
    for (const r of present) {
      if (r.serviceType !== ServiceType.SUNDAY_SERVICE) continue;
      const dept = deptOf.get(r.memberId) ?? 'NONE';
      presentByDept.set(dept, (presentByDept.get(dept) ?? 0) + 1);
    }
    const departments: DeptRow[] = [...enrolledByDept.entries()]
      .map(([department, enrolled]) => ({
        department,
        enrolled,
        rate:
          enrolled > 0 && sundays.length > 0
            ? ((presentByDept.get(department) ?? 0) / (enrolled * sundays.length)) * 100
            : null,
      }))
      .sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));

    // Absence streaks from most recent Sunday backward
    const absentByMember = new Map<string, Set<string>>();
    for (const r of absent) {
      if (!absentByMember.has(r.memberId)) absentByMember.set(r.memberId, new Set());
      absentByMember.get(r.memberId)!.add(r.date);
    }
    const streakOf = (memberId: string): number => {
      const set = absentByMember.get(memberId);
      if (!set) return 0;
      let streak = 0;
      for (let i = sundays.length - 1; i >= 0; i--) {
        if (set.has(sundays[i])) streak++;
        else break;
      }
      return streak;
    };

    const openTickets = await this.followUpsRepo.find({
      where: { status: In([FollowUpStatus.PENDING, FollowUpStatus.CONTACTED]) },
    });
    const ticketByMember = new Map<string, FollowUp>();
    for (const t of openTickets) {
      if (t.memberId && !ticketByMember.has(t.memberId)) ticketByMember.set(t.memberId, t);
    }

    const flagged: FlaggedRow[] = [];
    for (const m of members) {
      const streak = streakOf(m.id);
      if (streak < 2) continue;
      const ticket = ticketByMember.get(m.id);
      flagged.push({
        memberId: m.id,
        name: `${m.firstName} ${m.lastName}`,
        phone: m.phone,
        department: m.department,
        churchRole: m.churchRole,
        streak,
        reason: ticket?.reason ?? null,
        assignedTo: ticket?.assignedTo ?? null,
        hasOpenTicket: !!ticket,
      });
    }
    flagged.sort((a, b) => b.streak - a.streak);

    const threePlus = flagged.filter((f) => f.streak >= 3).length;

    return {
      totalMembers,
      sundayCount: sundays.length,
      range: { from: sundays[0] ?? null, to: sundays[sundays.length - 1] ?? null },
      avgAttendance: Math.round(avgAttendance * 10) / 10,
      avgDeltaPct: Math.round(avgDeltaPct * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      participation: Math.round(participation * 10) / 10,
      absence: {
        total: flagged.length,
        twoOnly: flagged.length - threePlus,
        threePlus,
      },
      series,
      breakdown: {
        mainAvg: Math.round((mainTotal / Math.max(1, sundays.length)) * 10) / 10,
        schoolAvg: Math.round((schoolTotal / Math.max(1, sundays.length)) * 10) / 10,
      },
      departments,
      flagged,
    };
  }
}
