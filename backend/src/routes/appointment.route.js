import express from "express";
import {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  generateMonthScheduleForAllDoctors,
  getDoctorAppointmentsForMonth,
  bookAppointment,
  cancelAppointment,
  getDoctorSchedule,
  blockSlot,
  makeSlotAvailable,
} from "../controllers/appointment.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ------------------------------------------------------------
//                        ADMIN ROUTES
// ------------------------------------------------------------

router.get("/admin", protect, restrictTo("ADMIN"), getAllAppointments);

router.post("/admin", protect, restrictTo("ADMIN"), createAppointment);

router.get("/admin/:id", protect, restrictTo("ADMIN"), getAppointmentById);

router.delete("/admin/:id", protect, restrictTo("ADMIN"), deleteAppointment);

router.post(
  "/admin/generate-month-all",
  protect,
  restrictTo("ADMIN"),
  generateMonthScheduleForAllDoctors
);

// ------------------------------------------------------------
//                        PATIENT ROUTES
// ------------------------------------------------------------

router.get(
  "/patient/doctor/:doctorId",
  protect,
  restrictTo("PATIENT"),
  getDoctorAppointmentsForMonth
);

router.patch(
  "/patient/book/:id",
  protect,
  restrictTo("PATIENT"),
  bookAppointment
);

router.patch(
  "/patient/cancel/:id",
  protect,
  restrictTo("PATIENT"),
  cancelAppointment
);

// ------------------------------------------------------------
//                        DOCTOR ROUTES
// ------------------------------------------------------------

router.get(
  "/doctor/schedule",
  protect,
  restrictTo("DOCTOR"),
  getDoctorSchedule
);

router.patch("/doctor/block/:id", protect, restrictTo("DOCTOR"), blockSlot);

router.patch(
  "/doctor/available/:id",
  protect,
  restrictTo("DOCTOR"),
  makeSlotAvailable
);

export default router;
