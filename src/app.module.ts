import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';
import { TransformInterceptor } from './core/exceptions Filters/transform.interceptor';
import { ShipmentModule } from './shipment/shipment.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: configService.get<number>('PGPORT'),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Disable synchronize in production for safety
        logging: configService.get<string>('NODE_ENV') === 'development', // Enable logging in development
      }),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
