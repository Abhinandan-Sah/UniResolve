/*
  Warnings:

  - You are about to drop the column `studenId` on the `Answer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,testId,questionId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_studenId_fkey";

-- AlterTable
ALTER TABLE "public"."Answer" DROP COLUMN "studenId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "marksScored" SET DEFAULT 0,
ALTER COLUMN "remarks" SET DEFAULT '';

-- AlterTable
ALTER TABLE "public"."Batch" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Question" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Test" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "active" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "Answer_testId_idx" ON "public"."Answer"("testId");

-- CreateIndex
CREATE INDEX "Answer_studentId_idx" ON "public"."Answer"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_studentId_testId_questionId_key" ON "public"."Answer"("studentId", "testId", "questionId");

-- CreateIndex
CREATE INDEX "Batch_userId_idx" ON "public"."Batch"("userId");

-- CreateIndex
CREATE INDEX "Question_testId_idx" ON "public"."Question"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_regNo_key" ON "public"."Student"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");

-- CreateIndex
CREATE INDEX "Student_batchId_idx" ON "public"."Student"("batchId");

-- CreateIndex
CREATE INDEX "Test_userId_idx" ON "public"."Test"("userId");

-- CreateIndex
CREATE INDEX "Test_batchId_idx" ON "public"."Test"("batchId");

-- CreateIndex
CREATE INDEX "Test_active_idx" ON "public"."Test"("active");

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
