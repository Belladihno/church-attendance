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
import { FollowUpsService } from './follow-ups.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';

@Controller('follow-ups')
export class FollowUpsController {
  constructor(private followUpsService: FollowUpsService) {}

  @Get('detect')
  detect(@Query('threshold') threshold = '2') {
    return this.followUpsService.detectAbsences(parseInt(threshold, 10) || 2);
  }

  @Post()
  create(@Body() dto: CreateFollowUpDto) {
    return this.followUpsService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.followUpsService.findAll({ status, assignedTo });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.followUpsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFollowUpDto,
  ) {
    return this.followUpsService.update(id, dto);
  }
}
