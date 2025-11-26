import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getDoctorSchedule, blockSlot, makeSlotAvailable } from "../api/appointment";
import { getAllPatients } from "../api/user";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setUserInfo(decoded);
      loadDoctorData();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadDoctorData = async () => {
    try {
      const [scheduleData, patientsData] = await Promise.all([
        getDoctorSchedule(),
        getAllPatients(),
      ]);
      setSchedule(scheduleData.data || []);
      setPatients(patientsData.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleBlockSlot = async (appointmentId) => {
    setError("");
    setSuccess("");
    try {
      await blockSlot(appointmentId);
      setSuccess("Slot blocked successfully!");
      loadDoctorData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to block slot");
    }
  };

  const handleMakeAvailable = async (appointmentId) => {
    setError("");
    setSuccess("");
    try {
      await makeSlotAvailable(appointmentId);
      setSuccess("Slot is now available!");
      loadDoctorData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to make slot available");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "BOOKED":
        return "bg-blue-100 text-blue-800";
      case "BUSY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-xl mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Welcome, Dr. {userInfo?.username || userInfo?.email}!
        </h2>
        <p className="text-white/90">
          Manage your appointments and patient records efficiently.
        </p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-secondary">{patients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Slots</h3>
          <p className="text-3xl font-bold text-secondary">{schedule.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Booked Appointments</h3>
          <p className="text-3xl font-bold text-secondary">
            {schedule.filter((s) => s.status === "BOOKED").length}
          </p>
        </div>
      </div>

      {/* Appointment Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold text-secondary mb-4">
          My Appointment Schedule
        </h3>
        {schedule.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No appointments in your schedule yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {schedule.map((apt) => (
              <div
                key={apt.id}
                className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-secondary mb-1">
                      {formatDate(apt.appointmentDate)}
                    </p>
                    {apt.patient && (
                      <p className="text-sm text-gray-600">
                        Patient: {apt.patient.user.username} ({apt.patient.user.email})
                      </p>
                    )}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === "AVAILABLE" && (
                      <button
                        onClick={() => handleBlockSlot(apt.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Block
                      </button>
                    )}
                    {apt.status === "BUSY" && (
                      <button
                        onClick={() => handleMakeAvailable(apt.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                      >
                        Make Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;

