"use client";

export default function CrossAnalyticsChart({ title, rows, columns }) {
  if (!rows || rows.length === 0) return null;

  const allValues = rows.flatMap((row) => columns.map((col) => row[col.key] || 0));
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 space-y-4">
      <h3 className="font-semibold text-card-foreground">{title}</h3>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium text-xs uppercase tracking-wide"></th>
              {columns.map((col) => (
                <th key={col.key} className="text-left py-2 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-card-foreground capitalize whitespace-nowrap">
                  {row.focus || row.framework || row.age || ""}
                </td>
                {columns.map((col) => {
                  const val = row[col.key] || 0;
                  const width = maxVal > 0 ? (val / maxVal) * 100 : 0;
                  return (
                    <td key={col.key} className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-muted flex-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-accent/70 transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground min-w-[2ch] text-right">
                          {val}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
