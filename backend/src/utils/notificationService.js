import { sendEmail } from "./sendEmail.js";
import { sendSMS } from "./sendSMS.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const notifyPatient = async (patientId, subject, message) => {
  const patient = await prisma.user.findUnique({ where: { id: patientId } });
  if (!patient) return;

  if (patient.email) {
    await sendEmail(patient.email, subject, message, `<p>${message}</p>`);
  }
  if (patient.phone) {
    await sendSMS(patient.phone, message);
  }
};
