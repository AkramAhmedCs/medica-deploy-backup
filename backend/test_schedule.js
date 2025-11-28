import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const login = async () => {
  try {
    const res = await axios.post(`${API_URL}/users/auth/login`, {
      email: "admin@medica.com",
      password: "password123",
    });
    return res.data.token;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    process.exit(1);
  }
};

const generateSchedule = async (token) => {
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    console.log(`Generating schedule for Month: ${nextMonth.getMonth() + 1}, Year: ${nextMonth.getFullYear()}`);

    const res = await axios.post(
      `${API_URL}/appointments/admin/generate-month-all`,
      {
        month: nextMonth.getMonth() + 1,
        year: nextMonth.getFullYear(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Schedule Generation Response:", res.data);
  } catch (err) {
    console.error("Schedule Generation Failed:", err.response?.data || err.message);
  }
};

const getAppointments = async (token) => {
  try {
    const res = await axios.get(
      `${API_URL}/appointments/admin`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Get Appointments Response:", {
      status: res.data.status,
      count: res.data.appointments?.length,
      total: res.data.totalAppointments
    });
  } catch (err) {
    console.error("Get Appointments Failed:", err.response?.data || err.message);
  }
};

const run = async () => {
  const token = await login();
  await generateSchedule(token);
  await getAppointments(token);
};

run();
