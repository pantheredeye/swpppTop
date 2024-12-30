/*
  Warnings:

  - A unique constraint covering the columns `[action,subject,organizationId,scope]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Permission_action_subject_organizationId_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'ORGANIZATION';

-- CreateIndex
CREATE INDEX "Permission_scope_idx" ON "Permission"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_subject_organizationId_scope_key" ON "Permission"("action", "subject", "organizationId", "scope");
