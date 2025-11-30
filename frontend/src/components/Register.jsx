import overviewImg from "../assets/overview.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup as signupAPI } from "../api/user";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+2" + formattedPhone.slice(1);
      }
      const data = await signupAPI({ username, phone, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/patient_dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-5xl bg-background shadow-xl rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE – FORM */}
        <div className="bg-primary p-10 flex flex-col justify-center">
          <h2 className="text-white text-3xl font-semibold mb-8 text-center">
            Sign Up Now
          </h2>

          <form className="space-y-4" onSubmit={handleSignup}>
            {error && (
              <p className="bg-red-500 text-white p-2 rounded-lg text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-500 text-white p-2 rounded-lg text-center">
                {success}
              </p>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 outline-none"
              required
            />

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
              type="submit"
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
              Sign Up
            </button>

            <p className="text-white text-center mt-3">
              Already have an account?
              <Link
                to="/login"
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
                Login Now
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

