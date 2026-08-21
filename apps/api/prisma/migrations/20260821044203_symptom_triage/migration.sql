-- CreateEnum
CREATE TYPE "TriagePriority" AS ENUM ('GREEN', 'ORANGE', 'RED');

-- CreateEnum
CREATE TYPE "BookingRelation" AS ENUM ('SELF', 'PARENT', 'SPOUSE', 'CHILD', 'OTHER_FAMILY');

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "priority" "TriagePriority" NOT NULL DEFAULT 'GREEN',
ADD COLUMN     "bookingFor" "BookingRelation" NOT NULL DEFAULT 'SELF',
ADD COLUMN     "patientName" TEXT,
ADD COLUMN     "patientAge" INTEGER,
ADD COLUMN     "patientSex" TEXT,
ADD COLUMN     "caregiverName" TEXT,
ADD COLUMN     "caregiverPhone" TEXT;

-- CreateIndex
CREATE INDEX "Visit_priority_idx" ON "Visit"("priority");

-- CreateTable
CREATE TABLE "VisitTriage" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "ruleVersion" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "priority" "TriagePriority" NOT NULL,
    "matchedRedFlags" JSONB,
    "redFlagAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitTriage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitTriage_visitId_key" ON "VisitTriage"("visitId");

-- AddForeignKey
ALTER TABLE "VisitTriage" ADD CONSTRAINT "VisitTriage_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
