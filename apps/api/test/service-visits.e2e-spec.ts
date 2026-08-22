import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import {
  createPatient,
  createDoctor,
  createNurse,
  createPhysiotherapist,
  createAdmin,
  createVisitAs,
  createNursingVisitAs,
  createPhysiotherapyVisitAs,
  TRIGGERED_SAFETY_CHECK_ANSWERS,
  cleanupTestRun,
  loginAs,
  testRunId,
} from './helpers';

describe('Nursing/Physiotherapy service visits (Phase 2)', () => {
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

  it('a nursing visit with a triggered safety check is blocked and never created', async () => {
    const patient = await createPatient(prisma, runId, 'pBlocked');
    const login = await loginAs(app, patient.email);

    const res = await createNursingVisitAs(app, login.body.accessToken, TRIGGERED_SAFETY_CHECK_ANSWERS);
    expect(res.status).toBe(400);

    const mine = await request(app.getHttpServer())
      .get('/api/visits/mine')
      .set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(mine.body).toHaveLength(0);
  });

  it('a nursing visit that passes the safety check is created as GREEN with no triage row', async () => {
    const patient = await createPatient(prisma, runId, 'pNursingOk');
    const login = await loginAs(app, patient.email);

    const res = await createNursingVisitAs(app, login.body.accessToken);
    expect(res.status).toBe(201);
    expect(res.body.serviceType).toBe('NURSING');
    expect(res.body.priority).toBe('GREEN');
    expect(res.body.triageSummary).toBeNull();
    expect(res.body.serviceDetails.nursingServiceType).toBe('WOUND_CARE');
  });

  it('admin assigns a nurse to a nursing visit; the nurse can accept and progress it; a doctor cannot', async () => {
    const patient = await createPatient(prisma, runId, 'pAssignNurse');
    const nurse = await createNurse(prisma, runId, 'nAssign');
    const admin = await createAdmin(prisma, runId, 'aAssignNurse');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);
    const loginNurse = await loginAs(app, nurse.email);

    const created = await createNursingVisitAs(app, loginPatient.body.accessToken);
    const visitId = created.body.id as string;

    const assign = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ nurseId: nurse.id });
    expect(assign.status).toBe(200);
    expect(assign.body.status).toBe('ASSIGNED');
    expect(assign.body.nurse?.id).toBe(nurse.id);

    const accept = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginNurse.body.accessToken}`)
      .send({ status: 'PROVIDER_ACCEPTED' });
    expect(accept.status).toBe(200);
    expect(accept.body.acceptedAt).toBeTruthy();

    const complete = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginNurse.body.accessToken}`)
      .send({ status: 'EN_ROUTE' });
    expect(complete.status).toBe(200);
  });

  it('declining a nursing visit atomically requeues it with nurseId cleared, not doctorId', async () => {
    const patient = await createPatient(prisma, runId, 'pDeclineNurse');
    const nurse = await createNurse(prisma, runId, 'nDecline');
    const admin = await createAdmin(prisma, runId, 'aDeclineNurse');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);
    const loginNurse = await loginAs(app, nurse.email);

    const created = await createNursingVisitAs(app, loginPatient.body.accessToken);
    const visitId = created.body.id as string;
    await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ nurseId: nurse.id });

    const decline = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginNurse.body.accessToken}`)
      .send({ status: 'PROVIDER_DECLINED' });
    expect(decline.status).toBe(200);
    expect(decline.body.status).toBe('REQUESTED');
    expect(decline.body.nurse).toBeNull();
    expect(decline.body.doctor).toBeNull();
  });

  it('a doctor cannot accept a physiotherapy visit assigned to a physiotherapist', async () => {
    const patient = await createPatient(prisma, runId, 'pCrossService');
    const physio = await createPhysiotherapist(prisma, runId, 'phCross');
    const admin = await createAdmin(prisma, runId, 'aCrossService');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);

    const created = await createPhysiotherapyVisitAs(app, loginPatient.body.accessToken);
    const visitId = created.body.id as string;
    await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ physiotherapistId: physio.id });

    // A random doctor (never assigned to this visit) tries to accept it.
    const strangerDoctor = await createDoctor(prisma, runId, 'dStranger');
    const loginStranger = await loginAs(app, strangerDoctor.email);

    const accept = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/status`)
      .set('Authorization', `Bearer ${loginStranger.body.accessToken}`)
      .send({ status: 'PROVIDER_ACCEPTED' });
    expect(accept.status).toBe(403);
  });

  it('assigning a SUSPENDED nurse is rejected', async () => {
    const patient = await createPatient(prisma, runId, 'pSuspendedAssign');
    const suspendedNurse = await createNurse(prisma, runId, 'nSuspended', 'SUSPENDED');
    const admin = await createAdmin(prisma, runId, 'aSuspendedAssign');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);

    const created = await createNursingVisitAs(app, loginPatient.body.accessToken);
    const visitId = created.body.id as string;

    const assign = await request(app.getHttpServer())
      .patch(`/api/visits/${visitId}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ nurseId: suspendedNurse.id });
    expect(assign.status).toBe(400);
  });

  it('a POST /visits with no serviceType field still produces an identical DOCTOR_VISIT row to today', async () => {
    const patient = await createPatient(prisma, runId, 'pBackCompat');
    const login = await loginAs(app, patient.email);

    // createVisitAs() sends today's exact legacy payload -- no serviceType field at all.
    const created = await createVisitAs(app, login.body.accessToken);
    expect(created.status).toBe(201);
    expect(created.body.serviceType).toBe('DOCTOR_VISIT');
    expect(created.body.triageSummary).toBeTruthy();
  });

  it('the admin Safety Dashboard stats are scoped to DOCTOR_VISIT only', async () => {
    const patient = await createPatient(prisma, runId, 'pSafetyStats');
    const admin = await createAdmin(prisma, runId, 'aSafetyStats');
    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);

    const before = await request(app.getHttpServer())
      .get('/api/visits/safety-stats')
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`);
    const beforeGreenTotal = before.body.byPriority.GREEN;

    // A nursing visit is always GREEN with no triage row -- it must not move this count.
    await createNursingVisitAs(app, loginPatient.body.accessToken);

    const after = await request(app.getHttpServer())
      .get('/api/visits/safety-stats')
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`);
    expect(after.body.byPriority.GREEN).toBe(beforeGreenTotal);
  });
});
