import { Minus, Plus } from "lucide-react";
import { cn } from "@/shared/lib/classnames";
import { Button } from "./button";

export function NumberStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  className,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-lg font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={decrement}
        >
          <Minus />
        </Button>
        <span
          aria-live="polite"
          aria-label={`${label}: ${value}`}
          className="min-w-8 text-center text-lg font-semibold tabular-nums"
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={increment}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
