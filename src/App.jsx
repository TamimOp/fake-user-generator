import { useEffect, useState } from "react";
import Control from "./components/Control";
import DataTable from "./components/DataTable";
import useGenerateUserData from "./hooks/useGenerateUserData";

const App = () => {
  const [region, setRegion] = useState("en");
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState(Math.random().toString().slice(2, 8));
  const { users, loadMoreUsers } = useGenerateUserData(region, seed);
  const [records, setRecords] = useState(users);

  const loadMoreRecords = async () => {
    loadMoreUsers(region, 10);
  };
  // Linear congruential generator for seeded random numbers
  const seededRandom = (seed) => {
    let value = seed;
    return function () {
      const a = 1664525;
      const c = 1013904223;
      const m = Math.pow(2, 32);
      value = (a * value + c) % m;
      return value / m;
    };
  };

  // Function to apply random errors to a text, influenced by the seed
  const applyErrors = (text, errorCount) => {
    const types = ["delete", "add", "swap"];
    let result = text.split("");

    const random = seededRandom(seed); // Create a PRNG using the seed

    for (let i = 0; i < errorCount; i++) {
      const errorType = types[Math.floor(random() * types.length)]; // Deterministic random error type
      const pos = Math.floor(random() * result.length); // Deterministic random position

      if (errorType === "delete" && result.length > 1) {
        result.splice(pos, 1);
      } else if (errorType === "add") {
        const randomChar = String.fromCharCode(97 + Math.floor(random() * 26)); // Deterministic random char
        result.splice(pos, 0, randomChar);
      } else if (errorType === "swap" && pos < result.length - 1) {
        [result[pos], result[pos + 1]] = [result[pos + 1], result[pos]];
      }
    }

    return result.join("");
  };

  useEffect(() => {
    const updatedRecords = users.map((user) => {
      return {
        ...user,
        name: applyErrors(user.name, errorCount),
        address: applyErrors(user.address, errorCount),
        city: applyErrors(user.city, errorCount),
        country: applyErrors(user.country, errorCount),
        phone: applyErrors(user.phone, errorCount),
      };
    });

    setRecords(updatedRecords);
  }, [errorCount, users]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-4">User Registry</h1>
      <Control
        seed={seed}
        setSeed={setSeed}
        region={region}
        setRegion={setRegion}
        errorCount={errorCount}
        setErrorCount={setErrorCount}
      />
      <DataTable records={records} />

      {/* Load More Button */}
      <button
        onClick={() => {
          loadMoreRecords();
        }}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Load More
      </button>
    </div>
  );
};

export default App;
