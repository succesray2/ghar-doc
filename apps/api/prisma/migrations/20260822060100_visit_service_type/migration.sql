-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('DOCTOR_VISIT', 'NURSING', 'PHYSIOTHERAPY');

-- AlterTable: new provider FKs + service-type discriminator, all additive.
-- serviceType defaults to DOCTOR_VISIT so every existing row (and any client
-- still posting without a serviceType field) keeps meaning exactly what it
-- means today. doctorId/doctor are completely untouched.
ALTER TABLE "Visit" ADD COLUMN     "nurseId" TEXT,
ADD COLUMN     "physiotherapistId" TEXT,
ADD COLUMN     "serviceType" "ServiceType" NOT NULL DEFAULT 'DOCTOR_VISIT',
ADD COLUMN     "serviceDetails" JSONB;

-- CreateIndex
CREATE INDEX "Visit_nurseId_idx" ON "Visit"("nurseId");

-- CreateIndex
CREATE INDEX "Visit_physiotherapistId_idx" ON "Visit"("physiotherapistId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_physiotherapistId_fkey" FOREIGN KEY ("physiotherapistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: lightweight safety-net audit record for Nursing/Physiotherapy
-- bookings (NOT the doctor triage engine, which is untouched). The check
-- hard-blocks on any red flag with no acknowledge-and-proceed path, so a row
-- existing at all means the check passed -- no "triggered" column needed.
CREATE TABLE "VisitSafetyCheck" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "ruleVersion" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitSafetyCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitSafetyCheck_visitId_key" ON "VisitSafetyCheck"("visitId");

-- AddForeignKey
ALTER TABLE "VisitSafetyCheck" ADD CONSTRAINT "VisitSafetyCheck_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
