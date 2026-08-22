-- AlterEnum: new provider roles for Phase 2 (Nursing/Physiotherapy)
ALTER TYPE "Role" ADD VALUE 'NURSE';
ALTER TYPE "Role" ADD VALUE 'PHYSIOTHERAPIST';

-- CreateEnum: admin-created accounts only, so unlike DoctorStatus there is
-- no PENDING/REJECTED state -- account creation is itself the vetting step.
CREATE TYPE "NurseStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PhysiotherapistStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "NurseProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "bio" TEXT,
    "yearsExperience" INTEGER,
    "status" "NurseStatus" NOT NULL DEFAULT 'ACTIVE',
    "statusReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NurseProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NurseProfile_userId_key" ON "NurseProfile"("userId");

-- AddForeignKey
ALTER TABLE "NurseProfile" ADD CONSTRAINT "NurseProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "NurseStatusEvent" (
    "id" TEXT NOT NULL,
    "nurseProfileId" TEXT NOT NULL,
    "fromStatus" "NurseStatus",
    "toStatus" "NurseStatus" NOT NULL,
    "reason" TEXT,
    "changedById" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NurseStatusEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NurseStatusEvent" ADD CONSTRAINT "NurseStatusEvent_nurseProfileId_fkey" FOREIGN KEY ("nurseProfileId") REFERENCES "NurseProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NurseStatusEvent" ADD CONSTRAINT "NurseStatusEvent_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "PhysiotherapistProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "bio" TEXT,
    "yearsExperience" INTEGER,
    "status" "PhysiotherapistStatus" NOT NULL DEFAULT 'ACTIVE',
    "statusReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysiotherapistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhysiotherapistProfile_userId_key" ON "PhysiotherapistProfile"("userId");

-- AddForeignKey
ALTER TABLE "PhysiotherapistProfile" ADD CONSTRAINT "PhysiotherapistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "PhysiotherapistStatusEvent" (
    "id" TEXT NOT NULL,
    "physiotherapistProfileId" TEXT NOT NULL,
    "fromStatus" "PhysiotherapistStatus",
    "toStatus" "PhysiotherapistStatus" NOT NULL,
    "reason" TEXT,
    "changedById" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysiotherapistStatusEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhysiotherapistStatusEvent" ADD CONSTRAINT "PhysiotherapistStatusEvent_physiotherapistProfileId_fkey" FOREIGN KEY ("physiotherapistProfileId") REFERENCES "PhysiotherapistProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysiotherapistStatusEvent" ADD CONSTRAINT "PhysiotherapistStatusEvent_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
