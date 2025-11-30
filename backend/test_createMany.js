
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting createMany with skipDuplicates...');

    // Create a dummy doctor if not exists
    let doctor = await prisma.doctor.findFirst();
    if (!doctor) {
      const user = await prisma.user.create({
        data: {
          username: 'TestDr',
          email: 'testdr@test.com',
          password: 'pass',
          role: 'DOCTOR',
          doctor: { create: { speciality: 'Test' } }
        }
      });
      doctor = await prisma.doctor.findUnique({ where: { id: user.id } });
    }

    const appointments = [
      {
        doctorId: doctor.id,
        patientId: null,
        appointmentDate: new Date("2025-12-01T10:00:00Z"),
        status: "AVAILABLE"
      },
      {
        doctorId: doctor.id,
        patientId: null,
        appointmentDate: new Date("2025-12-01T10:00:00Z"), // Duplicate date
        status: "AVAILABLE"
      }
    ];

    const result = await prisma.appointment.createMany({
      data: appointments,
      skipDuplicates: true,
    });

    console.log('Success:', result);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
