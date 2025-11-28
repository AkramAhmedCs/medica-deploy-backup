import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

async function test() {
  try {
    // 1. Login
    console.log('Attempting login...');
    const loginRes = await axios.post(`${API_URL}/users/auth/login`, {
      email: 'admin@medica.com',
      password: 'password123'
    });
    console.log('Login successful!');
    const token = loginRes.data.token;

    // 2. Get Doctors
    console.log('Fetching doctors...');
    const doctorsRes = await axios.get(`${API_URL}/users/doctors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Doctors fetched successfully:', doctorsRes.data);

    // 3. Create Doctor
    console.log('Creating doctor...');
    const createRes = await axios.post(`${API_URL}/users/doctors`, {
      username: 'Dr. API Test',
      email: 'apitest@medica.com',
      password: 'password123',
      speciality: 'Testing'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Doctor created successfully:', createRes.data);

  } catch (error) {
    console.error('API Test Failed:', error.response ? error.response.data : error.message);
  }
}

test();
