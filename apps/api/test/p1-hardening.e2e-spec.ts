import type { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp } from './setup';
import { createPatient, createDoctor, createAdmin, createVisitAs, cleanupTestRun, loginAs, testRunId } from './helpers';

describe('P1 hardening: security headers, CORS, body limits, audit context', () => {
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

  it('sends helmet security headers without a browser CSP on this JSON API', async () => {
    const res = await request(app.getHttpServer()).get('/api/doctors');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeUndefined();
  });

  it('rejects a request body larger than the configured limit', async () => {
    const oversized = { reasonForVisit: 'x'.repeat(300_000) };
    const res = await request(app.getHttpServer()).post('/api/visits').send(oversized);
    expect(res.status).toBe(413);
  });

  it('never reflects an arbitrary request Origin back in Access-Control-Allow-Origin', async () => {
    // The CORS config is a single static allowed origin, not a
    // dynamic reflect-the-request-Origin function — a browser page on
    // an attacker's origin would still get an ACAO value that doesn't
    // match its own origin, so it can't read the response even though
    // the server responded normally (CORS is a browser-enforced
    // property, not something the server "rejects" at the HTTP level).
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'https://not-the-real-web-app.example.com')
      .send({ email: 'nobody@test.local', password: 'WrongPass123!' });
    expect(res.headers['access-control-allow-origin']).not.toBe('https://not-the-real-web-app.example.com');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('records ip/user-agent on a visit-assignment audit event', async () => {
    const patient = await createPatient(prisma, runId, 'auditP');
    const doctor = await createDoctor(prisma, runId, 'auditD');
    const admin = await createAdmin(prisma, runId, 'auditA');

    const loginPatient = await loginAs(app, patient.email);
    const loginAdmin = await loginAs(app, admin.email);
    const created = await createVisitAs(app, loginPatient.body.accessToken);

    const assignRes = await request(app.getHttpServer())
      .patch(`/api/visits/${created.body.id}/assign`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .set('User-Agent', 'e2e-test-agent/1.0')
      .send({ doctorId: doctor.id });
    expect(assignRes.status).toBe(200);

    const event = await prisma.visitStatusEvent.findFirstOrThrow({
      where: { visitId: created.body.id, toStatus: 'ASSIGNED' },
    });
    expect(event.userAgent).toBe('e2e-test-agent/1.0');
    expect(event.ipAddress).toBeTruthy();
  });

  it('records ip/user-agent on a doctor-status audit event', async () => {
    const doctor = await createDoctor(prisma, runId, 'auditD2');
    const admin = await createAdmin(prisma, runId, 'auditA2');
    const loginAdmin = await loginAs(app, admin.email);

    const res = await request(app.getHttpServer())
      .patch(`/api/doctors/${doctor.id}/status`)
      .set('Authorization', `Bearer ${loginAdmin.body.accessToken}`)
      .set('User-Agent', 'e2e-test-agent/1.0')
      .send({ status: 'SUSPENDED', reason: 'e2e test' });
    expect(res.status).toBe(200);

    const doctorProfile = await prisma.doctorProfile.findUniqueOrThrow({ where: { userId: doctor.id } });
    const event = await prisma.doctorStatusEvent.findFirstOrThrow({
      where: { doctorProfileId: doctorProfile.id, toStatus: 'SUSPENDED' },
    });
    expect(event.userAgent).toBe('e2e-test-agent/1.0');
    expect(event.ipAddress).toBeTruthy();
  });
});
