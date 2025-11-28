import { PrismaClient } from "@prisma/client";
import catchAsync from "../middlewares/catchAsync.js";
import { generateToken } from "../services/jwt.js";
import bcrypt from "bcryptjs";
import AppError from "../services/appError.js";

const prisma = new PrismaClient();

//Signup
export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "PATIENT",
    },
  });
  await prisma.patient.create({
    data: { id: user.id },
  });
  const token = generateToken(user);
  res.status(201).json({ status: "success", token, user });
});

//login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = generateToken(user);
  res.status(200).json({ status: "success", token, user });
});

// Get all users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const totalUsers = await prisma.user.count();
  res.status(200).json({ status: "success", users, totalUsers });
});

// Get all admins
export const getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  res.status(200).json({ status: "success", admins, totalAdmins });
});

// Get all doctors
export const getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      doctor: true,
    },
  });
  const totalDoctors = await prisma.user.count({ where: { role: "DOCTOR" } });
  res.status(200).json({ status: "success", doctors, totalDoctors });
});

// Get all patients
export const getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await prisma.user.findMany({
    where: { role: "PATIENT" },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      patient: true,
    },
  });
  const totalPatients = await prisma.user.count({ where: { role: "PATIENT" } });
  res.status(200).json({ status: "success", patients, totalPatients });
});

// Get admin by id
export const getAdminById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const admin = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
      role: "ADMIN",
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    return res
      .status(404)
      .json({ status: "success", message: "Admin not found" });
  }

  res.status(200).json({ admin });
});

// Get doctor by id
export const getDoctorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
      role: "DOCTOR",
    },
    include: {
      doctor: {
        include: {
          appointments: true,
          medicalHistory: true,
        },
      },
    },
  });

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  res.status(200).json({ status: "success", doctor });
});

// Get patient by id
export const getPatientById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const patient = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
      role: "PATIENT",
    },
    include: {
      patient: {
        include: {
          appointments: true,
          medicalHistory: true,
        },
      },
    },
  });

  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  res.status(200).json({ status: "success", patient });
});

// Create admin
export const createAdmin = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({ status: "success", admin });
});

// Create doctor
export const createDoctor = catchAsync(async (req, res, next) => {
  const { username, email, password, speciality } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const doctor = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          speciality,
        },
      },
    },
    include: { doctor: true },
  });

  res.status(201).json({ status: "success", doctor });
});

// Create patient
export const createPatient = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const patient = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {},
      },
    },
    include: { patient: true },
  });

  res.status(201).json({ status: "success", patient });
});

// Update admin
export const updateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const admin = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ status: "success", admin });
});

// Update doctor
export const updateDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, speciality } = req.body;

  const updateUserData = {};
  if (username) updateUserData.username = username;
  if (email) updateUserData.email = email;
  if (password) updateUserData.password = await bcrypt.hash(password, 10);

  const doctor = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      ...updateUserData,
      doctor: {
        update: {
          ...(speciality && { speciality }),
        },
      },
    },
    include: { doctor: true },
  });

  res.status(200).json({ status: "success", doctor });
});

// Update patient
export const updatePatient = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 12);

  const patient = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
    include: { patient: true },
  });

  res.status(200).json({ status: "success", patient });
});

// Delete admin
export const deleteAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
});

// Delete doctor
export const deleteDoctor = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Delete related records first due to foreign key constraints
  await prisma.appointment.deleteMany({
    where: { doctorId: parseInt(id) },
  });

  await prisma.medicalHistory.deleteMany({
    where: { doctorId: parseInt(id) },
  });

  await prisma.doctor.delete({
    where: { id: parseInt(id) },
  });

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
});

// Delete patient
export const deletePatient = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Delete related records first due to foreign key constraints
  await prisma.appointment.deleteMany({
    where: { patientId: parseInt(id) },
  });

  await prisma.medicalHistory.deleteMany({
    where: { patientId: parseInt(id) },
  });

  await prisma.patient.delete({
    where: { id: parseInt(id) },
  });

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
});
