-- CreateEnum
CREATE TYPE "BookingMode" AS ENUM ('VIRTUAL', 'PHYSICAL');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "mode" "BookingMode" NOT NULL DEFAULT 'VIRTUAL';
