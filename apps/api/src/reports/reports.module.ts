import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FollowUp } from '../follow-ups/entities/follow-up.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Attendance, FollowUp])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
