
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in DB:', users);

    const admin = await prisma.user.findUnique({ where: { email: 'admin@medica.com' } });
    if (admin) {
      console.log('Admin found:', admin.email);
      console.log('Admin pass match:', await bcrypt.compare('password123', admin.password));
    }

    const doctor = await prisma.user.findUnique({ where: { email: 'doctor@medica.com' } });
    if (doctor) {
      console.log('Doctor found:', doctor.email);
      console.log('Doctor pass match:', await bcrypt.compare('password123', doctor.password));
    }

    const patient = await prisma.user.findUnique({ where: { email: 'patient@medica.com' } });
    if (patient) {
      console.log('Patient found:', patient.email);
      console.log('Patient pass match:', await bcrypt.compare('password123', patient.password));
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
