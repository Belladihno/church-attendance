import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FirstTimer } from '../first-timers/entities/first-timer.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { FollowUpsService } from '../follow-ups/follow-ups.service';
import { AttendanceStatus, MemberStatus, ServiceType } from '@church/types';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(FirstTimer)
    private firstTimersRepo: Repository<FirstTimer>,
    private attendanceService: AttendanceService,
    private followUpsService: FollowUpsService,
  ) {}

  private getLatestSunday(): string {
    const d = new Date();
    while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  async getOverview(month?: number, year?: number, userId?: string) {
    this.logger.log('Dashboard overview requested', { month, year, userId });

    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const totalMembers = await this.membersRepo.count({
      where: { status: MemberStatus.ACTIVE },
    });

    const latestSunday = this.getLatestSunday();
    const presentToday = await this.attendanceRepo.count({
      where: {
        date: latestSunday,
        status: AttendanceStatus.PRESENT,
        serviceType: ServiceType.SUNDAY_SERVICE,
      },
    });
    const absentToday = await this.attendanceRepo.count({
      where: {
        date: latestSunday,
        status: AttendanceStatus.ABSENT,
        serviceType: ServiceType.SUNDAY_SERVICE,
      },
    });

    const attendanceRate =
      totalMembers > 0 ? (presentToday / totalMembers) * 100 : 0;

    const trend = await this.attendanceService.getTrend(
      ServiceType.SUNDAY_SERVICE,
    );

    const twoWeeks = (await this.followUpsService.detectAbsences(2)).length;
    const threeOrMore = (await this.followUpsService.detectAbsences(3)).length;

    const start = new Date(targetYear, targetMonth - 1, 1)
      .toISOString()
      .slice(0, 10);
    const end = new Date(targetYear, targetMonth, 0).toISOString().slice(0, 10);
    const firstTimersThisMonth = await this.firstTimersRepo.count({
      where: { dateAttended: Between(start, end) } as unknown as FindOptionsWhere<FirstTimer>,
    });

    return {
      totalMembers,
      presentToday,
      absentToday,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      trend,
      followUpRequired: { twoWeeks, threeOrMore },
      firstTimersThisMonth,
    };
  }

  async getAbsentMembers(threshold: number) {
    return this.followUpsService.detectAbsences(threshold);
  }
}
