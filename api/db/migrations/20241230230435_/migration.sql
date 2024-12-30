/*
  Warnings:

  - A unique constraint covering the columns `[action,subject,organizationId,scope]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Permission_action_subject_scope_organizationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_subject_organizationId_scope_key" ON "Permission"("action", "subject", "organizationId", "scope");
