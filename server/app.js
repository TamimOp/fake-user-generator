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

// Function to apply errors
const applyErrors = (text, errorCount) => {
  const types = ["delete", "add", "swap"];
  let result = text.split("");

  for (let i = 0; i < errorCount; i++) {
    const errorType = types[Math.floor(Math.random() * types.length)];
    const pos = Math.floor(Math.random() * result.length);

    if (errorType === "delete" && result.length > 1) {
      result.splice(pos, 1); // delete character
    } else if (errorType === "add") {
      const randomChar = String.fromCharCode(
        97 + Math.floor(Math.random() * 26)
      );
      result.splice(pos, 0, randomChar); // add random character
    } else if (errorType === "swap" && pos < result.length - 1) {
      // Swap adjacent characters
      [result[pos], result[pos + 1]] = [result[pos + 1], result[pos]];
    }
  }

  return result.join("");
};

// Function to generate region-specific user data
const generateUserData = (region = "en", baseSeed, index, errorCount = 0) => {
  const combinedSeed = parseInt(baseSeed) + index; // Ensure a unique seed for each user
  faker.seed(combinedSeed); // Use unique seed for each user

  // Define region-specific behavior for generating address and city
  let country, city, address;

  switch (region) {
    case "en": // USA region
      faker.locale = "en_US"; // Force USA-specific data
      country = "USA";
      city = faker.location.city();
      address = faker.location.streetAddress();
      break;

    case "pl": // Poland region
      faker.locale = "pl"; // Force Poland-specific data
      country = "Poland";
      city = faker.location.city();
      address = faker.location.streetAddress();
      break;

    case "ge": // Georgia region
      faker.locale = "ka"; // Force Georgia-specific data
      country = "Georgia";
      city = faker.location.city();
      address = faker.location.streetAddress();
      break;

    default: // Fallback to USA if unknown region
      faker.locale = "en_US"; // Default to USA
      country = "USA";
      city = faker.location.city();
      address = faker.location.streetAddress();
  }

  // Generate the user object with errors applied
  const user = {
    id: faker.string.uuid(),
    name: applyErrors(faker.person.fullName(), errorCount),
    address: applyErrors(address, errorCount),
    city: applyErrors(city, errorCount),
    country: applyErrors(country, errorCount),
    phone: applyErrors(faker.phone.number(), errorCount),
  };

  return user;
};

// API to generate fake users based on region and seed
app.get("/api/users", (req, res) => {
  const { region = "en", count = 10, errors = 0, seed, page = 1 } = req.query;
  console.log("Region:", region); // Debug log to confirm region is passed
  const users = [];

  for (let i = 0; i < count; i++) {
    users.push(generateUserData(region, seed, i, errors)); // Pass index i for unique seed per user
  }

  res.json(users);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
