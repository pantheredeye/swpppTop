-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fiscalYearStart" TIMESTAMP(3),
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "primaryLanguage" TEXT,
ADD COLUMN     "timezone" TEXT;
