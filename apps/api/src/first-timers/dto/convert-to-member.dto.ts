import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { MemberStatus, ChurchRole, Department } from '@church/types';

export class ConvertToMemberDto {
  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsEnum(ChurchRole)
  churchRole?: ChurchRole;

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
