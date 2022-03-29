-- DropForeignKey
ALTER TABLE "ParkHours" DROP CONSTRAINT "ParkHours_parkId_fkey";

-- AlterTable
ALTER TABLE "Park" ADD COLUMN     "additionalInformation" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Dog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "birthdate" TEXT,
    "image" TEXT,
    "userId" TEXT,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkHours" ADD CONSTRAINT "ParkHours_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "Park"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
