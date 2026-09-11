import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Gender, MemberStatus, ChurchRole, Department } from '@church/types';

export class CreateMemberDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsEnum(ChurchRole)
  churchRole: ChurchRole;

  @IsOptional()
  @IsEnum(Department)
  department?: Department | null;

  @IsOptional()
  @IsString()
  sundaySchoolClass?: string | null;

  @IsEnum(MemberStatus)
  status: MemberStatus;

  @IsDateString()
  dateJoined: string;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
