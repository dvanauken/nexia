import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // auth.service.ts
  async validateUser(email: string, password: string) {
    console.log('validateUser called with email:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log('User found in database:', user);
    if (user && user.password === password) {
      console.log('Password matches');
      return user;
    }
    console.log('Password mismatch or user not found');
    return null;
  }

  async login(email: string, password: string) {
    try {
      console.log('Login attempt for:', email);
      const user = await this.validateUser(email, password);
      console.log('User found:', user);
      if (!user) {
        throw new UnauthorizedException();
      }
      const token = this.jwtService.sign({ email: user.email, sub: user.id });
      console.log('Token generated successfully');
      return { access_token: token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

}