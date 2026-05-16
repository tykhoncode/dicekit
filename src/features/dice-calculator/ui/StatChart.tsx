import { cn } from "@/shared/lib/classnames";

const STAT_VALUES: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function StatChart({
  rowLabel,
  colLabel,
  lookup,
  highlight,
  className,
}: {
  rowLabel: string;
  colLabel: string;
  lookup: (row: number, col: number) => string;
  highlight: { row: number; col: number };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        {colLabel}
      </div>
      <div className="flex items-stretch gap-1.5">
        <div className="flex items-center [writing-mode:vertical-rl] [transform:rotate(180deg)] text-[11px] uppercase tracking-widest text-muted-foreground">
          {rowLabel}
        </div>
        <table className="w-full border-separate border-spacing-0 text-xs tabular-nums">
          <thead>
            <tr>
              <th scope="col" className="w-6"></th>
              {STAT_VALUES.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "w-7 px-1 py-0.5 text-center font-medium text-muted-foreground",
                    c === highlight.col && "text-rose-300",
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAT_VALUES.map((r) => (
              <tr key={r}>
                <th
                  scope="row"
                  className={cn(
                    "px-1 py-0.5 text-right font-medium text-muted-foreground",
                    r === highlight.row && "text-emerald-300",
                  )}
                >
                  {r}
                </th>
                {STAT_VALUES.map((c) => {
                  const value = lookup(r, c);
                  const isRow = r === highlight.row;
                  const isCol = c === highlight.col;
                  const isCell = isRow && isCol;
                  return (
                    <td
                      key={c}
                      aria-label={`${rowLabel} ${r} vs ${colLabel} ${c}: ${value}`}
                      className={cn(
                        "px-1 py-0.5 text-center",
                        isRow && "bg-emerald-500/10",
                        isCol && "bg-rose-500/10",
                        isCell &&
                          "bg-[color:var(--accent-result)]/15 font-semibold text-[color:var(--accent-result)] ring-1 ring-[color:var(--accent-result)]/50",
                      )}
                    >
                      {value}
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
