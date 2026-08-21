import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, cleanupTestRun, testRunId, TEST_PASSWORD } from './helpers';

describe('Refresh-token reuse detection (P0)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const runId = testRunId();

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await cleanupTestRun(prisma, runId);
    await prisma.$disconnect();
    await app.close();
  });

  it('rotates normally on legitimate sequential use', async () => {
    const user = await createPatient(prisma, runId, 'rotate');
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Client-Type', 'mobile')
      .send({ email: user.email, password: TEST_PASSWORD });
    expect(login.status).toBe(200);

    const refresh1 = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('X-Client-Type', 'mobile')
      .send({ refreshToken: login.body.refreshToken });
    expect(refresh1.status).toBe(200);
    expect(refresh1.body.refreshToken).not.toBe(login.body.refreshToken);
  });

  it('kills the whole token family when a rotated-away token is replayed', async () => {
    const user = await createPatient(prisma, runId, 'reuse');
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Client-Type', 'mobile')
      .send({ email: user.email, password: TEST_PASSWORD });
    const originalToken = login.body.refreshToken as string;

    // Legitimate rotation — this is now the "current" token for the family.
    const legit = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('X-Client-Type', 'mobile')
      .send({ refreshToken: originalToken });
    expect(legit.status).toBe(200);
    const currentToken = legit.body.refreshToken as string;

    // An attacker (or a stale device) replays the token that was already
    // rotated away. This must fail...
    const replay = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('X-Client-Type', 'mobile')
      .send({ refreshToken: originalToken });
    expect(replay.status).toBe(401);

    // ...and must also have killed the legitimate "current" token from the
    // same family — proving this is a full family revocation, not just a
    // rejection of the one replayed token.
    const currentAfterReuse = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('X-Client-Type', 'mobile')
      .send({ refreshToken: currentToken });
    expect(currentAfterReuse.status).toBe(401);
  });
});
