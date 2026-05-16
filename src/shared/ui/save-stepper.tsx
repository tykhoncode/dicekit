import { Minus, Plus } from "lucide-react";
import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { cn } from "@/shared/lib/classnames";
import { Button } from "./button";

const ORDER: ReadonlyArray<SaveBaseTarget> = [1, 2, 3, 4, 5, 6, "none"];
const NONE_GLYPH = "—";

function format(value: SaveBaseTarget): string {
  return value === "none" ? NONE_GLYPH : `${value}+`;
}

export function SaveStepper({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: SaveBaseTarget;
  onChange: (next: SaveBaseTarget) => void;
  className?: string;
}) {
  const idx = ORDER.indexOf(value);
  const safeIdx = idx === -1 ? ORDER.length - 1 : idx;

  const canImprove = safeIdx > 0;
  const canWorsen = safeIdx < ORDER.length - 1;

  const improve = () => {
    if (!canImprove) return;
    const next = ORDER[safeIdx - 1];
    if (next !== undefined) onChange(next);
  };
  const worsen = () => {
    if (!canWorsen) return;
    const next = ORDER[safeIdx + 1];
    if (next !== undefined) onChange(next);
  };

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <span className="text-lg font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Worsen ${label}`}
          disabled={!canWorsen}
          onClick={worsen}
        >
          <Minus />
        </Button>
        <span
          aria-live="polite"
          aria-label={`${label}: ${format(value)}`}
          className="min-w-8 text-center text-lg font-semibold tabular-nums"
        >
          {format(value)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Improve ${label}`}
          disabled={!canImprove}
          onClick={improve}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
