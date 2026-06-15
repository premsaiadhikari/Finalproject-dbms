const axios = require('axios');

async function test() {
  try {
    console.log("1. Sending signin request...");
    const signinRes = await axios.post('http://localhost:9093/user/signin', {
      username: 'teacher@gmail.com',
      password: 'teacher123'
    });
    console.log("Signin Response:", signinRes.data);

    if (signinRes.data && signinRes.data.jwt) {
      console.log("2. Sending uinfo request...");
      const uinfoRes = await axios.get('http://localhost:9093/user/uinfo', {
        headers: {
          Token: signinRes.data.jwt
        }
      });
      console.log("Uinfo Response:", uinfoRes.data);
    } else {
      console.log("No JWT in response");
    }
  } catch (err) {
    console.error("Error during API request:", err.response ? err.response.data : err.message);
  }
}

test();
