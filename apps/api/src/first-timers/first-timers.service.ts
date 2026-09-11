import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  OptimisticLockVersionMismatchError,
} from 'typeorm';
import { FirstTimer } from './entities/first-timer.entity';
import { Member } from '../members/entities/member.entity';
import { CreateFirstTimerDto } from './dto/create-first-timer.dto';
import { UpdateFirstTimerDto } from './dto/update-first-timer.dto';
import { ConvertToMemberDto } from './dto/convert-to-member.dto';
import { FirstTimerFollowUpStatus, MemberStatus, Gender, ChurchRole, Department } from '@church/types';
import { isPgUniqueViolation } from '../common/errors/pg-error';

@Injectable()
export class FirstTimersService {
  constructor(
    @InjectRepository(FirstTimer)
    private firstTimersRepo: Repository<FirstTimer>,
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateFirstTimerDto): Promise<FirstTimer> {
    const ft = this.firstTimersRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      gender: dto.gender,
      address: dto.address ?? null,
      dateAttended: dto.dateAttended,
      serviceAttended: dto.serviceAttended,
      invitedBy: dto.invitedBy ?? null,
      howHeard: dto.howHeard ?? null,
      followUpStatus: dto.followUpStatus ?? FirstTimerFollowUpStatus.PENDING,
      followUpNotes: dto.followUpNotes ?? null,
    });
    try {
      return await this.firstTimersRepo.save(ft);
    } catch (e) {
      if (isPgUniqueViolation(e, 'UQ_first_timers_phone_date')) {
        throw new ConflictException(
          {
            message:
              'First timer with this phone already registered for this date',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'FIRSTTIMERS-003',
          },
          { errorCode: 'FIRSTTIMERS-003' },
        );
      }
      throw e;
    }
  }

  async findAll(filter: {
    followUpStatus?: string;
    from?: string;
    to?: string;
  }) {
    const qb = this.firstTimersRepo.createQueryBuilder('ft');
    if (filter.followUpStatus) {
      qb.andWhere('ft.followUpStatus = :status', {
        status: filter.followUpStatus,
      });
    }
    if (filter.from) {
      qb.andWhere('ft.dateAttended >= :from', { from: filter.from });
    }
    if (filter.to) {
      qb.andWhere('ft.dateAttended <= :to', { to: filter.to });
    }
    qb.orderBy('ft.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string): Promise<FirstTimer> {
    const ft = await this.firstTimersRepo.findOne({ where: { id } });
    if (!ft) {
      throw new NotFoundException(
        { message: 'First timer not found', errorCode: 'FIRSTTIMERS-001' },
        { errorCode: 'FIRSTTIMERS-001' },
      );
    }
    return ft;
  }

  async update(id: string, dto: UpdateFirstTimerDto): Promise<FirstTimer> {
    const ft = await this.findOne(id);
    Object.assign(ft, dto);
    try {
      return await this.firstTimersRepo.save(ft);
    } catch (e) {
      if (e instanceof OptimisticLockVersionMismatchError) {
        throw new ConflictException(
          {
            message:
              'First timer was updated by another request. Please reload and retry',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'FIRSTTIMERS-004',
          },
          { errorCode: 'FIRSTTIMERS-004' },
        );
      }
      if (isPgUniqueViolation(e, 'UQ_first_timers_phone_date')) {
        throw new ConflictException(
          {
            message: 'Phone already registered for this date',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'FIRSTTIMERS-003',
          },
          { errorCode: 'FIRSTTIMERS-003' },
        );
      }
      throw e;
    }
  }

  async convert(
    id: string,
    dto: ConvertToMemberDto,
  ): Promise<{ member: Member; firstTimer: FirstTimer }> {
    return this.dataSource.transaction(async (manager) => {
      // Pessimistic lock to prevent concurrent converts
      const ft = await manager.findOne(FirstTimer, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!ft) {
        throw new NotFoundException(
          { message: 'First timer not found', errorCode: 'FIRSTTIMERS-001' },
          { errorCode: 'FIRSTTIMERS-001' },
        );
      }
      if (ft.followUpStatus === FirstTimerFollowUpStatus.CONVERTED) {
        throw new ConflictException(
          { message: 'Already converted', errorCode: 'FIRSTTIMERS-002' },
          { errorCode: 'FIRSTTIMERS-002' },
        );
      }

      const memberRepo = manager.getRepository(Member);
      const ftRepo = manager.getRepository(FirstTimer);

      const member = memberRepo.create({
        firstName: ft.firstName,
        lastName: ft.lastName,
        phone: ft.phone,
        gender: ft.gender as unknown as Gender,
        address: ft.address ?? '',
        churchRole: dto.churchRole ?? ChurchRole.MEMBER,
        department: dto.department ?? Department.NONE,
        sundaySchoolClass: dto.sundaySchoolClass ?? null,
        status: dto.status ?? MemberStatus.ACTIVE,
        dateJoined: dto.dateJoined ?? new Date().toISOString().slice(0, 10),
        notes: dto.notes ?? ft.followUpNotes ?? null,
      });

      let savedMember: Member;
      try {
        savedMember = await memberRepo.save(member);
      } catch (e) {
        if (isPgUniqueViolation(e, 'UQ_members_phone')) {
          throw new ConflictException(
            {
              message: 'Phone already exists as member',
              error: 'Conflict',
              statusCode: 409,
              errorCode: 'MEMBERS-002',
            },
            { errorCode: 'MEMBERS-002' },
          );
        }
        throw e;
      }

      ft.convertedToId = savedMember.id;
      ft.followUpStatus = FirstTimerFollowUpStatus.CONVERTED;
      try {
        const savedFt = await ftRepo.save(ft);
        return { member: savedMember, firstTimer: savedFt };
      } catch (e) {
        if (e instanceof OptimisticLockVersionMismatchError) {
          throw new ConflictException(
            {
              message: 'First timer was updated by another request',
              error: 'Conflict',
              statusCode: 409,
              errorCode: 'FIRSTTIMERS-004',
            },
            { errorCode: 'FIRSTTIMERS-004' },
          );
        }
        throw e;
      }
    });
  }
}
