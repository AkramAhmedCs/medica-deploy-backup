import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllDoctors } from "../api/user";
import { getPatientHistoryWithDoctor } from "../api/medicalHistory";

const PatientHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "PATIENT") {
        navigate("/");
        return;
      }
      loadDoctors();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors");
      setLoading(false);
    }
  };

  const loadHistory = async (doctorId) => {
    if (!doctorId) return;

    setLoadingHistory(true);
    setError("");
    try {
      const data = await getPatientHistoryWithDoctor(doctorId);
      setHistory(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load medical history");
      setHistory([]);
    }
    setLoadingHistory(false);
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    if (doctorId) {
      loadHistory(doctorId);
    } else {
      setHistory([]);
    }
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
    <DashboardLayout title="My Medical History">
      {/* Doctor Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-secondary font-semibold mb-2">
          Select Doctor to View History
        </label>
        <select
          value={selectedDoctor}
          onChange={handleDoctorChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Choose a doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.user.username} - {doctor.speciality}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* History List */}
      {loadingHistory ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : selectedDoctor ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary mb-4">
            Medical Records
          </h3>
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No medical history found with this doctor.
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
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Dr. {record.doctor?.user?.username || "N/A"}
                    </span>
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
          Please select a doctor to view your medical history.
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientHistory;

