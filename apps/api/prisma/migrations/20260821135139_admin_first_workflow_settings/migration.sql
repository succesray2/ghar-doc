-- AlterEnum: new visit-lifecycle states (provider accept/decline, arrived, no-provider)
ALTER TYPE "VisitStatus" ADD VALUE 'PROVIDER_ACCEPTED';
ALTER TYPE "VisitStatus" ADD VALUE 'PROVIDER_DECLINED';
ALTER TYPE "VisitStatus" ADD VALUE 'ARRIVED';
ALTER TYPE "VisitStatus" ADD VALUE 'NO_PROVIDER_AVAILABLE';

-- CreateEnum
CREATE TYPE "RevokedReason" AS ENUM ('ROTATED', 'REUSE_DETECTED', 'USER_LOGOUT', 'USER_LOGOUT_ALL', 'PASSWORD_CHANGE');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('BOOKING_UPDATE', 'PROVIDER_ASSIGNMENT', 'PROVIDER_ARRIVAL', 'SERVICE_UPDATE', 'PAYMENT_UPDATE', 'GENERAL');

-- CreateEnum
CREATE TYPE "FamilyRelation" AS ENUM ('PARENT', 'SPOUSE', 'CHILD', 'OTHER');

-- AlterTable: new happy-path timestamps, matching the existing assignedAt/enRouteAt pattern
ALTER TABLE "Visit" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "arrivedAt" TIMESTAMP(3);

-- AlterTable: session device context + why a token was revoked (so a bulk
-- logout-all is never misread as token-theft reuse in the security logs)
ALTER TABLE "RefreshToken" ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "revokedReason" "RevokedReason";

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revokedAt_idx" ON "RefreshToken"("userId", "revokedAt");

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" "FamilyRelation" NOT NULL,
    "age" INTEGER,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FamilyMember_userId_idx" ON "FamilyMember"("userId");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "visitId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingUpdates" BOOLEAN NOT NULL DEFAULT true,
    "providerAssignment" BOOLEAN NOT NULL DEFAULT true,
    "providerArrival" BOOLEAN NOT NULL DEFAULT true,
    "serviceUpdates" BOOLEAN NOT NULL DEFAULT true,
    "paymentUpdates" BOOLEAN NOT NULL DEFAULT true,
    "generalNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
