/*
  Warnings:

  - Added the required column `addressJapanese` to the `Park` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameJapanese` to the `Park` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Park" ADD COLUMN     "addressJapanese" TEXT NOT NULL,
ADD COLUMN     "nameJapanese" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT;
