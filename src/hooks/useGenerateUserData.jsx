import { fakerEN_US, fakerKA_GE, fakerPL } from "@faker-js/faker";
import { useEffect, useState } from "react";

// Helper function to map region codes to locale and country
const getRegionInfo = (regionCode) => {
  const regionMap = {
    en: {
      country: "USA",
      locale: fakerEN_US,
    },
    pl: {
      country: "Poland",
      locale: fakerPL,
    },
    ge: {
      country: "Georgia",
      locale: fakerKA_GE,
    },
  };
  return regionMap[regionCode] || regionMap["en"]; // Default to 'en' if region is unknown
};

const useUserGenerator = (
  initialRegion = "en",
  initialSeed = 1234,
  initialCount = 10
) => {
  const [users, setUsers] = useState([]); // State to hold generated users
  const [page, setPage] = useState(1); // Pagination page tracking
  const [region, setRegion] = useState(initialRegion); // Current region
  const [seed, setSeed] = useState(initialSeed); // Current seed
  const [count, setCount] = useState(initialCount); // Number of users to generate

  // Function to generate a batch of users
  const generateUsers = (regionCode, seedValue, countValue, pageValue) => {
    const { country, locale: faker } = getRegionInfo(regionCode);

    const generatedUsers = [];
    for (let i = 0; i < countValue; i++) {
      const userSeed = parseInt(seedValue) + (pageValue - 1) * countValue + i;
      faker.seed(userSeed); // Seed faker to ensure consistent results

      generatedUsers.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country,
        phone: faker.phone.number(),
      });
    }

    return generatedUsers;
  };

  // Effect to regenerate users when region, seed, or count changes
  useEffect(() => {
    // Ensure users are updated when region or seed changes
    const newUsers = generateUsers(region, seed, count, 1);
    setUsers(newUsers); // Replace the current users with the new ones
    setPage(2); // Reset page number for pagination
  }, [region, seed, count]); // Depend on region, seed, and count

  // Function to load more users
  const loadMoreUsers = () => {
    const newUsers = generateUsers(region, seed, count, page); // Generate users for the next page
    setUsers((prevUsers) => [...prevUsers, ...newUsers]); // Append new users to the current list
    setPage(page + 1); // Increment page for next load
  };

  // Function to handle region change and regenerate users
  const reGenerateUsers = (newRegion, newSeed = seed, newCount = count) => {
    setRegion(newRegion); // Update region
    setSeed(newSeed); // Update seed (or keep current)
    setCount(newCount); // Update count (or keep current)
    setPage(1); // Reset page to 1 for regeneration
  };

  return { users, loadMoreUsers, reGenerateUsers };
};

export default useUserGenerator;
