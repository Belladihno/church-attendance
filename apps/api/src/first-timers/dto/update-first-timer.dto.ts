import { PartialType } from '@nestjs/mapped-types';
import { CreateFirstTimerDto } from './create-first-timer.dto';

export class UpdateFirstTimerDto extends PartialType(CreateFirstTimerDto) {}
