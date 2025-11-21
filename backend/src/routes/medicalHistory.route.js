import express from "express";
import {
  getPatientHistoryWithDoctor,
  getHistoryForPatient,
  createMedicalHistory,
  updateMedicalHistory,
} from "../controllers/medicalHistory.controller.js";

import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------------------- PATIENT ----------------------
router.get(
  "/patient/:doctorId",
  protect,
  restrictTo("PATIENT"),
  getPatientHistoryWithDoctor
);

// ---------------------- DOCTOR ----------------------
router.get(
  "/doctor/:patientId",
  protect,
  restrictTo("DOCTOR"),
  getHistoryForPatient
);

router.post(
  "/doctor/:patientId",
  protect,
  restrictTo("DOCTOR"),
  createMedicalHistory
);

router.patch(
  "/doctor/update/:id",
  protect,
  restrictTo("DOCTOR"),
  updateMedicalHistory
);

export default router;
