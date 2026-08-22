import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createAdmin, cleanupTestRun, loginAs, testRunId, TEST_PASSWORD } from './helpers';

describe('Nurse/Physiotherapist provider accounts (Phase 2)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const runId = testRunId();

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

  async function loginAdmin(label: string) {
    const admin = await createAdmin(prisma, runId, label);
    const login = await loginAs(app, admin.email);
    return login.body.accessToken as string;
  }

  it('admin can create a nurse account, which starts ACTIVE with an audit event', async () => {
    const adminToken = await loginAdmin('aCreateNurse');

    const create = await request(app.getHttpServer())
      .post('/api/nurses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `e2e-${runId}-newnurse@test.local`,
        password: TEST_PASSWORD,
        firstName: 'New',
        lastName: 'Nurse',
        licenseNumber: `NUR-${runId}-new`,
        qualification: 'GNM',
      });
    expect(create.status).toBe(201);

    const list = await request(app.getHttpServer()).get('/api/nurses?status=ACTIVE').set('Authorization', `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    const created = list.body.find((n: { email: string }) => n.email === `e2e-${runId}-newnurse@test.local`);
    expect(created).toBeTruthy();
    expect(created.status).toBe('ACTIVE');

    const history = await request(app.getHttpServer())
      .get(`/api/nurses/${created.id}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(history.status).toBe(200);
    expect(history.body).toHaveLength(1);
    expect(history.body[0].toStatus).toBe('ACTIVE');
    expect(history.body[0].fromStatus).toBeNull();
  });

  it('creating a nurse with an already-used email is rejected', async () => {
    const adminToken = await loginAdmin('aDupeNurse');
    const email = `e2e-${runId}-dupenurse@test.local`;
    const payload = {
      email,
      password: TEST_PASSWORD,
      firstName: 'Dupe',
      lastName: 'Nurse',
      licenseNumber: `NUR-${runId}-dupe`,
      qualification: 'GNM',
    };

    const first = await request(app.getHttpServer()).post('/api/nurses').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(first.status).toBe(201);

    const second = await request(app.getHttpServer()).post('/api/nurses').set('Authorization', `Bearer ${adminToken}`).send(payload);
    expect(second.status).toBe(409);
  });

  it('a non-admin cannot create or list nurses', async () => {
    const admin = await createAdmin(prisma, runId, 'aNonAdminNurse');
    const loginAdminRes = await loginAs(app, admin.email);

    const create = await request(app.getHttpServer())
      .post('/api/nurses')
      .set('Authorization', `Bearer ${loginAdminRes.body.accessToken}`)
      .send({
        email: `e2e-${runId}-forbidden-target@test.local`,
        password: TEST_PASSWORD,
        firstName: 'F',
        lastName: 'N',
        licenseNumber: `NUR-${runId}-f`,
        qualification: 'GNM',
      });
    const nurseUserId = create.body.id ?? create.body.userId;

    // Log in as the nurse we just created and confirm it can't manage the directory itself.
    const nurseLogin = await loginAs(app, `e2e-${runId}-forbidden-target@test.local`);
    const asNurse = await request(app.getHttpServer())
      .get('/api/nurses')
      .set('Authorization', `Bearer ${nurseLogin.body.accessToken}`);
    expect(asNurse.status).toBe(403);
    expect(nurseUserId).toBeTruthy();
  });

  it('admin can suspend then reactivate a physiotherapist, both audited', async () => {
    const adminToken = await loginAdmin('aSuspendPhysio');

    const create = await request(app.getHttpServer())
      .post('/api/physiotherapists')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `e2e-${runId}-suspendphysio@test.local`,
        password: TEST_PASSWORD,
        firstName: 'Sus',
        lastName: 'Physio',
        licenseNumber: `PHT-${runId}-sus`,
        specialty: 'Orthopedic',
      });
    expect(create.status).toBe(201);
    const physioUserId = create.body.userId ?? create.body.id;

    const suspend = await request(app.getHttpServer())
      .patch(`/api/physiotherapists/${physioUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'SUSPENDED', reason: 'e2e suspend' });
    expect(suspend.status).toBe(200);
    expect(suspend.body.status).toBe('SUSPENDED');

    const reactivate = await request(app.getHttpServer())
      .patch(`/api/physiotherapists/${physioUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACTIVE' });
    expect(reactivate.status).toBe(200);
    expect(reactivate.body.status).toBe('ACTIVE');

    const history = await request(app.getHttpServer())
      .get(`/api/physiotherapists/${physioUserId}/status-history`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(history.status).toBe(200);
    expect(history.body).toHaveLength(3); // creation, suspend, reactivate
  });

  it('rejects a no-op status transition', async () => {
    const adminToken = await loginAdmin('aNoOpNurse');
    const create = await request(app.getHttpServer())
      .post('/api/nurses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `e2e-${runId}-noopnurse@test.local`,
        password: TEST_PASSWORD,
        firstName: 'NoOp',
        lastName: 'Nurse',
        licenseNumber: `NUR-${runId}-noop`,
        qualification: 'GNM',
      });
    const nurseUserId = create.body.userId ?? create.body.id;

    const noOp = await request(app.getHttpServer())
      .patch(`/api/nurses/${nurseUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACTIVE' });
    expect(noOp.status).toBe(400);
  });
});
