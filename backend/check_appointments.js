import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  console.log(`Checking appointments for ${month}/${year}...`);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    include: {
      doctor: true,
    }
  });

  console.log(`Found ${appointments.length} appointments.`);
  if (appointments.length > 0) {
    console.log("Sample appointment:", appointments[0]);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
