import overviewImg from "../assets/overview.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginAPI } from "../api/user";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginAPI({ email, password });

      // Save token
      localStorage.setItem("token", res.token);

      // Decode
      const decoded = jwtDecode(res.token);
      const role = decoded.role;

      // Redirect by role
      if (role === "ADMIN") navigate("/admin_dashboard");
      else if (role === "DOCTOR") navigate("/doctor_dashboard");
      else if (role === "PATIENT") navigate("/patient_dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-5xl bg-background shadow-xl rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE – FORM */}
        <div className="bg-primary p-10 flex flex-col justify-center">
          <h2 className="text-white text-3xl font-semibold mb-8 text-center">
            Login Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <p className="bg-red-500 text-white p-2 rounded-lg text-center">
                {error}
              </p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 outline-none"
              required
            />

            <button
              className="
                w-full py-3 mt-4 
                bg-secondary text-white font-medium 
                rounded-xl 
                hover:bg-gray-800
                hover:-translate-y-0.5
                shadow-md hover:shadow-xl
                transition-all duration-300
              "
            >
              Login
            </button>

            <p className="text-white text-center mt-3">
              Don't have an account?
              <Link
                to="/signup"
                className="
                  font-semibold 
                  cursor-pointer
                  text-white 
                  hover:text-secondary 
                  hover:underline 
                  underline-offset-4
                  transition-all duration-200
                "
              >
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE – TEXT + IMAGE */}
        <div className="py-10 pl-5 pr-0 bg-gray-100 md:flex flex-col justify-between hidden">
          <p className="text-xl text-secondary font-semibold leading-relaxed mb-6">
            Medica helps clinics manage appointments, send automatic reminders,
            and streamline communication so patients get a smoother, more
            organized healthcare experience.
          </p>
          <div className="relative right-0 top-10">
            <img
              src={overviewImg}
              alt="Medica Overview"
              className="rounded-sm shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
