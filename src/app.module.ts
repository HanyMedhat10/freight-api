import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';
import { ShipmentModule } from './shipment/shipment.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      autoLoadEntities: true,
      synchronize: true, // will the project production is false
    }),
    ConfigModule.forRoot(),

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

    AuthModule,

    ContractModule,

    ShipmentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    AppService,
  ],
})
export class AppModule {}
