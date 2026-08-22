import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient, Role, DoctorStatus, NurseStatus, PhysiotherapistStatus } from '@prisma/client';

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

export async function createNurse(prisma: PrismaClient, runId: string, label: string, status: NurseStatus = NurseStatus.ACTIVE) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return prisma.user.create({
    data: {
      email: `e2e-${runId}-${label}@test.local`,
      passwordHash,
      role: Role.NURSE,
      firstName: 'E2E',
      lastName: label,
      nurseProfile: {
        create: { licenseNumber: `NUR-${runId}-${label}`, qualification: 'B.Sc Nursing', status },
      },
    },
  });
}

export async function createPhysiotherapist(
  prisma: PrismaClient,
  runId: string,
  label: string,
  status: PhysiotherapistStatus = PhysiotherapistStatus.ACTIVE,
) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return prisma.user.create({
    data: {
      email: `e2e-${runId}-${label}@test.local`,
      passwordHash,
      role: Role.PHYSIOTHERAPIST,
      firstName: 'E2E',
      lastName: label,
      physiotherapistProfile: {
        create: { licenseNumber: `PHT-${runId}-${label}`, specialty: 'Orthopedic', status },
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

const SAFE_SAFETY_CHECK_ANSWERS = {
  chestPain: false,
  breathingDifficulty: false,
  severeBleeding: false,
  lossOfConsciousnessOrConfusion: false,
};

export const TRIGGERED_SAFETY_CHECK_ANSWERS = {
  ...SAFE_SAFETY_CHECK_ANSWERS,
  chestPain: true,
};

export async function createNursingVisitAs(app: INestApplication, accessToken: string, safetyCheckAnswers = SAFE_SAFETY_CHECK_ANSWERS) {
  return request(app.getHttpServer())
    .post('/api/visits')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      serviceType: 'NURSING',
      reasonForVisit: 'E2E nursing test visit',
      addressLine1: '1 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '000000',
      nursingDetails: { nursingServiceType: 'WOUND_CARE', careNotes: 'e2e test' },
      safetyCheckAnswers,
    });
}

export async function createPhysiotherapyVisitAs(
  app: INestApplication,
  accessToken: string,
  safetyCheckAnswers = SAFE_SAFETY_CHECK_ANSWERS,
) {
  return request(app.getHttpServer())
    .post('/api/visits')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      serviceType: 'PHYSIOTHERAPY',
      reasonForVisit: 'E2E physiotherapy test visit',
      addressLine1: '1 Test St',
      city: 'Testville',
      state: 'TS',
      postalCode: '000000',
      physiotherapyDetails: { conditionType: 'BACK_PAIN', mobilityLevel: 'INDEPENDENT' },
      safetyCheckAnswers,
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
    where: {
      OR: [
        { patientId: { in: userIds } },
        { doctorId: { in: userIds } },
        { nurseId: { in: userIds } },
        { physiotherapistId: { in: userIds } },
      ],
    },
    select: { id: true },
  });
  const visitIds = visits.map((v) => v.id);
  const doctorProfiles = await prisma.doctorProfile.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const doctorProfileIds = doctorProfiles.map((d) => d.id);
  const nurseProfiles = await prisma.nurseProfile.findMany({ where: { userId: { in: userIds } }, select: { id: true } });
  const nurseProfileIds = nurseProfiles.map((n) => n.id);
  const physiotherapistProfiles = await prisma.physiotherapistProfile.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const physiotherapistProfileIds = physiotherapistProfiles.map((p) => p.id);

  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.notificationPreference.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.familyMember.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.visitStatusEvent.deleteMany({ where: { visitId: { in: visitIds } } });
  await prisma.visitTriage.deleteMany({ where: { visitId: { in: visitIds } } });
  await prisma.visitSafetyCheck.deleteMany({ where: { visitId: { in: visitIds } } });
  await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
  await prisma.doctorStatusEvent.deleteMany({
    where: { OR: [{ doctorProfileId: { in: doctorProfileIds } }, { changedById: { in: userIds } }] },
  });
  await prisma.nurseStatusEvent.deleteMany({
    where: { OR: [{ nurseProfileId: { in: nurseProfileIds } }, { changedById: { in: userIds } }] },
  });
  await prisma.physiotherapistStatusEvent.deleteMany({
    where: { OR: [{ physiotherapistProfileId: { in: physiotherapistProfileIds } }, { changedById: { in: userIds } }] },
  });
  await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.doctorProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.nurseProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.physiotherapistProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.patientProfile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}
