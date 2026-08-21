import 'reflect-metadata';
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 0,
    // Never let request/user context leak health data or credentials to a
    // third party — strip everything except what's needed to triage a bug.
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies;
        delete event.request.data;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }
      delete event.user;
      return event;
    },
  });
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // bodyParser: false so we can set an explicit, documented size limit
  // below instead of relying on Nest/Express's implicit default.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);

  // Render sits in front of the app behind a reverse proxy — without this,
  // Express's req.ip (which per-IP rate limiting keys off) resolves to
  // Render's proxy address for every request instead of the real client IP.
  app.set('trust proxy', 1);

  app.use(
    helmet({
      // This is a JSON API, not a browser-rendered app — a restrictive
      // default CSP is meant for HTML responses and does nothing useful
      // (or confusing) applied to JSON. Every other helmet default (HSTS,
      // X-Content-Type-Options, frame protection, etc.) still applies.
      contentSecurityPolicy: false,
      // The web app calls this API cross-origin by design (different
      // *.onrender.com subdomains) — helmet's same-origin CORP default
      // would let CORS through but can still get the response blocked by
      // the browser's resource-policy check, so it's set explicitly here.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 256kb comfortably covers the largest real payload (the 20-category
  // triage answers blob) with headroom, without leaving the limit at
  // Express's implicit default.
  app.use(express.json({ limit: '256kb' }));
  app.use(express.urlencoded({ extended: true, limit: '256kb' }));

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('WEB_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Type'],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`Ghar Doc API listening on http://localhost:${port}/api`);
}

bootstrap();
