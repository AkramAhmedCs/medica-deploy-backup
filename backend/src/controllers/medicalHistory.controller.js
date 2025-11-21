import { PrismaClient } from "@prisma/client";
import catchAsync from "../middlewares/catchAsync.js";
import AppError from "../services/appError.js";

const prisma = new PrismaClient();

// ------------------------------------------------------------
//                      PATIENT
// ------------------------------------------------------------
export const getPatientHistoryWithDoctor = catchAsync(
  async (req, res, next) => {
    const patientId = req.user.id;
    const doctorId = parseInt(req.params.doctorId);

    const history = await prisma.medicalHistory.findMany({
      where: {
        patientId,
        doctorId,
      },
      include: {
        doctor: { include: { user: true } },
      },
    });

    res.status(200).json({ status: "success", history });
  }
);

// ------------------------------------------------------------
//                      DOCTOR
// ------------------------------------------------------------
export const getHistoryForPatient = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const patientId = parseInt(req.params.patientId);

  const history = await prisma.medicalHistory.findMany({
    where: {
      patientId,
      doctorId,
    },
    include: {
      patient: { include: { user: true } },
    },
  });

  res.status(200).json({ status: "success", history });
});

// Create new entry (doctor only)
export const createMedicalHistory = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const patientId = parseInt(req.params.patientId);
  const { prescription } = req.body;

  const entry = await prisma.medicalHistory.create({
    data: {
      patientId,
      doctorId,
      prescription,
    },
  });

  res.status(201).json({ status: "success", entry });
});

// Update prescription (only same day)
export const updateMedicalHistory = catchAsync(async (req, res, next) => {
  const doctorId = req.user.id;
  const id = parseInt(req.params.id);

  const entry = await prisma.medicalHistory.findUnique({ where: { id } });

  if (!entry) return next(new AppError("History entry not found", 404));

  if (entry.doctorId !== doctorId)
    return next(new AppError("Not authorized", 403));

  // Check if visit date is today
  const today = new Date().toISOString().split("T")[0];
  const visit = entry.visitDate.toISOString().split("T")[0];

  if (today !== visit)
    return next(
      new AppError("You can only edit prescriptions on the same day", 400)
    );

  const updated = await prisma.medicalHistory.update({
    where: { id },
    data: { prescription: req.body.prescription },
  });

  res.status(200).json({ status: "success", updated });
});
