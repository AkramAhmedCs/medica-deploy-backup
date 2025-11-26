import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllDoctors, getAllPatients, getAllAdmins } from "../api/user";
import { generateMonthScheduleForAllDoctors } from "../api/appointment";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({ doctors: 0, patients: 0, admins: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "ADMIN") {
        navigate("/");
        return;
      }
      setUserInfo(decoded);
      loadStats();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [doctorsData, patientsData, adminsData] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
        getAllAdmins(),
      ]);
      setStats({
        doctors: doctorsData.data?.length || 0,
        patients: patientsData.data?.length || 0,
        admins: adminsData.data?.length || 0,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load statistics");
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setError("");
    setSuccess("");
    setGenerating(true);
    try {
      await generateMonthScheduleForAllDoctors();
      setSuccess("Monthly schedule generated successfully for all doctors!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate schedule");
    }
    setGenerating(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-xl mb-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Welcome, Admin {userInfo?.username || userInfo?.email}!
        </h2>
        <p className="text-white/90">
          Manage the entire Medica platform from here.
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
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Doctors</h3>
              <p className="text-3xl font-bold text-secondary">{stats.doctors}</p>
            </div>
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Patients</h3>
              <p className="text-3xl font-bold text-secondary">{stats.patients}</p>
            </div>
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">Total Admins</h3>
              <p className="text-3xl font-bold text-secondary">{stats.admins}</p>
            </div>
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-2xl font-bold text-secondary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin_dashboard/show_alldoctors"
            className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h4 className="font-semibold mb-2 text-lg">Manage Doctors</h4>
            <p className="text-white/90 text-sm">Add, edit, or remove doctors</p>
          </Link>

          <Link
            to="/admin_dashboard/show_allpatients"
            className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h4 className="font-semibold mb-2 text-lg">Manage Patients</h4>
            <p className="text-white/90 text-sm">Add, edit, or remove patients</p>
          </Link>

          <Link
            to="/admin_dashboard/show_alladmins"
            className="bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h4 className="font-semibold mb-2 text-lg">Manage Admins</h4>
            <p className="text-white/90 text-sm">Add, edit, or remove admins</p>
          </Link>
        </div>
      </div>

      {/* Schedule Generation */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold text-secondary mb-4">
          Schedule Management
        </h3>
        <p className="text-gray-600 mb-4">
          Generate monthly appointment schedules for all doctors in the system.
        </p>
        <button
          onClick={handleGenerateSchedule}
          disabled={generating}
          className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${generating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondary text-white hover:bg-gray-800"
            }`}
        >
          {generating ? "Generating..." : "Generate Monthly Schedule for All Doctors"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;

