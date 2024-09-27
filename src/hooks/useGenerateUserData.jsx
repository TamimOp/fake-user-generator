import { faker } from "@faker-js/faker";
import { useEffect, useRef, useState } from "react";

const useUserGenerator = (
  initialRegion = "en",
  initialSeed = 1234,
  initialCount = 10
) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const isInitialLoad = useRef(true);

  // Function to generate users
  const generateUsers = (region, seed, count, page) => {
    const generatedUsers = [];

    for (let i = 0; i < count; i++) {
      const userSeed = parseInt(seed) + (page - 1) * count + i;
      faker.seed(userSeed);

      let country, city, address;

      switch (region) {
        case "en":
          faker.locale = "en_US";
          country = "USA";
          city = faker.location.city();
          address = faker.location.streetAddress();
          break;

        case "pl":
          faker.locale = "pl";
          country = "Poland";
          city = faker.location.city();
          address = faker.location.streetAddress();
          break;

        case "ge":
          faker.locale = "ka";
          country = "Georgia";
          city = faker.location.city();
          address = faker.location.streetAddress();
          break;

        default:
          faker.locale = "en_US";
          country = "USA";
          city = faker.location.city();
          address = faker.location.streetAddress();
      }

      const user = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: address,
        city: city,
        country: country,
        phone: faker.phone.number(),
      };

      generatedUsers.push(user);
    }

    setUsers((prevUsers) => [...prevUsers, ...generatedUsers]);
  };

  // Load users based on parameters
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Mark initial load as done
      generateUsers(initialRegion, initialSeed, initialCount, 1);
      setPage(2); // Increment page for next load
    } else {
      // On parameter change, regenerate users
      setUsers([]); // Clear users on parameter change
      setPage(1); // Reset page for new generation
      generateUsers(initialRegion, initialSeed, initialCount, 1);
    }
  }, [initialRegion, initialSeed, initialCount]);

  const loadMoreUsers = (region, seed, count = 10) => {
    generateUsers(region, seed, count, page);
    setPage((prevPage) => prevPage + 1); // Increment page for next load
  };

  const reGenerateUsers = (region, seed, count = 10) => {
    setUsers([]); // Clear previous users
    setPage(1); // Reset page
    generateUsers(region, seed, count, 1);
  };

  return { users, loadMoreUsers, reGenerateUsers, page };
};

export default useUserGenerator;
