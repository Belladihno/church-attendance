import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Member } from './members/entities/member.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { FirstTimer } from './first-timers/entities/first-timer.entity';
import { FollowUp } from './follow-ups/entities/follow-up.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FollowUpsModule } from './follow-ups/follow-ups.module';
import { FirstTimersModule } from './first-timers/first-timers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const isNeon = host?.includes('neon.tech');
        return {
          type: 'postgres',
          host,
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          ssl: isNeon ? { rejectUnauthorized: false } : false, // Neon requires SSL; local pgAdmin does not
          synchronize: false,
          migrations: ['dist/migrations/*.js'],
          entities: [User, Member, Attendance, FirstTimer, FollowUp],
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MembersModule,
    AttendanceModule,
    FollowUpsModule,
    FirstTimersModule,
    DashboardModule,
    ReportsModule,
    ThrottlerModule.forRoot({
      // Generous global ceiling; sensitive routes override with @Throttle.
      // NOTE: in-memory storage — correct for a single instance. If the API
      // ever scales horizontally, switch storage to Redis.
      throttlers: [{ name: 'default', limit: 120, ttl: 60000 }],
      errorMessage: 'Too many requests. Please wait a moment and try again.',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
