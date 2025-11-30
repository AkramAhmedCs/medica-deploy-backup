import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

async function main() {
  try {
    // Login
    console.log("Logging in...");
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: 'patient@medica.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log("Logged in. Token:", token.substring(0, 20) + "...");

    // Get appointments
    const doctorId = 2;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    console.log(`Fetching appointments for doctor ${doctorId}, month: ${month}, year: ${year}`);

    const res = await axios.get(`${API_URL}/appointments/patient/doctor/${doctorId}?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Response status:", res.status);
    console.log("Appointments found:", res.data.appointments.length);
    if (res.data.appointments.length > 0) {
      console.log("Sample:", res.data.appointments[0]);
    }

  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}

main();
