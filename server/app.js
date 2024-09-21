// Import necessary modules
const express = require("express");
const { faker } = require("@faker-js/faker");
const cors = require("cors");

// Initialize Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Generate fake user data
const generateUserData = (region = "en") => {
  faker.locale = region; // Set locale for the faker based on the region

  return {
    id: faker.string.uuid(), // For latest version, use faker.string.uuid()
    name: faker.person.fullName(), // Updated to faker.person.fullName()
    email: faker.internet.email(),
    address: faker.location.streetAddress(), // Updated to faker.location.streetAddress()
    city: faker.location.city(), // Updated to faker.location.city()
    country: faker.location.country(), // Updated to faker.location.country()
    phone: faker.phone.number(),
  };
};

// API to generate fake users based on region
app.get("/api/users", (req, res) => {
  const { region = "en", count = 10 } = req.query; // Default region 'en', default 10 users
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push(generateUserData(region));
  }

  res.json(users);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
