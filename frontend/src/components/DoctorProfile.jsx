import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");

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
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleBlockSlot = async (appointmentId) => {
    try {
      await blockSlot(appointmentId);
      toast.success("Slot blocked successfully!");
      loadDoctorData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to block slot");
    }
  };

  const handleMakeAvailable = async (appointmentId) => {
    try {
      await makeSlotAvailable(appointmentId);
      toast.success("Slot is now available!");
      loadDoctorData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to make slot available");
    }
  };

  // Get statistics
  const getStats = () => {
    const booked = schedule.filter(s => s.status === "BOOKED").length;
    const available = schedule.filter(s => s.status === "AVAILABLE").length;
    const busy = schedule.filter(s => s.status === "BUSY").length;

    return { booked, available, busy, total: schedule.length };
  };

  // Get today's appointments
  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return schedule.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    });
  };

  // Get weekly data
  const getWeeklyData = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map(day => {
      const dayStr = format(day, "EEE");
      const dayAppointments = schedule.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return format(aptDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });

      return {
        name: dayStr,
        total: dayAppointments.length,
        booked: dayAppointments.filter(a => a.status === "BOOKED").length,
      };
    });
  };

  // Get status distribution
  const getStatusData = () => {
    const stats = getStats();
    return [
      { name: "Available", value: stats.available, color: "#10b981" },
      { name: "Booked", value: stats.booked, color: "#3b82f6" },
      { name: "Busy", value: stats.busy, color: "#ef4444" },
    ].filter(item => item.value > 0);
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

  // Filter appointments
  const getFilteredAppointments = () => {
    let filtered = [...schedule];

    if (filterDate === "today") {
      filtered = getTodayAppointments();
    } else if (filterDate === "week") {
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      filtered = schedule.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= weekStart && aptDate <= weekEnd;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patient?.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const stats = getStats();
  const todayCount = getTodayAppointments().length;

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
          You have {todayCount} appointment{todayCount !== 1 ? "s" : ""} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Total Patients</h3>
            <div className="bg-primary/10 p-2 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary">{patients.length}</p>
          <span className="text-green-500 text-sm">↑ Active patients</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Total Slots</h3>
            <div className="bg-primary/10 p-2 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.total}</p>
          <span className="text-blue-500 text-sm">Monthly schedule</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Booked</h3>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.booked}</p>
          <span className="text-blue-500 text-sm">{((stats.booked / stats.total) * 100 || 0).toFixed(0)}% of slots</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Available</h3>
            <div className="bg-green-500/10 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.available}</p>
          <span className="text-green-500 text-sm">Open slots</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getWeeklyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="booked" fill="#36C4D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-secondary mb-4">Appointment Status</h3>
          {getStatusData().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Appointments</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold text-secondary mb-4">
          My Appointment Schedule
        </h3>
        {getFilteredAppointments().length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm || filterDate !== "all" ? "No appointments match your filters." : "No appointments in your schedule yet."}
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {getFilteredAppointments().map((apt) => (
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
