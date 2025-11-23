import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role)) {
    switch (role) {
      case "ADMIN":
        return <Navigate to="/admin_dashboard" replace />;
      case "DOCTOR":
        return <Navigate to="/doctor_dashboard" replace />;
      case "PATIENT":
        return <Navigate to="/patient_dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}
