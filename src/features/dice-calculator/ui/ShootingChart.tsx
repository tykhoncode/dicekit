import { cn } from "@/shared/lib/classnames";

const MINUS = "−";
const IMPOSSIBLE_GLYPH = "✕";
const CASCADE_ARROW = "→";

const COLUMNS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function toHitScore(bs: number): number {
  return 7 - bs;
}

function formatScore(n: number): string {
  if (n < 0) return `${MINUS}${Math.abs(n)}`;
  return `${n}`;
}

function formatModSum(sum: number): string {
  if (sum === 0) return "0";
  return sum > 0 ? `+${sum}` : `${MINUS}${Math.abs(sum)}`;
}

function formatAfter(raw: number): string {
  const rounded = Math.round(raw);
  if (rounded <= 1) return "1+";
  if (rounded <= 6) return `${rounded}+`;
  if (rounded <= 9) {
    const followUp = rounded - 3;
    return `6${CASCADE_ARROW}${followUp}`;
  }
  return IMPOSSIBLE_GLYPH;
}

function highlightIndex(highlightBS: number): number {
  const bucketed = Math.max(1, Math.min(10, Math.round(highlightBS)));
  return bucketed - 1;
}

export function ShootingChart({
  highlightBS,
  directModSum,
  className,
}: {
  baseBS: number;
  highlightBS: number;
  directModSum?: number;
  className?: string;
}) {
  const highlightIdx = highlightIndex(highlightBS);
  const showModified = directModSum !== undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <table className="w-full border-separate border-spacing-0 text-xs tabular-nums">
        <thead>
          <tr>
            <th scope="col" className="w-14"></th>
            {COLUMNS.map((bs, i) => (
              <th
                key={bs}
                scope="col"
                className={cn(
                  "w-9 px-1 py-0.5 text-center font-medium text-muted-foreground",
                  i === highlightIdx && "text-emerald-300",
                )}
              >
                BS {bs}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              className="px-1 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              To Hit
            </th>
            {COLUMNS.map((bs, i) => {
              const score = toHitScore(bs);
              const value = formatScore(score);
              const isHighlight = i === highlightIdx;
              return (
                <td
                  key={bs}
                  aria-label={`To Hit score at BS ${bs}: ${value}`}
                  className={cn(
                    "px-1 py-0.5 text-center",
                    isHighlight &&
                      !showModified &&
                      "bg-[color:var(--accent-result)]/15 font-semibold text-[color:var(--accent-result)] ring-1 ring-[color:var(--accent-result)]/50",
                    !(isHighlight && !showModified) && "text-foreground/80",
                    isHighlight && showModified && "bg-emerald-500/10",
                  )}
                >
                  {value}
                </td>
              );
            })}
          </tr>
          {showModified && directModSum !== undefined && (
            <>
              <tr>
                <th
                  scope="row"
                  className="px-1 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Mods
                </th>
                {COLUMNS.map((bs, i) => {
                  const isHighlight = i === highlightIdx;
                  return (
                    <td
                      key={bs}
                      aria-label={`Modifier sum at BS ${bs}: ${formatModSum(directModSum)}`}
                      className={cn(
                        "px-1 py-0.5 text-center font-medium",
                        directModSum === 0 && "text-muted-foreground",
                        directModSum < 0 && "text-rose-300",
                        directModSum > 0 && "text-emerald-300",
                        isHighlight && "bg-emerald-500/10 text-foreground",
                      )}
                    >
                      {formatModSum(directModSum)}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-1 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
                >
                  After
                </th>
                {COLUMNS.map((bs, i) => {
                  const raw = toHitScore(bs) - directModSum;
                  const value = formatAfter(raw);
                  const isHighlight = i === highlightIdx;
                  return (
                    <td
                      key={bs}
                      aria-label={`After mods at BS ${bs}: ${value}`}
                      className={cn(
                        "px-1 py-0.5 text-center",
                        isHighlight &&
                          "bg-[color:var(--accent-result)]/15 font-semibold text-[color:var(--accent-result)] ring-1 ring-[color:var(--accent-result)]/50",
                        !isHighlight && "text-foreground/80",
                      )}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
