function TableCard({ title, columns, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
      <div className="border-b border-slate-200/70 px-6 py-5">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/90">
            {rows.map((row, index) => (
              <tr
                key={`${row[0]}-${index}`}
                className="border-t border-slate-200/60 text-sm text-slate-600"
              >
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="px-6 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableCard
