-- AlterTable: progressive login backoff counters
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- AlterTable: add refresh-token family lineage (nullable first, to backfill)
ALTER TABLE "RefreshToken" ADD COLUMN     "familyId" TEXT;

-- Backfill: every existing token becomes a family of one (no prior rotation
-- lineage to preserve — this column didn't exist before this migration).
UPDATE "RefreshToken" SET "familyId" = "id" WHERE "familyId" IS NULL;

-- AlterTable: now that every row has a value, enforce NOT NULL
ALTER TABLE "RefreshToken" ALTER COLUMN "familyId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");
