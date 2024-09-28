import { useEffect, useState, useRef } from "react";
import Control from "./components/Control";
import DataTable from "./components/DataTable";
import useGenerateUserData from "./hooks/useGenerateUserData";

const App = () => {
  const [region, setRegion] = useState("en");
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState(Math.random().toString().slice(2, 8));
  const { users, loadMoreUsers, reGenerateUsers } = useGenerateUserData(
    region,
    seed
  );
  const [records, setRecords] = useState(users);
  const loadMoreRef = useRef(null);

  const loadMoreRecords = async () => {
    loadMoreUsers(region, 10);
  };

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

  const applyErrors = (text, errorCount) => {
    const types = ["delete", "add", "swap"];
    let result = text.split("");

    const random = seededRandom(seed);

    for (let i = 0; i < errorCount; i++) {
      const errorType = types[Math.floor(random() * types.length)];
      const pos = Math.floor(random() * result.length);

      if (errorType === "delete" && result.length > 1) {
        result.splice(pos, 1);
      } else if (errorType === "add") {
        const randomChar = String.fromCharCode(97 + Math.floor(random() * 26));
        result.splice(pos, 0, randomChar);
      } else if (errorType === "swap" && pos < result.length - 1) {
        [result[pos], result[pos + 1]] = [result[pos + 1], result[pos]];
      }
    }

    return result.join("");
  };

  useEffect(() => {
    const newRecords = reGenerateUsers(region, seed);
    setRecords(newRecords);
  }, [region, seed]);

  useEffect(() => {
    const updatedRecords = users.map((user) => {
      return {
        ...user,
        name: applyErrors(user.name, errorCount),
        address: applyErrors(user.address, errorCount),
        country: applyErrors(user.country, errorCount),
        phone: applyErrors(user.phone, errorCount),
      };
    });

    setRecords(updatedRecords);
  }, [errorCount, users]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRecords();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [users]);

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

      <div ref={loadMoreRef} className="h-10"></div>
    </div>
  );
};

export default App;
