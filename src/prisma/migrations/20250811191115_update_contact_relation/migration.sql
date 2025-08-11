/*
  Warnings:

  - You are about to drop the column `userId` on the `contacts` table. All the data in the column will be lost.
  - Made the column `resumeId` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_userId_fkey";

-- DropIndex
DROP INDEX "contacts_resumeId_key";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "userId",
ALTER COLUMN "resumeId" SET NOT NULL;
