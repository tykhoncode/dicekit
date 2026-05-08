import type { DiceTarget } from "@/entities/dice/model/types";
import { cn } from "@/shared/lib/classnames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const TARGETS: readonly DiceTarget[] = [1, 2, 3, 4, 5, 6];

export function SaveSelect({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: DiceTarget;
  onChange: (next: DiceTarget) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-lg font-medium text-foreground">{label}</span>
      <Select
        value={String(value)}
        onValueChange={(next) => onChange(Number(next) as DiceTarget)}
      >
        <SelectTrigger className="w-24 tabular-nums" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TARGETS.map((t) => (
            <SelectItem key={t} value={String(t)}>
              {t}+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
