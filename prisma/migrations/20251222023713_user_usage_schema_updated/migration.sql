/*
  Warnings:

  - You are about to drop the column `reviewCount` on the `user_usage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_usage" DROP COLUMN "reviewCount",
ADD COLUMN     "reviewCounts" JSONB NOT NULL DEFAULT '{}';
