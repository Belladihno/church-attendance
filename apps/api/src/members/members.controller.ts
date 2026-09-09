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
import { UserRole } from '@church/types';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Get()
  findAll(@Query() filter: MemberFilterDto) {
    return this.membersService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.findOne(id);
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
