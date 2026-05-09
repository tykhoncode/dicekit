import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { cn } from "@/shared/lib/classnames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const NONE_GLYPH = "—";
const OPTIONS: ReadonlyArray<{ value: SaveBaseTarget; label: string }> = [
  { value: 1, label: "1+" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
  { value: 6, label: "6+" },
  { value: "none", label: NONE_GLYPH },
];

function toKey(v: SaveBaseTarget): string {
  return typeof v === "number" ? String(v) : v;
}

function fromKey(key: string): SaveBaseTarget {
  return key === "none" ? "none" : (Number(key) as SaveBaseTarget);
}

export function SaveSelect({
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
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-lg font-medium text-foreground">{label}</span>
      <Select value={toKey(value)} onValueChange={(k) => onChange(fromKey(k))}>
        <SelectTrigger className="w-24 tabular-nums" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((opt) => (
            <SelectItem key={toKey(opt.value)} value={toKey(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
