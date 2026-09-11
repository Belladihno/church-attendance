import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // Same response for unknown email and wrong password (no user enumeration)
    const invalid = () =>
      new UnauthorizedException(
        {
          message: 'Invalid email or password',
          error: 'Unauthorized',
          statusCode: 401,
          errorCode: 'AUTH-001',
        },
        { errorCode: 'AUTH-001' },
      );
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw invalid();
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw invalid();
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
