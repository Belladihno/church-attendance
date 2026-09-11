import { IsOptional, IsInt, IsEnum, IsUUID, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType, Department } from '@church/types';

export class AttendanceQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsUUID()
  memberId?: string;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;
}
