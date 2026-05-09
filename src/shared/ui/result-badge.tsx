import type {
  CardKind,
  DisplayedTarget,
  ProbabilityFraction,
} from "@/entities/dice/model/types";
import { formatProbability, formatTarget } from "@/entities/dice/lib/format";
import { cn } from "@/shared/lib/classnames";

export function ResultBadge({
  target,
  probability,
  kind,
  className,
}: {
  target: DisplayedTarget;
  probability: ProbabilityFraction;
  kind: CardKind;
  className?: string;
}) {
  const targetText = formatTarget(target);
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
      <span className="font-heading text-5xl font-bold tabular-nums text-[color:var(--accent-result)]">
        {targetText}
      </span>
      <span className="text-xs text-muted-foreground">{probabilityText}</span>
    </div>
  );
}
