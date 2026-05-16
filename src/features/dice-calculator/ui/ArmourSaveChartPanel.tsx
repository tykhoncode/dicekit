import { useState } from "react";
import { Info } from "lucide-react";
import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { cn } from "@/shared/lib/classnames";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { ArmourSaveChart } from "./ArmourSaveChart";

type ToggleMode = "unmodified" | "modified";

const TOGGLE_OPTIONS: ReadonlyArray<{ mode: ToggleMode; label: string }> = [
  { mode: "unmodified", label: "Unmodified" },
  { mode: "modified", label: "Modified" },
];

const TOGGLE_TOOLTIP =
  "Unmodified highlights the chart column for your base Strength. Modified highlights the column for effective Strength (after stat-buffing modifiers like Wyssan's, Lance, etc.). Direct ±armour-save modifiers (Armour Piercing, Shield, Cover) aren't chart-driven and aren't reflected here — the result panel above already shows the post-modifier outcome.";

export function ArmourSaveChartPanel({
  baseAS,
  baseS,
  effectiveS,
  asModSum,
  className,
}: {
  baseAS: SaveBaseTarget;
  baseS: number;
  effectiveS: number;
  asModSum?: number;
  className?: string;
}) {
  const [mode, setMode] = useState<ToggleMode>("unmodified");
  const highlightS = mode === "modified" ? effectiveS : baseS;
  const chartAsModSum = mode === "modified" ? asModSum : undefined;

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
      <ArmourSaveChart
        baseAS={baseAS}
        highlightS={highlightS}
        asModSum={chartAsModSum}
        className="px-1"
      />
    </div>
  );
}
