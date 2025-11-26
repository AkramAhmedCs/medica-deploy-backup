import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const UnregisterHome = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-cta text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Medica
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Streamline your healthcare experience with smart appointment booking,
            automated reminders, and seamless communication between patients and doctors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:scale-105 transform transition duration-300 shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-secondary dark:text-white mb-12">
            Why Choose Medica?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary dark:text-white mb-3 text-center">
                Easy Appointment Booking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Book appointments with your preferred doctors in just a few clicks.
                View available time slots and choose what works for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary dark:text-white mb-3 text-center">
                Medical History Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Access your complete medical history anytime. All your prescriptions
                and visit records in one secure place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-xl font-semibold text-secondary dark:text-white mb-3 text-center">
                Doctor-Patient Communication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Seamless communication between doctors and patients. Get timely
                updates and manage your healthcare efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-secondary mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Create an Account
              </h3>
              <p className="text-gray-600">
                Sign up as a patient in seconds and complete your profile.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Choose Your Doctor
              </h3>
              <p className="text-gray-600">
                Browse available doctors and select based on specialty and availability.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                Book & Manage
              </h3>
              <p className="text-gray-600">
                Book appointments and manage your medical records all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-cta text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of patients and doctors using Medica today.
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 shadow-lg inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 Medica. All rights reserved. | Building better healthcare
            together.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UnregisterHome;

