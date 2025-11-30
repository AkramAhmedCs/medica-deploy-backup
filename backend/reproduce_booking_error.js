import axios from 'axios';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api/v1';

async function main() {
  try {
    // 1. Login
    console.log("Logging in as patient...");
    const loginRes = await axios.post(`${API_URL}/users/auth/login`, {
      email: 'patient@medica.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log("Logged in. Token:", token.substring(0, 20) + "...");

    // 2. Decode token
    const decoded = jwt.decode(token);
    console.log("Decoded token role:", decoded.role);

    // 3. Find an available appointment
    // Let's fetch schedule for doctor 2
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    console.log(`Fetching appointments for doctor 2...`);
    const scheduleRes = await axios.get(`${API_URL}/appointments/patient/doctor/2?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const availableAppt = scheduleRes.data.appointments.find(a => a.status === 'AVAILABLE');

    if (!availableAppt) {
      console.log("No available appointments found to test booking.");
      return;
    }

    console.log(`Attempting to book appointment ${availableAppt.id}...`);

    // 4. Book appointment
    const bookRes = await axios.patch(`${API_URL}/appointments/patient/book/${availableAppt.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Booking response status:", bookRes.status);
    console.log("Booking successful:", bookRes.data);

  } catch (e) {
    console.log("---------------- ERROR ----------------");
    if (e.response) {
      console.log("Status:", e.response.status);
      fs.writeFileSync('error_details.json', JSON.stringify(e.response.data, null, 2));
      console.log("Error details written to error_details.json");
    } else {
      console.log("Message:", e.message);
    }
    console.log("---------------------------------------");
  }
}

main();
