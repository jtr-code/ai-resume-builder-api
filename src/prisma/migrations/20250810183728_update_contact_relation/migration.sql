/*
  Warnings:

  - A unique constraint covering the columns `[resumeId]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `resumeId` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "linkedin" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "resumeId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "certifications_resumeId_idx" ON "certifications"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_resumeId_key" ON "contacts"("resumeId");

-- CreateIndex
CREATE INDEX "contacts_resumeId_idx" ON "contacts"("resumeId");

-- CreateIndex
CREATE INDEX "educations_resumeId_idx" ON "educations"("resumeId");

-- CreateIndex
CREATE INDEX "experiences_resumeId_idx" ON "experiences"("resumeId");

-- CreateIndex
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");

-- CreateIndex
CREATE INDEX "resumes_createdAt_idx" ON "resumes"("createdAt");

-- CreateIndex
CREATE INDEX "resumes_updatedAt_idx" ON "resumes"("updatedAt");

-- CreateIndex
CREATE INDEX "skills_resumeId_idx" ON "skills"("resumeId");
