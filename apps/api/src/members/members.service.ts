import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, OptimisticLockVersionMismatchError } from 'typeorm';
import { Member } from './entities/member.entity';
import { isPgUniqueViolation } from '../common/errors/pg-error';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberFilterDto } from './dto/member-filter.dto';
import { MemberStatus } from '@church/types';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepo: Repository<Member>,
  ) {}

  async create(dto: CreateMemberDto): Promise<Member> {
    const member = this.membersRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      gender: dto.gender,
      address: dto.address,
      churchRole: dto.churchRole,
      department: dto.department,
      sundaySchoolClass: dto.sundaySchoolClass ?? null,
      status: dto.status,
      dateJoined: dto.dateJoined,
      notes: dto.notes ?? null,
    });
    try {
      return await this.membersRepo.save(member);
    } catch (e) {
      if (isPgUniqueViolation(e, 'UQ_members_phone')) {
        throw new ConflictException(
          {
            message: 'Member with this phone already exists',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'MEMBERS-002',
          },
          { errorCode: 'MEMBERS-002' },
        );
      }
      throw e;
    }
  }

  async findAll(
    filter: MemberFilterDto,
  ): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const qb = this.membersRepo.createQueryBuilder('member');

    if (filter.search) {
      qb.andWhere(
        '(member.firstName ILIKE :search OR member.lastName ILIKE :search OR member.phone ILIKE :search)',
        { search: `%${filter.search}%` },
      );
    }
    if (filter.status) {
      qb.andWhere('member.status = :status', { status: filter.status });
    }
    if (filter.gender) {
      qb.andWhere('member.gender = :gender', { gender: filter.gender });
    }
    if (filter.department) {
      qb.andWhere('member.department = :department', {
        department: filter.department,
      });
    }
    if (filter.sundaySchoolClass) {
      qb.andWhere('member.sundaySchoolClass = :scc', {
        scc: filter.sundaySchoolClass,
      });
    }

    qb.orderBy('member.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.membersRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(
        {
          message: 'Member not found',
          error: 'Not Found',
          statusCode: 404,
          errorCode: 'MEMBERS-001',
        },
        { errorCode: 'MEMBERS-001' },
      );
    }
    return member;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);
    Object.assign(member, dto);
    try {
      return await this.membersRepo.save(member);
    } catch (e) {
      if (e instanceof OptimisticLockVersionMismatchError) {
        throw new ConflictException(
          {
            message:
              'Member was updated by another request. Please reload and retry',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'MEMBERS-003',
          },
          { errorCode: 'MEMBERS-003' },
        );
      }
      if (isPgUniqueViolation(e, 'UQ_members_phone')) {
        throw new ConflictException(
          {
            message: 'Phone already exists',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'MEMBERS-002',
          },
          { errorCode: 'MEMBERS-002' },
        );
      }
      throw e;
    }
  }

  async softDelete(id: string): Promise<Member> {
    const member = await this.findOne(id);
    member.status = MemberStatus.INACTIVE;
    try {
      return await this.membersRepo.save(member);
    } catch (e) {
      if (e instanceof OptimisticLockVersionMismatchError) {
        throw new ConflictException(
          {
            message:
              'Member was updated by another request. Please reload and retry',
            error: 'Conflict',
            statusCode: 409,
            errorCode: 'MEMBERS-003',
          },
          { errorCode: 'MEMBERS-003' },
        );
      }
      throw e;
    }
  }
}
