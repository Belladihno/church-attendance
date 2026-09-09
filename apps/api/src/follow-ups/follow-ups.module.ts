import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowUp } from './entities/follow-up.entity';
import { Member } from '../members/entities/member.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FollowUpsService } from './follow-ups.service';
import { FollowUpsController } from './follow-ups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FollowUp, Member, Attendance])],
  controllers: [FollowUpsController],
  providers: [FollowUpsService],
  exports: [FollowUpsService],
})
export class FollowUpsModule {}
