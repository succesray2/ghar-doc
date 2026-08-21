import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

/** Mirrors main.ts's bootstrap() exactly (global prefix, cookie parsing,
 *  the exception filter) — none of that lives in AppModule itself, so a
 *  bare Test.createTestingModule().compile() would silently 404 every
 *  request or return raw, unfiltered error bodies. */
export async function createTestApp(): Promise<NestExpressApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  await app.init();
  return app;
}
