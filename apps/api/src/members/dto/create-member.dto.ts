import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Gender, MemberStatus } from '@church/types';

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

  @IsString()
  churchRole: string;

  @IsString()
  department: string;

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
