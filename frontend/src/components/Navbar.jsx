import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUsername(decoded.username || decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setUsername("");
    navigate("/");
  };

  const getDashboardLink = () => {
    if (userRole === "ADMIN") return "/admin_dashboard";
    if (userRole === "DOCTOR") return "/doctor_dashboard";
    if (userRole === "PATIENT") return "/patient_dashboard";
    return "/";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={userRole ? getDashboardLink() : "/"}
            className="flex items-center space-x-2"
          >
            <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-secondary">Medica</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!userRole ? (
              <>
                <Link
                  to="/login"
                  className="text-secondary hover:text-primary transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-cta transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-secondary hover:text-primary transition duration-200"
                >
                  Dashboard
                </Link>

                {userRole === "PATIENT" && (
                  <Link
                    to="/patient_dashboard/history"
                    className="text-secondary hover:text-primary transition duration-200"
                  >
                    Medical History
                  </Link>
                )}

                {userRole === "DOCTOR" && (
                  <>
                    <Link
                      to="/doctor_dashboard/history"
                      className="text-secondary hover:text-primary transition duration-200"
                    >
                      Patient Records
                    </Link>
                    <Link
                      to="/doctor_dashboard/consultation"
                      className="text-secondary hover:text-primary transition duration-200"
                    >
                      Consultation
                    </Link>
                  </>
                )}

                {userRole === "ADMIN" && (
                  <>
                    <Link
                      to="/admin_dashboard/show_alldoctors"
                      className="text-secondary hover:text-primary transition duration-200"
                    >
                      Doctors
                    </Link>
                    <Link
                      to="/admin_dashboard/show_allpatients"
                      className="text-secondary hover:text-primary transition duration-200"
                    >
                      Patients
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-secondary text-sm">
                    {username} ({userRole})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!userRole ? (
              <>
                <Link
                  to="/login"
                  className="block text-secondary hover:text-primary transition duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-cta transition duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block text-secondary hover:text-primary transition duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userRole === "PATIENT" && (
                  <Link
                    to="/patient_dashboard/history"
                    className="block text-secondary hover:text-primary transition duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Medical History
                  </Link>
                )}
                {userRole === "DOCTOR" && (
                  <>
                    <Link
                      to="/doctor_dashboard/history"
                      className="block text-secondary hover:text-primary transition duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patient Records
                    </Link>
                    <Link
                      to="/doctor_dashboard/consultation"
                      className="block text-secondary hover:text-primary transition duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Consultation
                    </Link>
                  </>
                )}
                {userRole === "ADMIN" && (
                  <>
                    <Link
                      to="/admin_dashboard/show_alldoctors"
                      className="block text-secondary hover:text-primary transition duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Doctors
                    </Link>
                    <Link
                      to="/admin_dashboard/show_allpatients"
                      className="block text-secondary hover:text-primary transition duration-200 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patients
                    </Link>
                  </>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-secondary mb-2">
                    {username} ({userRole})
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
