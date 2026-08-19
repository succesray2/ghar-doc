-- CreateEnum
CREATE TYPE "DoctorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- AlterTable: add new status columns alongside the old boolean
ALTER TABLE "DoctorProfile" ADD COLUMN     "status" "DoctorStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- Backfill status from the existing isApproved flag before it's dropped
UPDATE "DoctorProfile" SET "status" = 'APPROVED', "reviewedAt" = "updatedAt" WHERE "isApproved" = true;

-- AlterTable: drop the old boolean now that status carries the same information
ALTER TABLE "DoctorProfile" DROP COLUMN "isApproved";

-- CreateTable
CREATE TABLE "DoctorStatusEvent" (
    "id" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "fromStatus" "DoctorStatus",
    "toStatus" "DoctorStatus" NOT NULL,
    "reason" TEXT,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorStatusEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DoctorStatusEvent" ADD CONSTRAINT "DoctorStatusEvent_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "DoctorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorStatusEvent" ADD CONSTRAINT "DoctorStatusEvent_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
