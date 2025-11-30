import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllDoctors } from "../api/user";
import { getDoctorAppointmentsForMonth, bookAppointment, cancelAppointment } from "../api/appointment";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
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

  const loadDoctorAppointments = async (doctorId) => {
    setLoadingAppointments(true);
    setError("");
    try {
      const now = new Date();
      const month = now.getMonth() + 1; // 1-indexed
      const year = now.getFullYear();
      const data = await getDoctorAppointmentsForMonth(doctorId, month, year);
      setAppointments(data.appointments || []);
      setSelectedDoctor(doctorId);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    }
    setLoadingAppointments(false);
  };

  const handleBookAppointment = async (appointmentId) => {
    setError("");
    setSuccess("");
    try {
      await bookAppointment(appointmentId);
      toast.success("Appointment booked successfully!");
      // Reload appointments
      if (selectedDoctor) {
        loadDoctorAppointments(selectedDoctor);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    setError("");
    setSuccess("");
    try {
      await cancelAppointment(appointmentId);
      toast.success("Appointment canceled successfully!");
      // Reload appointments
      if (selectedDoctor) {
        loadDoctorAppointments(selectedDoctor);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel appointment");
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
        return "bg-red-100 text-red-800";
      case "BOOKED_BY_YOU":
        return "bg-blue-100 text-blue-800";
      case "BUSY":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-xl mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Hello {userInfo?.username}!
        </h2>
        <p className="text-white/90">
          Book appointments with your preferred doctors and manage your healthcare.
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

      {/* Doctors List */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-secondary mb-4">Available Doctors</h3>
        {doctors.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No doctors available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">
                      {doctor.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary">
                      Dr. {doctor.username}
                    </h4>
                    <p className="text-sm text-gray-600">{doctor.doctor?.speciality}</p>
                  </div>
                </div>
                <button
                  onClick={() => loadDoctorAppointments(doctor.id)}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-cta transition duration-300"
                >
                  View Appointments
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments Section */}
      {selectedDoctor && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-secondary">Appointments</h3>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="text-primary hover:text-cta"
            >
              Close
            </button>
          </div>

          {loadingAppointments ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              {appointments.length === 0 ? (
                <p className="text-center text-gray-500">
                  No appointments available for this doctor.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-secondary">
                            {formatDate(apt.appointmentDate)}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(
                              apt.status
                            )}`}
                          >
                            {apt.status.replace("_", " ")}
                          </span>
                        </div>
                        <div>
                          {apt.status === "AVAILABLE" && (
                            <button
                              onClick={() => handleBookAppointment(apt.id)}
                              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-cta transition duration-300"
                            >
                              Book
                            </button>
                          )}
                          {apt.status === "BOOKED_BY_YOU" && (
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientProfile;

