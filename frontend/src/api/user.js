import api from "./axios";

/* ---------------------- AUTH ---------------------- */

export const signup = (data) =>
  api.post("/users/auth/signup", data).then((res) => res.data);

export const login = (data) =>
  api.post("/users/auth/login", data).then((res) => res.data);

/* ---------------------- USERS ROOT ---------------------- */

export const getAllUsers = () => api.get("/").then((res) => res.data);

/* ---------------------- ADMINS ---------------------- */

export const getAllAdmins = () => api.get("/admins").then((res) => res.data);

export const getAdminById = (id) =>
  api.get(`/admins/${id}`).then((res) => res.data);

export const createAdmin = (data) =>
  api.post("/admins", data).then((res) => res.data);

export const updateAdmin = (id, data) =>
  api.patch(`/admins/${id}`, data).then((res) => res.data);

export const deleteAdmin = (id) =>
  api.delete(`/admins/${id}`).then((res) => res.data);

/* ---------------------- DOCTORS ---------------------- */

export const getAllDoctors = () => api.get("/doctors").then((res) => res.data);

export const getDoctorById = (id) =>
  api.get(`/doctors/${id}`).then((res) => res.data);

export const createDoctor = (data) =>
  api.post("/doctors", data).then((res) => res.data);

export const updateDoctor = (id, data) =>
  api.patch(`/doctors/${id}`, data).then((res) => res.data);

export const deleteDoctor = (id) =>
  api.delete(`/doctors/${id}`).then((res) => res.data);

/* ---------------------- PATIENTS ---------------------- */

export const getAllPatients = () =>
  api.get("/patients").then((res) => res.data);

export const getPatientById = (id) =>
  api.get(`/patients/${id}`).then((res) => res.data);

export const createPatient = (data) =>
  api.post("/patients", data).then((res) => res.data);

export const updatePatient = (id, data) =>
  api.patch(`/patients/${id}`, data).then((res) => res.data);

export const deletePatient = (id) =>
  api.delete(`/patients/${id}`).then((res) => res.data);
