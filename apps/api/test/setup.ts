import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

/** Mirrors main.ts's bootstrap() exactly (global prefix, cookie parsing,
 *  the exception filter, helmet, the explicit body-size limit, CORS) —
 *  none of that lives in AppModule itself, so a bare
 *  Test.createTestingModule().compile() would silently 404 every request,
 *  return raw unfiltered error bodies, or miss real production behavior
 *  like the body-size limit entirely. */
export async function createTestApp(): Promise<NestExpressApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>({ bodyParser: false });
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true, limit: '256kb' }));
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Type'],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  await app.init();
  return app;
}
