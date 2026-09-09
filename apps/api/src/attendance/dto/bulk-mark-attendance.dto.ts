import { IsArray, IsDateString, IsEnum, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, ServiceType } from '@church/types';

export class BulkRecordDto {
  @IsUUID()
  memberId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class BulkMarkAttendanceDto {
  @IsDateString()
  date: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkRecordDto)
  records: BulkRecordDto[];
}
