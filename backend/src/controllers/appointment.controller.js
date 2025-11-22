import { PrismaClient } from "@prisma/client";
import catchAsync from "../middlewares/catchAsync.js";
import AppError from "../services/appError.js";
import { notifyPatient } from "../utils/notificationService.js";
const prisma = new PrismaClient();

//                  ADMIN
//Get All Appointments
export const getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
  });
  const totalAppointments = await prisma.appointment.count();
  res.status(200).json({ status: "success", appointments, totalAppointments });
});

//Create new Appointment
export const createAppointment = catchAsync(async (req, res, next) => {
  const { patientId, doctorId, appointmentDate } = req.body;
  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      status: patientId ? "BOOKED" : "AVAILABLE",
    },
  });
  res.status(201).json({ status: "success", appointment });
});

//Get  Appointment by Id
export const getAppointmentById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
    include: {
      patient: true,
      doctor: true,
    },
  });
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }
  res.status(200).json({ status: "success", appointment });
});

//Delete Appointment by
export const deleteAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await prisma.appointment.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

//generate month schedule

export const generateMonthScheduleForAllDoctors = catchAsync(
  async (req, res, next) => {
    const { month, year } = req.body;

    if (!month || !year) {
      return next(new AppError("Please provide month and year", 400));
    }

    // Get all doctors
    const doctors = await prisma.doctor.findMany();

    if (doctors.length === 0) {
      return next(new AppError("No doctors found", 404));
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    const appointments = [];

    // Loop doctors → loop days
    doctors.forEach((doctor) => {
      for (let day = 1; day <= daysInMonth; day++) {
        appointments.push({
          doctorId: doctor.id,
          patientId: null, // initially empty
          appointmentDate: new Date(year, month - 1, day),
          status: "AVAILABLE",
        });
      }
    });

    await prisma.appointment.createMany({
      data: appointments,
      skipDuplicates: true, // prevents duplicate schedule
    });

    res.status(201).json({
      status: "success",
      message: `Created ${appointments.length} appointment slots for all doctors`,
    });
  }
);

//              PATIENT
// Get doctor appointments for a specific month
export const getDoctorAppointmentsForMonth = catchAsync(
  async (req, res, next) => {
    const { doctorId } = req.params;
    const { month, year } = req.query;
    const userId = req.user.id;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId),
        appointmentDate: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
    });
    const formatted = appointments.map((a) => {
      if (a.status === "BOOKED" && a.patientId === userId) {
        return { ...a, status: "BOOKED_BY_YOU" };
      }
      return a;
    });

    res.status(200).json({
      status: "success",
      appointments: formatted,
    });
  }
);

// Patient books an appointment
export const bookAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!appointment) return next(new AppError("Appointment not found", 404));
  if (appointment.status !== "AVAILABLE")
    return next(new AppError("This slot is not available", 400));

  const updated = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      status: "BOOKED",
      patientId: userId,
    },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });
  await notifyPatient(
    userId,
    "Your appointment is confirmed",
    `Your appointment with Dr. ${
      updated.doctor.user.username
    } is confirmed for ${appointment.appointmentDate.toLocaleString()}`
  );

  res.status(200).json({ status: "success", appointment: updated });
});

// Patient cancels his appointment
export const cancelAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!appointment) return next(new AppError("Appointment not found", 404));
  if (appointment.patientId !== userId)
    return next(new AppError("You cannot cancel this appointment", 403));

  const updated = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      status: "AVAILABLE",
      patientId: null,
    },
  });
  await notifyPatient(
    userId,
    "Appointment Canceled",
    `Your appointment on ${updated.appointmentDate.toLocaleString()} has been canceled.`
  );

  res.status(200).json({ status: "success", appointment: updated });
});

//               DOCTOR

// Get all appointments for the logged-in doctor for a month
export const getDoctorSchedule = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const { month, year } = req.query;

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  });

  res.status(200).json({ status: "success", appointments });
});

// Doctor marks slot as BUSY
export const blockSlot = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doctorId = req.user.id;

  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!appointment || appointment.doctorId !== doctorId)
    return next(new AppError("Cannot modify this appointment", 403));

  const updated = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: { status: "BUSY" },
  });

  res.status(200).json({ status: "success", appointment: updated });
});

// Doctor marks slot as AVAILABLE again
export const makeSlotAvailable = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doctorId = req.user.id;

  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(id) },
  });

  if (!appointment || appointment.doctorId !== doctorId)
    return next(new AppError("Cannot modify this appointment", 403));

  const updated = await prisma.appointment.update({
    where: { id: parseInt(id) },
    data: { status: "AVAILABLE" },
  });

  res.status(200).json({ status: "success", appointment: updated });
});
