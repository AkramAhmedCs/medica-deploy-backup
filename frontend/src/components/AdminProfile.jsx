import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllDoctors, getAllPatients, getAllAdmins } from "../api/user";
import { generateMonthScheduleForAllDoctors, getAllAppointments } from "../api/appointment";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({ doctors: 0, patients: 0, admins: 0, appointments: 0 });
  const [appointments, setAppointments] = useState([]);
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
      loadDashboardData();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [doctorsData, patientsData, adminsData, appointmentsData] = await Promise.all([
        getAllDoctors(),
        getAllPatients(),
        getAllAdmins(),
        getAllAppointments().catch(() => ({ data: [] })),
      ]);

      setStats({
        doctors: doctorsData.data?.length || 0,
        patients: patientsData.data?.length || 0,
        admins: adminsData.data?.length || 0,
        appointments: appointmentsData.data?.length || 0,
      });

      setAppointments(appointmentsData.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    try {
      await generateMonthScheduleForAllDoctors();
      toast.success("Monthly schedule generated successfully for all doctors!");
      loadDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate schedule");
    }
    setGenerating(false);
  };

  // Prepare chart data
  const getStatusData = () => {
    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const userGrowthData = [
    { name: "Doctors", count: stats.doctors, fill: "#36C4D4" },
    { name: "Patients", count: stats.patients, fill: "#00C8B3" },
    { name: "Admins", count: stats.admins, fill: "#393E46" },
  ];

  const COLORS = {
    AVAILABLE: "#10b981",
    BOOKED: "#3b82f6",
    BUSY: "#ef4444",
    BOOKED_BY_YOU: "#8b5cf6",
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

      {/* Stats Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Doctors</h3>
              <p className="text-3xl font-bold text-secondary dark:text-white">{stats.doctors}</p>
              <span className="text-green-500 text-sm">↑ Active</span>
            </div>
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Patients</h3>
              <p className="text-3xl font-bold text-secondary dark:text-white">{stats.patients}</p>
              <span className="text-green-500 text-sm">↑ Growing</span>
            </div>
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Appointments</h3>
              <p className="text-3xl font-bold text-secondary dark:text-white">{stats.appointments}</p>
              <span className="text-blue-500 text-sm">Total bookings</span>
            </div>
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">System Admins</h3>
              <p className="text-3xl font-bold text-secondary dark:text-white">{stats.admins}</p>
              <span className="text-gray-500 text-sm">Staff members</span>
            </div>
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#36C4D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">Appointment Status</h3>
          {getStatusData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusData().map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || "#888"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No appointment data available
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin_dashboard/show_alldoctors"
            className="group bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h4 className="font-semibold text-lg">Manage Doctors</h4>
            </div>
            <p className="text-white/90 text-sm">Add, edit, or remove doctors</p>
          </Link>

          <Link
            to="/admin_dashboard/show_allpatients"
            className="group bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 className="font-semibold text-lg">Manage Patients</h4>
            </div>
            <p className="text-white/90 text-sm">Add, edit, or remove patients</p>
          </Link>

          <Link
            to="/admin_dashboard/show_alladmins"
            className="group bg-gradient-to-r from-primary to-cta text-white p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h4 className="font-semibold text-lg">Manage Admins</h4>
            </div>
            <p className="text-white/90 text-sm">Add, edit, or remove admins</p>
          </Link>
        </div>
      </div>

      {/* Schedule Generation */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4">
          Schedule Management
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Generate monthly appointment schedules for all doctors in the system.
        </p>
        <button
          onClick={handleGenerateSchedule}
          disabled={generating}
          className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${generating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondary dark:bg-primary text-white hover:bg-gray-800 dark:hover:bg-cta"
            }`}
        >
          {generating ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Monthly Schedule for All Doctors"
          )}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
