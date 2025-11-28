import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllAppointments, deleteAppointment } from "../api/appointment";

const ShowAllAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

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
      fetchAppointments();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await getAllAppointments();
      setAppointments(response.appointments || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        toast.success("Appointment deleted successfully");
        setAppointments(appointments.filter((apt) => apt.id !== id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete appointment");
      }
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctor?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toString().includes(searchTerm);

    const matchesStatus = filterStatus === "ALL" || apt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Manage Appointments">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-secondary">All Appointments</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="BUSY">Busy</option>
            </select>

            <input
              type="text"
              placeholder="Search by Doctor, Patient or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Doctor</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{apt.id}</td>
                    <td className="py-3 px-4">
                      {new Date(apt.appointmentDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {apt.doctor?.user?.username || "Unknown"}
                      <span className="block text-xs text-gray-500">{apt.doctor?.speciality}</span>
                    </td>
                    <td className="py-3 px-4">
                      {apt.patient ? (
                        <>
                          {apt.patient.user?.username}
                          <span className="block text-xs text-gray-500">{apt.patient.user?.email}</span>
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${apt.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : apt.status === "BOOKED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShowAllAppointments;
