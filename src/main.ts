import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/exceptions Filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // or "app.enableVersioning()"
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Enables auto-casting (e.g. String -> Number)
      // transformOptions: { enableImplicitConversion: true },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('FREIGHT API')
    .setDescription('FREIGHT API Documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('FREIGHT')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  // main.ts
  app.useGlobalFilters(new AllExceptionsFilter());
  // Global middleware
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : '*',
    credentials: true,
  });
  await app.register(compression);
  await app.register(helmet);

  // CSRF Protection
  // await app.register(fastifyCsrf);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
