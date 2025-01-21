/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "priceId" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_subscriptionId_key" ON "Organization"("subscriptionId");
