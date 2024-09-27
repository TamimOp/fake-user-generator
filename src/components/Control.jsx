export default function Control({
  region,
  setRegion,
  errorCount,
  setErrorCount,
  seed,
  setSeed,
}) {
  return (
    <div className="flex items-center space-x-4 mb-4 justify-center">
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

      <label className="block">
        <span className="text-lg">Seed:</span>
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="ml-2 p-2 border rounded w-20"
        />
        <button
          onClick={() => {
            const newSeed = Math.random().toString().slice(2, 8);
            setSeed(newSeed);
            setSeed(newSeed);
          }}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          🔄
        </button>
      </label>
    </div>
  );
}
