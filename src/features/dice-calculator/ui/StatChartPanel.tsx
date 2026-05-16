import { useState } from "react";
import { Info } from "lucide-react";
import type { DisplayedTarget } from "@/entities/dice/model/types";
import { formatTarget } from "@/entities/dice/lib/format";
import { cn } from "@/shared/lib/classnames";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { StatChart } from "./StatChart";

type ToggleMode = "unmodified" | "modified";

const TOGGLE_OPTIONS: ReadonlyArray<{ mode: ToggleMode; label: string }> = [
  { mode: "unmodified", label: "Unmodified" },
  { mode: "modified", label: "Modified" },
];

const TOGGLE_TOOLTIP =
  "Unmodified shows the base stat lookup. Modified shows the lookup after stat-buffing modifiers (e.g. Wyssan's, Lance, Hand of Glory). Direct ±to-hit / ±to-wound modifiers aren't chart-driven and aren't reflected here — the result panel on the card already shows the post-modifier outcome.";

function formatModSum(sum: number): string {
  if (sum === 0) return "0";
  return sum > 0 ? `+${sum}` : `−${Math.abs(sum)}`;
}

export function StatChartPanel({
  rowLabel,
  colLabel,
  lookup,
  baseRow,
  baseCol,
  effectiveRow,
  effectiveCol,
  directModSum,
  finalTarget,
  className,
}: {
  rowLabel: string;
  colLabel: string;
  lookup: (row: number, col: number) => string;
  baseRow: number;
  baseCol: number;
  effectiveRow: number;
  effectiveCol: number;
  directModSum?: number;
  finalTarget?: DisplayedTarget;
  className?: string;
}) {
  const [mode, setMode] = useState<ToggleMode>("unmodified");

  const highlight =
    mode === "modified"
      ? { row: effectiveRow, col: effectiveCol }
      : { row: baseRow, col: baseCol };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Separator />
      <div className="flex items-center justify-between gap-2 px-1">
        <div
          role="tablist"
          aria-label="Chart highlight source"
          className="inline-flex items-center gap-0.5 rounded-xl bg-foreground/5 p-0.5 ring-1 ring-foreground/5"
        >
          {TOGGLE_OPTIONS.map((opt) => {
            const active = opt.mode === mode;
            return (
              <button
                key={opt.mode}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setMode(opt.mode)}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[11px] font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring/40",
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="About this toggle"
              className="rounded-full p-1 text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[260px]">
              {TOGGLE_TOOLTIP}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <StatChart
        rowLabel={rowLabel}
        colLabel={colLabel}
        lookup={lookup}
        highlight={highlight}
        className="px-1"
      />
      {mode === "modified" &&
        directModSum !== undefined &&
        finalTarget !== undefined && (
          <table className="self-center w-auto border-separate border-spacing-0 text-xs tabular-nums">
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="px-2 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Mods
                </th>
                <td
                  aria-label={`Direct modifier sum: ${formatModSum(directModSum)}`}
                  className={cn(
                    "min-w-10 px-2 py-0.5 text-center font-medium",
                    directModSum === 0 && "text-muted-foreground",
                    directModSum < 0 && "text-rose-300",
                    directModSum > 0 && "text-emerald-300",
                  )}
                >
                  {formatModSum(directModSum)}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-2 py-0.5 text-right text-[11px] font-medium uppercase tracking-widest text-muted-foreground"
                >
                  After
                </th>
                <td
                  aria-label={`Final required roll: ${formatTarget(finalTarget)}`}
                  className={cn(
                    "min-w-10 px-2 py-0.5 text-center font-semibold",
                    typeof finalTarget === "number"
                      ? "text-[color:var(--accent-result)]"
                      : "text-muted-foreground",
                  )}
                >
                  {formatTarget(finalTarget)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
    </div>
  );
}
