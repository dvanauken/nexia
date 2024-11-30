import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }


  // jwt.strategy.ts
  async validate(payload: any) {
    console.log('JWT strategy validate called with payload:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    console.log('Type of user:', typeof user);
    console.log('User properties:', Object.keys(user));

    return {
      userId: payload.sub,
      email: payload.email,
      role: 'ADMIN'  // Hardcode temporarily to see if the rest works
    };
  }
}