import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const testCors = async () => {
  try {
    const res = await axios.options(`${API_URL}/appointments/admin`, {
      headers: {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
      },
    });

    console.log("CORS Headers:", res.headers["access-control-allow-origin"]);
    if (res.headers["access-control-allow-origin"] === "*" || res.headers["access-control-allow-origin"] === "http://localhost:5173") {
      console.log("CORS Test Passed");
    } else {
      console.log("CORS Test Failed: Header missing or incorrect");
    }
  } catch (err) {
    console.error("CORS Test Failed:", err.message);
    if (err.response) {
      console.log("Response Headers:", err.response.headers);
    }
  }
};

testCors();
