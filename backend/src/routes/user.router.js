import express from "express";
import {
  createAdmin,
  createDoctor,
  createPatient,
  deleteAdmin,
  deleteDoctor,
  deletePatient,
  getAllAdmins,
  getAllUsers,
  getAllDoctors,
  getAllPatients,
  getAdminById,
  getDoctorById,
  getPatientById,
  updateAdmin,
  updateDoctor,
  updatePatient,
  signup,
  login,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);

router.use(protect);
router.get("/", restrictTo("ADMIN"), getAllUsers);

router.get("/admins", restrictTo("ADMIN"), getAllAdmins);

router.get("/doctors", restrictTo("ADMIN", "DOCTOR", "PATIENT"), getAllDoctors);

router.get("/patients", restrictTo("ADMIN", "DOCTOR"), getAllPatients);

router.get("/admins/:id", restrictTo("ADMIN"), getAdminById);

router.get(
  "/doctors/:id",
  restrictTo("ADMIN", "DOCTOR", "PATIENT"),
  getDoctorById
);

router.get("/patients/:id", restrictTo("ADMIN", "DOCTOR"), getPatientById);

router.post("/admins", restrictTo("ADMIN"), createAdmin);

router.post("/doctors", restrictTo("ADMIN"), createDoctor);

router.post("/patients", restrictTo("ADMIN"), createPatient);

router.patch("/admins/:id", restrictTo("ADMIN"), updateAdmin);

router.patch("/doctors/:id", restrictTo("ADMIN"), updateDoctor);

router.patch("/patients/:id", restrictTo("ADMIN"), updatePatient);

router.delete("/admins/:id", restrictTo("ADMIN"), deleteAdmin);

router.delete("/doctors/:id", restrictTo("ADMIN"), deleteDoctor);

router.delete("/patients/:id", restrictTo("ADMIN"), deletePatient);

export default router;
