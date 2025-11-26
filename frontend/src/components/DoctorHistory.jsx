import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllPatients } from "../api/user";
import {
  getHistoryForPatient,
  createMedicalHistory,
  updateMedicalHistory,
} from "../api/medicalHistory";
const DoctorHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ prescription: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "DOCTOR") {
        navigate("/");
        return;
      }
      loadPatients();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load patients");
      setLoading(false);
    }
  };

  const loadHistory = async (patientId) => {
    if (!patientId) return;

    setLoadingHistory(true);
    setError("");
    try {
      const data = await getHistoryForPatient(patientId);
      setHistory(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load medical history");
      setHistory([]);
    }
    setLoadingHistory(false);
  };

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    setSelectedPatient(patientId);
    setShowAddForm(false);
    setEditingRecord(null);
    if (patientId) {
      loadHistory(patientId);
    } else {
      setHistory([]);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createMedicalHistory(selectedPatient, formData);
      setSuccess("Medical record added successfully!");
      setFormData({ prescription: "" });
      setShowAddForm(false);
      loadHistory(selectedPatient);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add medical record");
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateMedicalHistory(editingRecord.id, formData);
      setSuccess("Medical record updated successfully!");
      setFormData({ prescription: "" });
      setEditingRecord(null);
      loadHistory(selectedPatient);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update medical record");
    }
  };

  const startEdit = (record) => {
    setEditingRecord(record);
    setFormData({ prescription: record.prescription || "" });
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Patient Medical Records">
      {/* Patient Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-secondary font-semibold mb-2">
          Select Patient
        </label>
        <select
          value={selectedPatient}
          onChange={handlePatientChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Choose a patient --</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.user.username} ({patient.user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Add Record Button */}
      {selectedPatient && !showAddForm && !editingRecord && (
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-cta transition duration-300 mb-6"
        >
          Add New Medical Record
        </button>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingRecord) && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold text-secondary mb-4">
            {editingRecord ? "Edit Medical Record" : "Add New Medical Record"}
          </h3>
          <form onSubmit={editingRecord ? handleUpdateRecord : handleAddRecord}>
            <label className="block text-secondary font-semibold mb-2">
              Prescription
            </label>
            <textarea
              value={formData.prescription}
              onChange={(e) =>
                setFormData({ ...formData, prescription: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              rows="4"
              placeholder="Enter prescription details..."
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-cta transition duration-300"
              >
                {editingRecord ? "Update Record" : "Add Record"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRecord(null);
                  setFormData({ prescription: "" });
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History List */}
      {loadingHistory ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : selectedPatient ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary mb-4">
            Medical Records History
          </h3>
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No medical history found for this patient.
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Visit Date</p>
                      <p className="font-semibold text-secondary">
                        {formatDate(record.visitDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(record)}
                      className="text-primary hover:text-cta transition"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Prescription</p>
                    <p className="text-secondary">
                      {record.prescription || "No prescription provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          Please select a patient to view their medical history.
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorHistory;

