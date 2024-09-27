import { fakerEN_US, fakerKA_GE, fakerPL } from "@faker-js/faker";
import { useEffect, useState } from "react";

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
  return regionMap[regionCode] || regionMap["en"];
};

const useUserGenerator = (
  initialRegion = "en",
  initialSeed = 1234,
  initialCount = 10
) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [region, setRegion] = useState(initialRegion);
  const [seed, setSeed] = useState(initialSeed);
  const [count, setCount] = useState(initialCount);

  const generateUsers = (regionCode, seedValue, countValue, pageValue) => {
    const { country, locale: faker } = getRegionInfo(regionCode);

    const generatedUsers = [];
    for (let i = 0; i < countValue; i++) {
      const userSeed = parseInt(seedValue) + (pageValue - 1) * countValue + i;
      faker.seed(userSeed);

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

  useEffect(() => {
    const newUsers = generateUsers(region, seed, count, 1);
    setUsers(newUsers);
    setPage(2);
  }, [region, seed, count]);

  const loadMoreUsers = () => {
    const newUsers = generateUsers(region, seed, count, page);
    setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setPage(page + 1);
  };

  const reGenerateUsers = (newRegion, newSeed = seed, newCount = count) => {
    setRegion(newRegion);
    setSeed(newSeed);
    setCount(newCount);
    setPage(1);
  };

  return { users, loadMoreUsers, reGenerateUsers };
};

export default useUserGenerator;
