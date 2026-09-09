import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { MemberStatus } from '@church/types';

export class ConvertToMemberDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  churchRole?: string;

  @IsOptional()
  @IsString()
  sundaySchoolClass?: string | null;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  @IsDateString()
  dateJoined?: string;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
