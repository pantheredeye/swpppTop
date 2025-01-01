/*
  Warnings:

  - You are about to drop the column `createdAt` on the `MembershipRole` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `MembershipRole` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MembershipRole` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action,subject,organizationId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MembershipRole_organizationId_idx";

-- DropIndex
DROP INDEX "Permission_action_subject_organizationId_scope_key";

-- DropIndex
DROP INDEX "Permission_organizationId_idx";

-- DropIndex
DROP INDEX "Permission_scope_idx";

-- AlterTable
ALTER TABLE "MembershipRole" DROP COLUMN "createdAt",
DROP COLUMN "scope",
DROP COLUMN "updatedAt",
ADD COLUMN     "isSystemDefined" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "scope",
ADD COLUMN     "isSystemDefined" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_subject_organizationId_key" ON "Permission"("action", "subject", "organizationId");
