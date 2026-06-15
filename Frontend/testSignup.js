const axios = require('axios');

async function test() {
  try {
    console.log("Sending signup request for test_teacher@gmail.com...");
    const res = await axios.post('http://localhost:9093/user/signup', {
      fullname: 'Test Teacher',
      email: 'test_teacher@gmail.com',
      password: 'password123',
      role: 2
    });
    console.log("Signup Response:", res.data);
  } catch (err) {
    console.error("Error during API request:", err.response ? err.response.data : err.message);
  }
}

test();
