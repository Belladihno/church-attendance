import { IsString, IsEnum, IsOptional, IsDateString, MinLength } from 'class-validator';
import { Gender, ServiceType, FirstTimerFollowUpStatus } from '@church/types';

export class CreateFirstTimerDto {
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

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsDateString()
  dateAttended: string;

  @IsEnum(ServiceType)
  serviceAttended: ServiceType;

  @IsOptional()
  @IsString()
  invitedBy?: string | null;

  @IsOptional()
  @IsString()
  howHeard?: string | null;

  @IsOptional()
  @IsEnum(FirstTimerFollowUpStatus)
  followUpStatus?: FirstTimerFollowUpStatus;

  @IsOptional()
  @IsString()
  followUpNotes?: string | null;
}
