import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Member } from './members/entities/member.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { FirstTimer } from './first-timers/entities/first-timer.entity';
import { FollowUp } from './follow-ups/entities/follow-up.entity';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
