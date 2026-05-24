import compression from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // or "app.enableVersioning()"
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Global middleware
  app.enableCors();
  await app.register(compression);
  await app.register(helmet);

  // CSRF Protection
  await app.register(fastifyCsrf);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
