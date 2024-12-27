-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('PERSONAL', 'OTHER');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'OTHER';
