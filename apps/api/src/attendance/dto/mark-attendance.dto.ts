import { IsEnum, IsUUID, IsDateString } from 'class-validator';
import { AttendanceStatus, ServiceType } from '@church/types';

export class MarkAttendanceDto {
  @IsUUID()
  memberId: string;

  @IsDateString()
  date: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
