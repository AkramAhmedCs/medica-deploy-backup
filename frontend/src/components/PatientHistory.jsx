import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllDoctors } from "../api/user";
import { getPatientHistoryWithDoctor } from "../api/medicalHistory";
import { generateMedicalHistoryPDF } from "../utils/exportUtils";

const PatientHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
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
      setUserInfo(decoded);
      loadDoctors();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data.doctors || []);
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

  const handleExportPDF = () => {
    if (!selectedDoctor || history.length === 0) {
      toast.error("No medical history to export");
      return;
    }

    const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));
    const patientName = userInfo?.username || userInfo?.email || "Patient";
    const doctorName = doctor ? `Dr. ${doctor.user.username}` : "Doctor";

    try {
      generateMedicalHistoryPDF(patientName, doctorName, history);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
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
              Dr. {doctor.username} - {doctor.doctor?.speciality}
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-secondary">
              Medical Records
            </h3>
            {history.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-cta transition duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
            )}
          </div>
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

