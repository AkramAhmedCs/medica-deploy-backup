import axios from 'axios';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api/v1';

async function main() {
  try {
    const uniqueSuffix = Date.now();
    const userData = {
      username: `testuser_${uniqueSuffix}`,
      email: `test_${uniqueSuffix}@example.com`,
      password: 'password123',
      phone: '+1234567890'
    };

    console.log("Attempting signup with data:", userData);

    const res = await axios.post(`${API_URL}/users/auth/signup`, userData);

    console.log("Signup successful!");
    console.log("Status:", res.status);
    console.log("Data:", res.data);

  } catch (e) {
    console.log("---------------- ERROR ----------------");
    if (e.response) {
      console.log("Status:", e.response.status);
      console.log("Data:", JSON.stringify(e.response.data, null, 2));
      fs.writeFileSync('signup_error.json', JSON.stringify(e.response.data, null, 2));
    } else {
      console.log("Message:", e.message);
    }
    console.log("---------------------------------------");
  }
}

main();
