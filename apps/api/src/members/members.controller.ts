import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberFilterDto } from './dto/member-filter.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, ServiceType } from '@church/types';
import { AttendanceService } from '../attendance/attendance.service';

@Controller('members')
export class MembersController {
  constructor(
    private membersService: MembersService,
    private attendanceService: AttendanceService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Get()
  findAll(@Query() filter: MemberFilterDto) {
    return this.membersService.findAll(filter);
  }

  @Get('stats/overview')
  getStats() {
    return this.membersService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const member = await this.membersService.findOne(id);
    const [rate, history] = await Promise.all([
      this.attendanceService.getAttendanceRate(id, ServiceType.SUNDAY_SERVICE),
      this.attendanceService.getMemberHistory(id),
    ]);
    return { ...member, attendance: { rate: Math.round(rate * 10) / 10, history: history.slice(0, 12) } };
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.softDelete(id);
  }
}
