/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,appointmentDate]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_appointmentDate_key" ON "Appointment"("doctorId", "appointmentDate");
