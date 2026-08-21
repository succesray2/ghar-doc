import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, createDoctor, createAdmin, createVisitAs, cleanupTestRun, loginAs, testRunId } from './helpers';

describe('Provider accept/decline workflow (Phase 1)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const runId = testRunId();

  // A fresh app per test = fresh in-memory login-throttle storage per test
  // (same reasoning as auth-backoff.e2e-spec.ts) — this file's tests each
  // do 2-3 logins in setup, and sharing one app's throttle budget across
  // all of them exhausts the 10/min login limit partway through the file.
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

  async function setupAssignedVisit(label: string) {
    const patient = await createPatient(prisma, runId, `p${label}`);
    const doctor = await createDoctor(prisma, runId, `d${label}`);
    const admin = await createAdmin(prisma, runId, `a${label}`);
    const loginPatient = await loginAs(app, patient.email);
    const loginDoctor = await loginAs(app, doctor.email);
    const loginAdmin = await loginAs(app, admin.email);
    const created = await createVisitAs(app, loginPatient.body.accessToken);
    await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ doctorId: doctor.id });
    return { patient, doctor, admin, loginPatient, loginDoctor, loginAdmin, visitId: created.body.id as string };
  }

  it('doctor can accept an assigned visit, then progress it through arrived', async () => {
    const { loginDoctor, visitId } = await setupAssignedVisit('accept');

    const accept = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
      .send({ status: 'PROVIDER_ACCEPTED' });
    expect(accept.status).toBe(200);
    expect(accept.body.acceptedAt).toBeTruthy();

    const enRoute = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
      .send({ status: 'EN_ROUTE' });
    expect(enRoute.status).toBe(200);

    const arrived = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
      .send({ status: 'ARRIVED' });
    expect(arrived.status).toBe(200);
    expect(arrived.body.arrivedAt).toBeTruthy();
  });

  it('declining atomically requeues the visit to REQUESTED with doctorId cleared', async () => {
    const { loginDoctor, visitId } = await setupAssignedVisit('decline');

    const decline = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
      .send({ status: 'PROVIDER_DECLINED' });
    expect(decline.status).toBe(200);
    // The chained transaction lands on REQUESTED, never resting on
    // PROVIDER_DECLINED -- that's the whole point of doing both hops in one
    // transaction rather than two separate service calls.
    expect(decline.body.status).toBe('REQUESTED');
    expect(decline.body.doctor).toBeNull();

    const events = await prisma.visitStatusEvent.findMany({ where: { visitId }, orderBy: { createdAt: 'asc' } });
    const toStatuses = events.map((e) => e.toStatus);
    expect(toStatuses).toContain('PROVIDER_DECLINED');
    expect(toStatuses).toContain('REQUESTED');
    // Both hops are real, separately-audited rows -- not silently collapsed.
    expect(toStatuses.filter((s) => s === 'PROVIDER_DECLINED' || s === 'REQUESTED').length).toBeGreaterThanOrEqual(2);
  });

  it('admin can mark a request as having no available provider, then retry', async () => {
    const patient = await createPatient(prisma, runId, 'pNoProv');
    const admin = await createAdmin(prisma, runId, 'aNoProv');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);
    const created = await createVisitAs(app, loginPatient.body.accessToken);

    const noProvider = await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/status`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ status: 'NO_PROVIDER_AVAILABLE' });
    expect(noProvider.status).toBe(200);

    const retry = await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/status`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ status: 'REQUESTED' });
    expect(retry.status).toBe(200);
    expect(retry.body.status).toBe('REQUESTED');
  });

  it('exactly one of two concurrent accept requests on the same visit succeeds', async () => {
    const { loginDoctor, visitId } = await setupAssignedVisit('race');

    const [resA, resB] = await Promise.all([
      request(app.getHttpServer())
        .patch(`/api/visits/${visitId}/status`)
        .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
        .send({ status: 'PROVIDER_ACCEPTED' }),
      request(app.getHttpServer())
        .patch(`/api/visits/${visitId}/status`)
        .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
        .send({ status: 'PROVIDER_ACCEPTED' }),
    ]);

    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([200, 409]);
  });

  it('creates real notifications for the patient and doctor at each real step, respecting preferences', async () => {
    const patient = await createPatient(prisma, runId, 'pNotif');
    const doctor = await createDoctor(prisma, runId, 'dNotif');
    const admin = await createAdmin(prisma, runId, 'aNotif');
    const loginPatient = await loginAs(app, patient.email);
    const loginDoctor = await loginAs(app, doctor.email);
    const loginAdmin = await loginAs(app, admin.email);

    const created = await createVisitAs(app, loginPatient.body.accessToken);
    let patientNotifs = await request(app.getHttpServer())
      .get('/api/notifications')
      .set('Authorization', `Bearer ${loginPatient.body.accessToken}`);
    expect(patientNotifs.body.some((n: { category: string }) => n.category === 'BOOKING_UPDATE')).toBe(true);

    await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ doctorId: doctor.id });

    const doctorNotifs = await request(app.getHttpServer())
      .get('/api/notifications')
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`);
    expect(doctorNotifs.body.some((n: { category: string }) => n.category === 'PROVIDER_ASSIGNMENT')).toBe(true);

    // Turn off provider-assignment notifications for the patient, then
    // accept -- the patient must NOT get a new PROVIDER_ASSIGNMENT row.
    await request(app.getHttpServer())
      .patch('/api/notifications/preferences')
      .set('Authorization', `Bearer ${loginPatient.body.accessToken}`)
      .send({ providerAssignment: false });

    const beforeCount = (
      await request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${loginPatient.body.accessToken}`)
    ).body.length;

    await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/status`)
      .set('Authorization', `Bearer ${loginDoctor.body.accessToken}`)
      .send({ status: 'PROVIDER_ACCEPTED' });

    patientNotifs = await request(app.getHttpServer())
      .get('/api/notifications')
      .set('Authorization', `Bearer ${loginPatient.body.accessToken}`);
    expect(patientNotifs.body.length).toBe(beforeCount);
  });
});
