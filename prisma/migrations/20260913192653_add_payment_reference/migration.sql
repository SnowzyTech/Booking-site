-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_paymentReference_key" ON "Booking"("paymentReference");
