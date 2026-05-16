import { ChevronRight } from "lucide-react";
import {
  formatOutcome,
  formatTarget,
  type ComputedCardResult,
  type Outcome,
} from "@/entities/dice";
import { cn } from "@/shared/lib/classnames";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

const STEP_LABELS: Record<ComputedCardResult["kind"], string> = {
  toHit: "To Hit",
  toWound: "To Wound",
  armourSave: "Armour Save",
  wardSave: "Ward Save",
};

export function SummaryPanel({
  results,
  outcome,
  className,
}: {
  results: {
    toHit: ComputedCardResult;
    toWound: ComputedCardResult;
    armourSave: ComputedCardResult;
    wardSave: ComputedCardResult;
  };
  outcome: Outcome;
  className?: string;
}) {
  const ordered = [
    results.toHit,
    results.toWound,
    results.armourSave,
    results.wardSave,
  ];
  const formatted = formatOutcome(outcome);

  return (
    <Card
      size="sm"
      className={cn(
        "flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Combat Sequence
        </span>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {ordered.map((result, index) => {
            const isImpossible = result.target === "impossible";
            const isCascade = result.kind === "toHit" && result.cascade != null;
            const targetDisplay = isImpossible
              ? "✕"
              : isCascade
                ? `${result.rawTarget}+`
                : formatTarget(result.target);
            return (
              <div key={result.kind} className="flex items-center gap-2">
                <span className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-heading text-lg font-bold tabular-nums",
                      isImpossible
                        ? "text-muted-foreground"
                        : "text-[color:var(--accent-result)]",
                    )}
                  >
                    {targetDisplay}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {STEP_LABELS[result.kind]}
                  </span>
                </span>
                {index < ordered.length - 1 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground/60"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator orientation="vertical" className="hidden h-12 lg:block" />

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Estimated Outcome
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-heading text-xl font-bold tabular-nums text-[color:var(--accent-result)]">
            {formatted.chance}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatted.expected}
          </span>
        </div>
      </div>
    </Card>
  );
}
