import api from "./axios";

/* ---------------------- PATIENT ---------------------- */
// Get patient history with a specific doctor
export const getPatientHistoryWithDoctor = (doctorId) =>
  api.get(`/medicalHistory/patient/${doctorId}`).then((res) => res.data);

/* ---------------------- DOCTOR ---------------------- */
// Get history of a specific patient by doctor
export const getHistoryForPatient = (patientId) =>
  api.get(`/medicalHistory/doctor/${patientId}`).then((res) => res.data);

// Create new medical history for patient
export const createMedicalHistory = (patientId, data) =>
  api.post(`/medicalHistory/doctor/${patientId}`, data).then((res) => res.data);

// Update existing medical history entry
export const updateMedicalHistory = (id, data) =>
  api
    .patch(`/medicalHistory/doctor/update/${id}`, data)
    .then((res) => res.data);
