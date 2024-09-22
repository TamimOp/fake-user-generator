import React, { useState, useEffect } from "react";

const App = () => {
  const [region, setRegion] = useState("en");
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState(Math.random().toString().slice(2, 8));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMoreRecords = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:5000/api/users?region=${region}&count=10&errors=${errorCount}&seed=${seed}&page=${page}`
    );
    const data = await response.json();
    setRecords((prevRecords) => [...prevRecords, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    setPage(1); // Reset page when parameters change
    setRecords([]); // Clear existing records
    loadMoreRecords();
  }, [region, errorCount, seed]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-4">User Registry</h1>

      <div className="flex items-center space-x-4 mb-4 justify-center">
        {/* Region Selector */}
        <label className="block">
          <span className="text-lg">Region:</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="en">USA</option>
            <option value="pl">Poland</option>
            <option value="ge">Georgia</option>
          </select>
        </label>

        {/* Error Slider and Input */}
        <label className="block">
          <span className="text-lg">Errors:</span>
          <input
            type="range"
            min="0"
            max="10"
            value={errorCount}
            onChange={(e) => setErrorCount(e.target.value)}
            className="ml-2"
          />
          <input
            type="number"
            min="0"
            max="1000"
            value={errorCount}
            onChange={(e) => setErrorCount(Math.min(e.target.value, 1000))}
            className="ml-2 p-2 border rounded w-16"
          />
        </label>

        {/* Seed Input and Button */}
        <label className="block">
          <span className="text-lg">Seed:</span>
          <input
            type="text"
            value={seed}
            readOnly
            className="ml-2 p-2 border rounded w-20"
          />
          <button
            onClick={() => setSeed(Math.random().toString().slice(2, 8))}
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            🔄
          </button>
        </label>

        {/* Export Button */}
        <button className="p-2 bg-green-500 text-white rounded">Export</button>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{record.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {record.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {record.address}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {record.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p className="mt-4">Loading more records...</p>}

      {/* Load More Button */}
      <button
        onClick={() => {
          setPage((prevPage) => prevPage + 1);
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
