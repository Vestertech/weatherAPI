const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

// Enable trust proxy
app.set("trust proxy", true);

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";

  // Retrieve IP from headers
  let clientIp =
    req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.ip;
  // Check for local development and replace with a public IP for testing
  if (clientIp === "::1" || clientIp === "127.0.0.1") {
    clientIp = "8.8.8.8"; // Replace with a public IP address for testing
  }

  console.log("Client IP:", clientIp);

  const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
  const ipinfoToken = process.env.IPINFO_TOKEN;

  if (!openWeatherMapApiKey || !ipinfoToken) {
    return res.status(500).json({ error: "API keys not configured" });
  }

  try {
    let location = "Unknown";
    let locationErrorOccurred = false;

    if (clientIp) {
      try {
        const locationResponse = await axios.get(
          `https://ipinfo.io/${clientIp}/json?token=${ipinfoToken}`
        );
        location = locationResponse.data.city || "Unknown";
        console.log("Location:", location);
      } catch (locationError) {
        locationErrorOccurred = true;
        console.error("Error getting location:", locationError.message);
      }
    }

    let temperature = "Unknown";
    if (!locationErrorOccurred && location !== "Unknown") {
      try {
        const weatherResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${openWeatherMapApiKey}`
        );
        temperature = weatherResponse.data.main.temp;
        console.log("Temperature:", temperature);
      } catch (weatherError) {
        console.error("Error getting weather:", weatherError.message);
      }
    }

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    });

    console.log("Request processed successfully.");
  } catch (error) {
    console.error("Unexpected error:", error.message);

    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    }

    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Server started successfully.");
});
