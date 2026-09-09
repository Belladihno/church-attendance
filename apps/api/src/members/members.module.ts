import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), forwardRef(() => AttendanceModule)],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
