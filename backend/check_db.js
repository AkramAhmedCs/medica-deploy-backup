import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    const admin = await prisma.user.findUnique({ where: { email: 'admin@medica.com' } });
    console.log('Admin user found:', admin ? 'Yes' : 'No');
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
