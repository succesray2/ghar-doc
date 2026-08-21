import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, cleanupTestRun, loginAs, testRunId, TEST_PASSWORD } from './helpers';

describe('Login brute-force protection (P0)', () => {
  const prisma = new PrismaClient();
  const runId = testRunId();
  let app: INestApplication;

  // A fresh app per test = fresh in-memory throttler storage per test, so
  // one test's deliberate flood of login attempts can't push another
  // test's legitimate calls over the per-IP limit.
  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await cleanupTestRun(prisma, runId);
    await prisma.$disconnect();
  });

  it('does not reveal whether the account exists, is inactive, or is locked', async () => {
    const user = await createPatient(prisma, runId, 'enum');
    const noSuchUser = await loginAs(app, `e2e-${runId}-nobody@test.local`, 'WrongPass123!');
    const wrongPassword = await loginAs(app, user.email, 'WrongPass123!');

    expect(noSuchUser.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(noSuchUser.body.message).toBe(wrongPassword.body.message);
    expect(noSuchUser.body.message).toBe('Invalid email or password');
  });

  it('escalates to a temporary lock after repeated failures, and resets on success', async () => {
    const user = await createPatient(prisma, runId, 'lock');

    for (let i = 0; i < 5; i++) {
      const res = await loginAs(app, user.email, 'WrongPass123!');
      expect(res.status).toBe(401);
    }

    const locked = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(locked.failedLoginAttempts).toBe(5);
    expect(locked.lockedUntil).not.toBeNull();
    expect(locked.lockedUntil!.getTime()).toBeGreaterThan(Date.now());

    // Even the *correct* password is rejected while locked — the lock
    // itself, not just the wrong password, is what's blocking this attempt.
    const stillLocked = await loginAs(app, user.email, TEST_PASSWORD);
    expect(stillLocked.status).toBe(401);
    expect(stillLocked.body.message).toBe('Invalid email or password');

    // Simulate the lock having expired (avoids a real 60s sleep in the
    // suite) and confirm a genuine successful login resets both counters.
    await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: null } });
    const success = await loginAs(app, user.email, TEST_PASSWORD);
    expect(success.status).toBe(200);

    const reset = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(reset.failedLoginAttempts).toBe(0);
    expect(reset.lockedUntil).toBeNull();
  });

  it('resets the failure count on a successful login below the lock threshold', async () => {
    const user = await createPatient(prisma, runId, 'partial');

    await loginAs(app, user.email, 'WrongPass123!');
    await loginAs(app, user.email, 'WrongPass123!');
    const midway = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(midway.failedLoginAttempts).toBe(2);
    expect(midway.lockedUntil).toBeNull();

    const success = await loginAs(app, user.email, TEST_PASSWORD);
    expect(success.status).toBe(200);

    const reset = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(reset.failedLoginAttempts).toBe(0);
  });

  it('trips per-IP rate limiting on the login route after repeated rapid requests', async () => {
    const user = await createPatient(prisma, runId, 'iprl');
    let sawTooManyRequests = false;

    for (let i = 0; i < 15 && !sawTooManyRequests; i++) {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: user.email, password: 'WrongPass123!' });
      if (res.status === 429) sawTooManyRequests = true;
    }

    expect(sawTooManyRequests).toBe(true);
  });
});
