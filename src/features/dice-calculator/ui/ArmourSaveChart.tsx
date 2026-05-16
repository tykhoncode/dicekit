import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { cn } from "@/shared/lib/classnames";

const NONE_GLYPH = "—";
const MINUS = "−";

const COLUMNS: ReadonlyArray<{ label: string; s: number }> = [
  { label: "S3-", s: 3 },
  { label: "S4", s: 4 },
  { label: "S5", s: 5 },
  { label: "S6", s: 6 },
  { label: "S7", s: 7 },
  { label: "S8", s: 8 },
  { label: "S9", s: 9 },
  { label: "S10", s: 10 },
];

function penaltyFor(s: number): number {
  return -Math.max(0, s - 3);
}

function formatPenalty(p: number): string {
  return p === 0 ? "0" : `${MINUS}${Math.abs(p)}`;
}

function baseAsDisplay(baseAS: SaveBaseTarget): string {
  return typeof baseAS === "number" ? `${baseAS}+` : NONE_GLYPH;
}

function effectiveAsDisplay(baseAS: SaveBaseTarget, s: number): string {
  if (typeof baseAS !== "number") return NONE_GLYPH;
  const target = baseAS - penaltyFor(s);
  if (target > 6) return NONE_GLYPH;
  if (target <= 1) return "1+";
  return `${target}+`;
}

function afterAsDisplay(
  baseAS: SaveBaseTarget,
  s: number,
  asModSum: number,
): string {
  if (typeof baseAS !== "number") return NONE_GLYPH;
  const target = baseAS - penaltyFor(s) - asModSum;
  if (target > 6) return NONE_GLYPH;
  if (target <= 1) return "1+";
  return `${target}+`;
}

function formatModSum(sum: number): string {
  if (sum === 0) return "0";
  return sum > 0 ? `+${sum}` : `${MINUS}${Math.abs(sum)}`;
}

function highlightColumn(highlightS: number): number {
  const bucketed = Math.max(3, Math.min(10, Math.round(highlightS)));
  return bucketed === 3 ? 0 : bucketed - 3;
}

export function ArmourSaveChart({
  baseAS,
  highlightS,
  asModSum,
  className,
}: {
  baseAS: SaveBaseTarget;
  highlightS: number;
  asModSum?: number;
  className?: string;
}) {
  const baseDisplay = baseAsDisplay(baseAS);
  const highlightIdx = highlightColumn(highlightS);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <table className="w-full border-separate border-spacing-0 text-xs tabular-nums">
        <thead>
          <tr>
            <th scope="col" className="w-14"></th>
            {COLUMNS.map((c, i) => (
              <th
                key={c.label}
                scope="col"
                className={cn(
                  "w-9 px-1 py-0.5 text-center font-medium text-muted-foreground",
                  i === highlightIdx && "text-emerald-300",
                )}
              >
                {c.label}
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
              Penalty
            </th>
            {COLUMNS.map((c, i) => {
              const p = penaltyFor(c.s);
              return (
                <td
                  key={c.label}
                  aria-label={`Strength penalty at ${c.label}: ${formatPenalty(p)}`}
                  className={cn(
                    "px-1 py-0.5 text-center text-muted-foreground",
                    i === highlightIdx && "bg-emerald-500/10 text-foreground",
                  )}
                >
                  {formatPenalty(p)}
                </td>
              );
            })}
          </tr>
          <tr>
            <th
              scope="row"
              className="px-1 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
            >
              Armour
            </th>
            {COLUMNS.map((c, i) => {
              const value = effectiveAsDisplay(baseAS, c.s);
              const isHighlight = i === highlightIdx;
              return (
                <td
                  key={c.label}
                  aria-label={`Base ${baseDisplay} at ${c.label}: ${value}`}
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
          {asModSum !== undefined && (
            <>
              <tr>
                <th
                  scope="row"
                  className="px-1 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Mods
                </th>
                {COLUMNS.map((c, i) => {
                  const isHighlight = i === highlightIdx;
                  return (
                    <td
                      key={c.label}
                      aria-label={`Modifier sum at ${c.label}: ${formatModSum(asModSum)}`}
                      className={cn(
                        "px-1 py-0.5 text-center font-medium",
                        asModSum === 0 && "text-muted-foreground",
                        asModSum < 0 && "text-rose-300",
                        asModSum > 0 && "text-emerald-300",
                        isHighlight && "bg-emerald-500/10 text-foreground",
                      )}
                    >
                      {formatModSum(asModSum)}
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
                {COLUMNS.map((c, i) => {
                  const value = afterAsDisplay(baseAS, c.s, asModSum);
                  const isHighlight = i === highlightIdx;
                  return (
                    <td
                      key={c.label}
                      aria-label={`After mods at ${c.label}: ${value}`}
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
