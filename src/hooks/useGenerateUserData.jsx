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
  initialCount = 20
) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [region, setRegion] = useState(initialRegion);
  const [seed, setSeed] = useState(initialSeed);
  const [count, setCount] = useState(initialCount);
  const [totalCount, setTotalCount] = useState(0);

  const generateUsers = (regionCode, seedValue, countValue, pageValue) => {
    const { country, locale: faker } = getRegionInfo(regionCode);
    const currentSeed =
      parseInt(seedValue) + pageValue * countValue + totalCount;
    const generatedUsers = [];

    console.log(totalCount);

    for (let i = 0; i < countValue; i++) {
      const userSeed = currentSeed + i + totalCount;
      faker.seed(userSeed);
      setTotalCount(totalCount + 1);

      generatedUsers.push({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: `${country}, ${faker.location.city()}, ${faker.location.streetAddress()}`,
        phone: faker.phone.number(),
        country,
      });
    }

    return generatedUsers;
  };

  useEffect(() => {
    setTotalCount(0);
    const newUsers = generateUsers(region, seed, count, 1);
    setUsers(newUsers);
    setPage(2);
  }, [region, seed, count]);

  const loadMoreUsers = (newRegion = region, newCount = count) => {
    const newUsers = generateUsers(newRegion, seed, newCount, page);
    setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setPage(page + 1);
  };

  const reGenerateUsers = (newRegion, newSeed = seed, newCount = count) => {
    setTotalCount(0);
    setRegion(newRegion);
    setSeed(newSeed);
    setCount(newCount);
    setPage(1);
  };

  return { users, loadMoreUsers, reGenerateUsers };
};

export default useUserGenerator;
