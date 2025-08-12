/*
  Warnings:

  - A unique constraint covering the columns `[resumeId]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `resumeId` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "contacts_resumeId_idx";

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "resumeId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contacts_resumeId_key" ON "contacts"("resumeId");
