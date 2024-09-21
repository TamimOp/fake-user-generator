import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./App.css";
import "./index.css";

function App() {
  const [region, setRegion] = useState("en"); // Use 'en' for English or other codes like 'pl' for Poland
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState(Math.random().toString());
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRecords = async () => {
    setLoading(true);
    try {
      // Use GET request for fetching data with query parameters
      const response = await axios.get("http://localhost:5000/api/users", {
        params: {
          region: region, // Send region as query parameter (e.g., 'en' for USA)
          count: 10, // Number of records to fetch per page
          errors: errorCount,
          seed: seed, // Use seed for consistent results
          page: page, // Pagination for loading more records
        },
      });

      setRecords((prevRecords) => [...prevRecords, ...response.data]);
      setPage((prevPage) => prevPage + 1); // Increment page count for the next load
    } catch (error) {
      console.error("Error loading more records:", error);
      alert(
        `Error: ${error.response ? error.response.data.message : error.message}`
      );
    }
    setLoading(false);
  };

  // Load initial records on first render
  useEffect(() => {
    loadMoreRecords();
  }, []);

  return (
    <div className="App container mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-4">User Registry</h1>

      <div className="flex items-center space-x-4 mb-4 justify-center gap-11">
        <label className="block">
          <span className="text-lg">Region:</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="USA">USA</option>
            <option value="Poland">Poland</option>
            <option value="Georgia">Georgia</option>
          </select>
        </label>

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
          <span className="ml-2 text-lg">{errorCount}</span>
        </label>

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

        <button
          onClick={() => console.log("Export data")}
          className="p-2 bg-green-500 text-white rounded"
        >
          Export
        </button>
      </div>

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
      <button
        onClick={loadMoreRecords}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Load More
      </button>
    </div>
  );
}

export default App;
