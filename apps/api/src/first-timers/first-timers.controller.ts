import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FirstTimersService } from './first-timers.service';
import { CreateFirstTimerDto } from './dto/create-first-timer.dto';
import { UpdateFirstTimerDto } from './dto/update-first-timer.dto';
import { ConvertToMemberDto } from './dto/convert-to-member.dto';

@Controller('first-timers')
export class FirstTimersController {
  constructor(private firstTimersService: FirstTimersService) {}

  @Post()
  create(@Body() dto: CreateFirstTimerDto) {
    return this.firstTimersService.create(dto);
  }

  @Get()
  findAll(
    @Query('followUpStatus') followUpStatus?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.firstTimersService.findAll({ followUpStatus, from, to });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.firstTimersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFirstTimerDto,
  ) {
    return this.firstTimersService.update(id, dto);
  }

  @Post(':id/convert')
  convert(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ConvertToMemberDto,
  ) {
    return this.firstTimersService.convert(id, dto);
  }
}
