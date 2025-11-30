
import axios from 'axios';

async function testLogin() {
  try {
    console.log('Attempting login with admin@medica.com...');
    const response = await axios.post('http://localhost:5000/api/v1/users/auth/login', {
      email: 'admin@medica.com',
      password: 'password123'
    }, {
      headers: {
        Authorization: 'Bearer bad_token_example'
      }
    });
    console.log('Login Success:', response.data);
  } catch (error) {
    console.error('Login Failed:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testLogin();
