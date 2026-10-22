import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? configService.get<string>('APP_PORT') ?? 3000);

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configuredOrigins = configService.get<string>('CORS_ORIGIN');
  if (configuredOrigins?.trim()) {
    app.enableCors({
      origin: configuredOrigins.split(',').map((origin) => origin.trim()),
      credentials: true,
    });
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('Task management API used for hands-on AWS ECS/Fargate learning.')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
