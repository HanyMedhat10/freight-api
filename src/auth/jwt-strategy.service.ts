import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
export interface JwtPayload {
  id: string; // or number, depending on your database
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload) {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };
  }
}
