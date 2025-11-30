import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
    }
  });

  console.log("Doctors:");
  doctors.forEach(d => {
    console.log(`ID: ${d.id}, Name: ${d.user.username}, Email: ${d.user.email}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
