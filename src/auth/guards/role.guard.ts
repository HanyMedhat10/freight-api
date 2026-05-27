import {
  CanActivate,
  Injectable,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import type { Role } from '../entities/enum/user.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user: { role: string } }>();
    return requiredRoles.some((role) => role === request.user.role);
  }
}
