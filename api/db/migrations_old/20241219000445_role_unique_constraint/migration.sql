/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `MembershipRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MembershipRole_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "MembershipRole_name_organizationId_key" ON "MembershipRole"("name", "organizationId");
