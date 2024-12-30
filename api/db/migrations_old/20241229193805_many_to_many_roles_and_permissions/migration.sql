/*
  Warnings:

  - You are about to drop the column `permissionId` on the `MembershipRole` table. All the data in the column will be lost.
  - You are about to drop the column `deactivatedBy` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `deactivationReason` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `resourceId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action,subject,organizationId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `MembershipRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'READ', 'WRITE', 'DELETE');

-- DropForeignKey
ALTER TABLE "MembershipRole" DROP CONSTRAINT "MembershipRole_permissionId_fkey";

-- DropIndex
DROP INDEX "Permission_name_scope_key";

-- AlterTable
ALTER TABLE "MembershipRole" DROP COLUMN "permissionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "deactivatedBy",
DROP COLUMN "deactivationReason",
DROP COLUMN "deletedAt",
DROP COLUMN "name",
DROP COLUMN "resourceId",
DROP COLUMN "resourceType",
DROP COLUMN "scope",
ADD COLUMN     "action" "Action" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "fields" TEXT[],
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingMembershipRole" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "PendingMembershipRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "PendingMembershipRole_membershipId_idx" ON "PendingMembershipRole"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingMembershipRole_membershipId_roleId_key" ON "PendingMembershipRole"("membershipId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_subject_organizationId_key" ON "Permission"("action", "subject", "organizationId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MembershipRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingMembershipRole" ADD CONSTRAINT "PendingMembershipRole_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingMembershipRole" ADD CONSTRAINT "PendingMembershipRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MembershipRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
