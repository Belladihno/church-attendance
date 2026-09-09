import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, MemberStatus } from '@church/types';

export class MemberFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  sundaySchoolClass?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
