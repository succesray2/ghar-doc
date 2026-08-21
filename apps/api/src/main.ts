import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // Render sits in front of the app behind a reverse proxy — without this,
  // Express's req.ip (which per-IP rate limiting keys off) resolves to
  // Render's proxy address for every request instead of the real client IP.
  app.set('trust proxy', 1);

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('WEB_URL'),
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`Ghar Doc API listening on http://localhost:${port}/api`);
}

bootstrap();
