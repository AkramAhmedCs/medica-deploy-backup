import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 12);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medica.com' },
    update: {
      password: password,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@medica.com',
      username: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  // Create Doctor
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@medica.com' },
    update: {},
    create: {
      email: 'doctor@medica.com',
      username: 'Dr. Smith',
      password,
      role: 'DOCTOR',
      doctor: {
        create: {
          speciality: 'Cardiology',
        },
      },
    },
  });

  // Create Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@medica.com' },
    update: {},
    create: {
      email: 'patient@medica.com',
      username: 'John Doe',
      password,
      role: 'PATIENT',
      patient: {
        create: {},
      },
    },
  });

  console.log({ admin, doctor, patient });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
