import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../api/user";

const ShowAllAdmins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
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
      if (decoded.role !== "ADMIN") {
        navigate("/");
        return;
      }
      loadAdmins();
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [navigate]);

  const loadAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load admins");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, formData);
        setSuccess("Admin updated successfully!");
      } else {
        await createAdmin(formData);
        setSuccess("Admin created successfully!");
      }
      resetForm();
      loadAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    setError("");
    setSuccess("");
    try {
      await deleteAdmin(id);
      setSuccess("Admin deleted successfully!");
      loadAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const startEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.user.username,
      email: admin.user.email,
      phone: admin.user.phone || "",
      password: "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
    });
    setEditingAdmin(null);
    setShowForm(false);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Manage Admins">
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

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-cta transition duration-300 mb-6"
        >
          Add New Admin
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold text-secondary mb-4">
            {editingAdmin ? "Edit Admin" : "Add New Admin"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-secondary font-semibold mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-secondary font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-secondary font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-secondary font-semibold mb-2">
                Password {editingAdmin && "(leave blank to keep current)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required={!editingAdmin}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-cta transition duration-300"
              >
                {editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h3 className="text-xl font-bold text-secondary mb-4">All Admins</h3>
        {admins.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No admins found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Username</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{admin.id}</td>
                  <td className="py-3 px-4">{admin.user.username}</td>
                  <td className="py-3 px-4">{admin.user.email}</td>
                  <td className="py-3 px-4">{admin.user.phone || "N/A"}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(admin)}
                        className="text-primary hover:text-cta transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShowAllAdmins;
