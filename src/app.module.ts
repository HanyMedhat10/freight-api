import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 60 seconds  // 1 minute
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 300000, // 5 minutes
        limit: 50, // 50 requests per 5 minutes for general endpoints
      },
      {
        name: 'large',
        ttl: 3600000, // 1 hour
        limit: 500, // 500 requests per hour for sustained usage
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    AppService,
  ],
})
export class AppModule {}
