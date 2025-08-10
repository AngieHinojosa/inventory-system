import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad básica con Helmet
  app.use(helmet());

  // Limitar peticiones (100 por minuto por IP)
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: 100, // máximo 100 requests por IP
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('REST API for inventory management')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
