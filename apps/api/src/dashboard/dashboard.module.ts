import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FirstTimer } from '../first-timers/entities/first-timer.entity';
import { AttendanceModule } from '../attendance/attendance.module';
import { FollowUpsModule } from '../follow-ups/follow-ups.module';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Attendance, FirstTimer]), AttendanceModule, FollowUpsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
