-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateTable
CREATE TABLE "availabilities" (
    "id" TEXT NOT NULL,
    "technicianProfileId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
