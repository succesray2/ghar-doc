import { PrismaClient, Role, DoctorStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SEED_PASSWORD = process.env.SEED_PASSWORD ?? 'Password@123';

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ghardoc.com' },
    update: {},
    create: {
      email: 'admin@ghardoc.com',
      passwordHash,
      role: Role.ADMIN,
      firstName: 'Ghar',
      lastName: 'Admin',
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@ghardoc.com' },
    update: {},
    create: {
      email: 'doctor@ghardoc.com',
      passwordHash,
      role: Role.DOCTOR,
      firstName: 'Asha',
      lastName: 'Verma',
      doctorProfile: {
        create: {
          licenseNumber: 'MED-000123',
          specialty: 'General Medicine',
          bio: 'General physician available for home visits.',
          yearsExperience: 8,
          status: DoctorStatus.APPROVED,
          reviewedAt: new Date(),
          isAvailable: true,
        },
      },
    },
  });

  const pendingDoctor = await prisma.user.upsert({
    where: { email: 'pending.doctor@ghardoc.com' },
    update: {},
    create: {
      email: 'pending.doctor@ghardoc.com',
      passwordHash,
      role: Role.DOCTOR,
      firstName: 'Priya',
      lastName: 'Singh',
      doctorProfile: {
        create: {
          licenseNumber: 'MED-000456',
          specialty: 'Pediatrics',
          bio: 'Recently signed up, awaiting admin review.',
          yearsExperience: 3,
        },
      },
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@ghardoc.com' },
    update: {},
    create: {
      email: 'patient@ghardoc.com',
      passwordHash,
      role: Role.PATIENT,
      firstName: 'Rahul',
      lastName: 'Sharma',
      patientProfile: {
        create: {
          addressLine1: '221B Baker Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      },
    },
  });

  console.log('Seeded accounts (all share the same password):');
  console.log(`  Admin:           ${admin.email}`);
  console.log(`  Doctor (approved): ${doctor.email}`);
  console.log(`  Doctor (pending):  ${pendingDoctor.email}`);
  console.log(`  Patient:         ${patient.email}`);
  console.log(`  Password: ${SEED_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
