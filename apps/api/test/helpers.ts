import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient, Role, DoctorStatus } from '@prisma/client';

export const TEST_PASSWORD = 'TestPass123!';

/** Every fixture email in a test file is prefixed with this so afterAll can
 *  find and delete exactly what it created — never touches real data. */
export function testRunId(): string {
  return crypto.randomBytes(4).toString('hex');
}

export async function createPatient(prisma: PrismaClient, runId: string, label: string) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return prisma.user.create({
    data: {
      email: `e2e-${runId}-${label}@test.local`,
      passwordHash,
      role: Role.PATIENT,
      firstName: 'E2E',
      lastName: label,
      patientProfile: {
        create: { addressLine1: '1 Test St', city: 'Testville', state: 'TS', postalCode: '000000' },
      },
    },
  });
}

export async function createDoctor(prisma: PrismaClient, runId: string, label: string, status: DoctorStatus = DoctorStatus.APPROVED) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return prisma.user.create({
    data: {
      email: `e2e-${runId}-${label}@test.local`,
      passwordHash,
      role: Role.DOCTOR,
      firstName: 'E2E',
      lastName: label,
      doctorProfile: {
        create: { licenseNumber: `LIC-${runId}-${label}`, specialty: 'General', status },
      },
    },
  });
}

export async function createAdmin(prisma: PrismaClient, runId: string, label: string) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return prisma.user.create({
    data: {
      email: `e2e-${runId}-${label}@test.local`,
      passwordHash,
      role: Role.ADMIN,
      firstName: 'E2E',
      lastName: label,
    },
  });
}

export async function loginAs(app: INestApplication, email: string, password = TEST_PASSWORD) {
  const res = await request(app.getHttpServer()).post('/api/auth/login').send({ email, password });
  return res;
}

const MINIMAL_TRIAGE_ANSWERS = {
  symptoms: [{ symptomId: 'e2e_test_symptom', duration: 'ONE_TO_6_HOURS', severity: 'MILD' }],
  otherSymptomText: 'e2e test visit',
};

export async function createVisitAs(app: INestApplication, accessToken: string) {
  return request(app.getHttpServer())
    .post('/api/visits')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      reasonForVisit: 'E2E test visit',
      addressLine1: '1 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '000000',
      triageAnswers: MINIMAL_TRIAGE_ANSWERS,
    });
}

/** Deletes everything created under a given test-run prefix, in FK-safe
 *  order (schema has no onDelete: Cascade, so children must go first). */
export async function cleanupTestRun(prisma: PrismaClient, runId: string) {
  const emailFilter = { email: { contains: `e2e-${runId}-` } };
  const users = await prisma.user.findMany({ where: emailFilter, select: { id: true } });
  const userIds = users.map((u) => u.id);
  if (userIds.length === 0) return;

  const visits = await prisma.visit.findMany({
    where: { OR: [{ patientId: { in: userIds } }, { doctorId: { in: userIds } }] },
    select: { id: true },
  });
  const visitIds = visits.map((v) => v.id);
  const doctorProfiles = await prisma.doctorProfile.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const doctorProfileIds = doctorProfiles.map((d) => d.id);

  await prisma.visitStatusEvent.deleteMany({ where: { visitId: { in: visitIds } } });
  await prisma.visitTriage.deleteMany({ where: { visitId: { in: visitIds } } });
  await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
  await prisma.doctorStatusEvent.deleteMany({
    where: { OR: [{ doctorProfileId: { in: doctorProfileIds } }, { changedById: { in: userIds } }] },
  });
  await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.doctorProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.patientProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}
