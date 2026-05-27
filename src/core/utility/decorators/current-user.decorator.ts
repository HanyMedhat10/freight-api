import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { User } from 'src/auth/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest & { user: User }>();
    return req.user;
  },
);
