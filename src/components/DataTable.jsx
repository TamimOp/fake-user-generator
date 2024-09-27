export default function DataTable({ records }) {
  return (
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
        {records?.map((record, index) => (
          <tr key={`${record.id}_${index}`} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
            <td className="border border-gray-300 px-4 py-2">{record.id}</td>
            <td className="border border-gray-300 px-4 py-2">{record.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {record.address}
            </td>
            <td className="border border-gray-300 px-4 py-2">{record.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
