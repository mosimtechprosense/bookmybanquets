export default function DataTable({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-cyan-800 text-white">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left px-4 py-3 font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-center">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data?.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No records found
              </td>
            </tr>
          )}

          {data?.map((row, idx) => (
            <tr
              key={row.id}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-4 py-2 whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key] ?? ""}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
