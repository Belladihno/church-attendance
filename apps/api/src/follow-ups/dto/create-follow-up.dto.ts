import { IsString, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { FollowUpStatus } from '@church/types';

export class CreateFollowUpDto {
  @IsOptional()
  @IsUUID()
  memberId?: string | null;

  @IsOptional()
  @IsUUID()
  firstTimerId?: string | null;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @IsOptional()
  @IsEnum(FollowUpStatus)
  status?: FollowUpStatus;

  @IsOptional()
  @IsDateString()
  contactDate?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
