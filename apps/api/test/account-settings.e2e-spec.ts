import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, cleanupTestRun, loginAs, testRunId, TEST_PASSWORD } from './helpers';

describe('Settings: security, sessions, family members (Phase 1)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const runId = testRunId();

  // A fresh app per test = fresh in-memory login-throttle storage per test
  // (same reasoning as auth-backoff.e2e-spec.ts) — several tests here do
  // multiple logins each, and sharing one app's throttle budget across the
  // whole file exhausts the 10/min login limit partway through.
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

  it('changing the password revokes every session and requires the new password next login', async () => {
    const user = await createPatient(prisma, runId, 'pw');
    const login = await loginAs(app, user.email);
    expect(login.status).toBe(200);

    const change = await request(app.getHttpServer())
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ currentPassword: TEST_PASSWORD, newPassword: 'NewTestPass456!' });
    expect(change.status).toBe(200);

    const oldPasswordLogin = await loginAs(app, user.email, TEST_PASSWORD);
    expect(oldPasswordLogin.status).toBe(401);

    const newPasswordLogin = await loginAs(app, user.email, 'NewTestPass456!');
    expect(newPasswordLogin.status).toBe(200);

    const liveTokens = await prisma.refreshToken.count({ where: { userId: user.id, revokedAt: null } });
    // Exactly the one session from the fresh login above should be live --
    // every session that existed at the moment of the password change was
    // revoked, not just the one used to make the request.
    expect(liveTokens).toBe(1);
  });

  it('rejects a change-password request with the wrong current password', async () => {
    const user = await createPatient(prisma, runId, 'pwWrong');
    const login = await loginAs(app, user.email);

    const change = await request(app.getHttpServer())
      .patch('/api/auth/password')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ currentPassword: 'WrongCurrentPass1!', newPassword: 'NewTestPass456!' });
    expect(change.status).toBe(400);

    // Original password must still work -- nothing changed.
    const stillWorks = await loginAs(app, user.email, TEST_PASSWORD);
    expect(stillWorks.status).toBe(200);
  });

  it('logout-all revokes every live session for the user', async () => {
    const user = await createPatient(prisma, runId, 'logoutAll');
    await loginAs(app, user.email);
    await loginAs(app, user.email);
    const third = await loginAs(app, user.email);

    const beforeCount = await prisma.refreshToken.count({ where: { userId: user.id, revokedAt: null } });
    expect(beforeCount).toBe(3);

    const logoutAll = await request(app.getHttpServer())
      .post('/api/auth/logout-all')
      .set('Authorization', `Bearer ${third.body.accessToken}`);
    expect(logoutAll.status).toBe(200);

    const afterCount = await prisma.refreshToken.count({ where: { userId: user.id, revokedAt: null } });
    expect(afterCount).toBe(0);

    const revokedReasons = await prisma.refreshToken.findMany({
      where: { userId: user.id },
      select: { revokedReason: true },
    });
    // A bulk logout-all must be distinguishable from token-theft reuse in
    // the security logs, not just look like every session got "reused".
    expect(revokedReasons.every((r) => r.revokedReason === 'USER_LOGOUT_ALL')).toBe(true);
  });

  it('lists sessions with device context captured at login', async () => {
    const user = await createPatient(prisma, runId, 'sessions');
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('User-Agent', 'e2e-test-agent/1.0')
      .send({ email: user.email, password: TEST_PASSWORD });

    const sessions = await request(app.getHttpServer())
      .get('/api/auth/sessions')
      .set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(sessions.status).toBe(200);
    expect(sessions.body.length).toBeGreaterThanOrEqual(1);
    expect(sessions.body.some((s: { userAgent: string }) => s.userAgent === 'e2e-test-agent/1.0')).toBe(true);
  });

  it('a patient cannot view, edit, or delete another patient\'s family members', async () => {
    const patientA = await createPatient(prisma, runId, 'famA');
    const patientB = await createPatient(prisma, runId, 'famB');
    const loginA = await loginAs(app, patientA.email);
    const loginB = await loginAs(app, patientB.email);

    const created = await request(app.getHttpServer())
      .post('/api/family-members')
      .set('Authorization', `Bearer ${loginA.body.accessToken}`)
      .send({ name: 'A Family Member', relation: 'CHILD' });
    expect(created.status).toBe(201);

    const bList = await request(app.getHttpServer())
      .get('/api/family-members')
      .set('Authorization', `Bearer ${loginB.body.accessToken}`);
    expect(bList.body).toHaveLength(0);

    const bEdit = await request(app.getHttpServer())
      .patch(`/api/family-members/${created.body.id}`)
      .set('Authorization', `Bearer ${loginB.body.accessToken}`)
      .send({ name: 'Hijacked', relation: 'OTHER' });
    expect(bEdit.status).toBe(403);

    const bDelete = await request(app.getHttpServer())
      .delete(`/api/family-members/${created.body.id}`)
      .set('Authorization', `Bearer ${loginB.body.accessToken}`);
    expect(bDelete.status).toBe(403);

    const aList = await request(app.getHttpServer())
      .get('/api/family-members')
      .set('Authorization', `Bearer ${loginA.body.accessToken}`);
    expect(aList.body).toHaveLength(1);
  });
});
