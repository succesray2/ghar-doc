-- AlterTable: MFA-ready fields, unused by any code path yet
ALTER TABLE "User" ADD COLUMN     "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mfaSecret" TEXT;

-- AlterTable: capture request context on every doctor status change
ALTER TABLE "DoctorStatusEvent" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable: capture request context on every visit status change
ALTER TABLE "VisitStatusEvent" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;
