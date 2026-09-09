import { BadRequestException, Controller, Post, Get, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  mark(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.mark(dto);
  }

  @Post('bulk')
  bulkMark(@Body() dto: BulkMarkAttendanceDto) {
    if (dto.records.length > 500) {
      throw new BadRequestException(
        { message: 'Batch size cannot exceed 500 records', error: 'Bad Request', statusCode: 400, errorCode: 'ATTENDANCE-002' },
        { errorCode: 'ATTENDANCE-002' },
      );
    }
    return this.attendanceService.bulkMark(dto);
  }

  @Get('grid')
  getGrid(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.getGrid(query);
  }

  @Get('member/:id')
  getMemberHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.getMemberHistory(id);
  }
}
