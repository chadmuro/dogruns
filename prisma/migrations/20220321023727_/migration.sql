/*
  Warnings:

  - You are about to drop the column `submittedUserId` on the `Park` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "Park" DROP CONSTRAINT "Park_submittedUserId_fkey";

-- AlterTable
ALTER TABLE "Park" DROP COLUMN "submittedUserId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';

-- AddForeignKey
ALTER TABLE "Park" ADD CONSTRAINT "Park_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
