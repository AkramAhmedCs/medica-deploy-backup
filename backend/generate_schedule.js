import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  console.log(`Generating schedule for ${month}/${year}...`);

  const doctors = await prisma.doctor.findMany();
  if (doctors.length === 0) {
    console.log("No doctors found.");
    return;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const appointmentPromises = [];

  doctors.forEach((doctor) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const appointmentDate = new Date(year, month - 1, day);
      appointmentPromises.push(
        prisma.appointment.upsert({
          where: {
            doctorId_appointmentDate: {
              doctorId: doctor.id,
              appointmentDate: appointmentDate,
            },
          },
          update: {},
          create: {
            doctorId: doctor.id,
            patientId: null,
            appointmentDate: appointmentDate,
            status: "AVAILABLE",
          },
        })
      );
    }
  });

  await Promise.all(appointmentPromises);
  console.log("Schedule generated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
