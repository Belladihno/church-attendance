import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstTimer } from './entities/first-timer.entity';
import { Member } from '../members/entities/member.entity';
import { FirstTimersService } from './first-timers.service';
import { FirstTimersController } from './first-timers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FirstTimer, Member])],
  controllers: [FirstTimersController],
  providers: [FirstTimersService],
  exports: [FirstTimersService],
})
export class FirstTimersModule {}
