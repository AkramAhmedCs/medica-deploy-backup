import api from "./axios";

/* ---------------------- AUTH ---------------------- */

export const signup = (data) =>
  api.post("/users/auth/signup", data).then((res) => res.data);

export const login = (data) =>
  api.post("/users/auth/login", data).then((res) => res.data);

/* ---------------------- USERS ROOT ---------------------- */

export const getAllUsers = () => api.get("/users").then((res) => res.data);

/* ---------------------- ADMINS ---------------------- */

export const getAllAdmins = () =>
  api.get("/users/admins").then((res) => res.data);

export const getAdminById = (id) =>
  api.get(`/users/admins/${id}`).then((res) => res.data);

export const createAdmin = (data) =>
  api.post("/users/admins", data).then((res) => res.data);

export const updateAdmin = (id, data) =>
  api.patch(`/users/admins/${id}`, data).then((res) => res.data);

export const deleteAdmin = (id) =>
  api.delete(`/users/admins/${id}`).then((res) => res.data);

/* ---------------------- DOCTORS ---------------------- */

export const getAllDoctors = () =>
  api.get("/users/doctors").then((res) => res.data);

export const getDoctorById = (id) =>
  api.get(`/users/doctors/${id}`).then((res) => res.data);

export const createDoctor = (data) =>
  api.post("/users/doctors", data).then((res) => res.data);

export const updateDoctor = (id, data) =>
  api.patch(`/users/doctors/${id}`, data).then((res) => res.data);

export const deleteDoctor = (id) =>
  api.delete(`/users/doctors/${id}`).then((res) => res.data);

/* ---------------------- PATIENTS ---------------------- */

export const getAllPatients = () =>
  api.get("/users/patients").then((res) => res.data);

export const getPatientById = (id) =>
  api.get(`/users/patients/${id}`).then((res) => res.data);

export const createPatient = (data) =>
  api.post("/users/patients", data).then((res) => res.data);

export const updatePatient = (id, data) =>
  api.patch(`/users/patients/${id}`, data).then((res) => res.data);

export const deletePatient = (id) =>
  api.delete(`/users/patients/${id}`).then((res) => res.data);
