import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, createDoctor, createAdmin, createVisitAs, cleanupTestRun, loginAs, testRunId } from './helpers';

describe('Visit authorization, IDOR, and assignment race condition (P0)', () => {
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

  it('a patient cannot view another patient\'s visit by ID', async () => {
    const patientA = await createPatient(prisma, runId, 'pA');
    const patientB = await createPatient(prisma, runId, 'pB');
    const loginA = await loginAs(app, patientA.email);
    const loginB = await loginAs(app, patientB.email);

    const created = await createVisitAs(app, loginA.body.accessToken);
    expect(created.status).toBe(201);

    const res = await request(app.getHttpServer())
      .get(`/api/visits/${created.body.id}`)
      .set('Authorization', `Bearer ${loginB.body.accessToken}`);
    expect(res.status).toBe(403);
  });

  it('a doctor cannot view another doctor\'s assigned visit by ID', async () => {
    const patient = await createPatient(prisma, runId, 'pC');
    const doctorA = await createDoctor(prisma, runId, 'dA');
    const doctorB = await createDoctor(prisma, runId, 'dB');
    const admin = await createAdmin(prisma, runId, 'adm1');

    const loginPatient = await loginAs(app, patient.email);
    const loginDoctorB = await loginAs(app, doctorB.email);
    const loginAdmin = await loginAs(app, admin.email);

    const created = await createVisitAs(app, loginPatient.body.accessToken);
    await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .send({ doctorId: doctorA.id });

    const res = await request(app.getHttpServer())
      .get(`/api/visits/${created.body.id}`)
      .set('Authorization', `Bearer ${loginDoctorB.body.accessToken}`);
    expect(res.status).toBe(403);
  });

  it('non-admin roles cannot reach admin-only routes', async () => {
    const patient = await createPatient(prisma, runId, 'pD');
    const doctor = await createDoctor(prisma, runId, 'dC');
    const loginPatient = await loginAs(app, patient.email);
    const loginDoctor = await loginAs(app, doctor.email);

    for (const token of [loginPatient.body.accessToken, loginDoctor.body.accessToken]) {
      const listVisits = await request(app.getHttpServer()).get('/api/visits').set('Authorization', `Bearer ${token}`);
      const listDoctors = await request(app.getHttpServer()).get('/api/doctors').set('Authorization', `Bearer ${token}`);
      expect(listVisits.status).toBe(403);
      expect(listDoctors.status).toBe(403);
    }
  });

  it('exactly one of two concurrent assignment requests on the same visit succeeds', async () => {
    const patient = await createPatient(prisma, runId, 'pRace');
    const doctorA = await createDoctor(prisma, runId, 'dRaceA');
    const doctorB = await createDoctor(prisma, runId, 'dRaceB');
    const admin = await createAdmin(prisma, runId, 'admRace');

    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);
    const created = await createVisitAs(app, loginPatient.body.accessToken);
    expect(created.status).toBe(201);

    const [resA, resB] = await Promise.all([
      request(app.getHttpServer())
        .patch(`/api/visits/${created.body.id}/assign`)
        .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
        .send({ doctorId: doctorA.id }),
      request(app.getHttpServer())
        .patch(`/api/visits/${created.body.id}/assign`)
        .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
        .send({ doctorId: doctorB.id }),
    ]);

    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([200, 409]);

    const finalVisit = await prisma.visit.findUniqueOrThrow({ where: { id: created.body.id } });
    const winner = resA.status === 200 ? doctorA.id : doctorB.id;
    expect(finalVisit.doctorId).toBe(winner);
  });
});
