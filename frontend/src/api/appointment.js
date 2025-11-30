import api from "./axios";

/* ---------------------- ADMIN ---------------------- */

export const getAllAppointments = () =>
  api.get("/appointments/admin").then((res) => res.data);

export const createAppointment = (data) =>
  api.post("/appointments/admin", data).then((res) => res.data);

export const getAppointmentById = (id) =>
  api.get(`/appointments/admin/${id}`).then((res) => res.data);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/admin/${id}`).then((res) => res.data);

export const generateMonthScheduleForAllDoctors = (data) =>
  api.post("/appointments/admin/generate-month-all", data).then((res) => res.data);

/* ---------------------- PATIENT ---------------------- */

export const getDoctorAppointmentsForMonth = (doctorId, month, year) =>
  api
    .get(`/appointments/patient/doctor/${doctorId}?month=${month}&year=${year}`)
    .then((res) => res.data);

export const bookAppointment = (id, data) =>
  api.patch(`/appointments/patient/book/${id}`, data).then((res) => res.data);

export const cancelAppointment = (id, data) =>
  api.patch(`/appointments/patient/cancel/${id}`, data).then((res) => res.data);

/* ---------------------- DOCTOR ---------------------- */

export const getDoctorSchedule = (month, year) =>
  api
    .get(`/appointments/doctor/schedule?month=${month}&year=${year}`)
    .then((res) => res.data);

export const blockSlot = (id, data) =>
  api.patch(`/appointments/doctor/block/${id}`, data).then((res) => res.data);

export const makeSlotAvailable = (id, data) =>
  api
    .patch(`/appointments/doctor/available/${id}`, data)
    .then((res) => res.data);
