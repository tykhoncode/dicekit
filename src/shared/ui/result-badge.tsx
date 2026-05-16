import type {
  CardKind,
  DiceTarget,
  DisplayedTarget,
  ProbabilityFraction,
} from "@/entities/dice/model/types";
import { formatProbability, formatTarget } from "@/entities/dice/lib/format";
import { cn } from "@/shared/lib/classnames";

export function ResultBadge({
  target,
  cascade,
  probability,
  kind,
  className,
}: {
  target: DisplayedTarget;
  cascade?: { first: 6; followUp: DiceTarget };
  probability: ProbabilityFraction;
  kind: CardKind;
  className?: string;
}) {
  const probabilityText = formatProbability(probability, kind, target);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-3xl bg-foreground/5 py-4 ring-1 ring-foreground/5",
        className,
      )}
    >
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Required Roll
      </span>
      {cascade ? (
        <span className="flex items-center gap-1.5">
          <span className="font-heading text-5xl font-bold tabular-nums text-[color:var(--accent-result)]">
            {formatTarget(cascade.first)}
          </span>
          <span className="text-2xl text-muted-foreground">→</span>
          <span className="font-heading text-5xl font-bold tabular-nums text-[color:var(--accent-result)]">
            {formatTarget(cascade.followUp)}
          </span>
        </span>
      ) : (
        <span
          className={cn(
            "font-heading text-5xl font-bold tabular-nums",
            target === "impossible" ||
              target === "no-save" ||
              target === "no-ward"
              ? "text-muted-foreground"
              : "text-[color:var(--accent-result)]",
          )}
        >
          {formatTarget(target)}
        </span>
      )}
      <span className="text-xs text-muted-foreground">{probabilityText}</span>
    </div>
  );
}
