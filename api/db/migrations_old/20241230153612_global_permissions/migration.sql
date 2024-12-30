/*
  Warnings:

  - The values [SITE,CROSS_ORGANIZATIONAL] on the enum `PermissionScope` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionScope_new" AS ENUM ('GLOBAL', 'ORGANIZATION', 'CUSTOM');
ALTER TABLE "Permission" ALTER COLUMN "scope" DROP DEFAULT;
ALTER TABLE "Permission" ALTER COLUMN "scope" TYPE "PermissionScope_new" USING ("scope"::text::"PermissionScope_new");
ALTER TABLE "MembershipRole" ALTER COLUMN "scope" TYPE "PermissionScope_new" USING ("scope"::text::"PermissionScope_new");
ALTER TYPE "PermissionScope" RENAME TO "PermissionScope_old";
ALTER TYPE "PermissionScope_new" RENAME TO "PermissionScope";
DROP TYPE "PermissionScope_old";
ALTER TABLE "Permission" ALTER COLUMN "scope" SET DEFAULT 'ORGANIZATION';
COMMIT;

-- AlterTable
ALTER TABLE "MembershipRole" ADD COLUMN     "scope" "PermissionScope" NOT NULL DEFAULT 'ORGANIZATION';
