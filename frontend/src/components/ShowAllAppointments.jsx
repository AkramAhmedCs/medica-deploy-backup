import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { getAllAppointments, deleteAppointment, getAppointmentById } from "../api/appointment";

const ShowAllAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setAppointmentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      await deleteAppointment(appointmentToDelete);
      toast.success("Appointment deleted successfully");
      setAppointments(appointments.filter((apt) => apt.id !== appointmentToDelete));
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete appointment");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await getAppointmentById(id);
      setSelectedAppointment(response.appointment);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointment details");
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(apt.id)}
                          className="text-primary hover:text-cta hover:bg-blue-50 px-3 py-1 rounded transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(apt.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
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

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-secondary">Appointment Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Appointment ID</p>
                  <p className="font-semibold">{selectedAppointment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${selectedAppointment.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    selectedAppointment.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold">{new Date(selectedAppointment.appointmentDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor ID</p>
                  <p className="font-semibold">{selectedAppointment.doctorId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="font-semibold">{selectedAppointment.patientId || 'N/A'}</p>
                </div>
              </div>
              {selectedAppointment.patient && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Patient Information</h4>
                  <p><strong>Name:</strong> {selectedAppointment.patient.user?.username || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedAppointment.patient.user?.email || 'N/A'}</p>
                </div>
              )}
              {selectedAppointment.doctor && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Doctor Information</h4>
                  <p><strong>Name:</strong> {selectedAppointment.doctor.user?.username || 'N/A'}</p>
                  <p><strong>Speciality:</strong> {selectedAppointment.doctor.speciality || 'N/A'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-secondary mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ShowAllAppointments;
