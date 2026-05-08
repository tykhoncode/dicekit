import { cn } from "@/shared/lib/classnames";
import { Badge } from "./badge";
import { Switch } from "./switch";

export function ModifierToggleRow({
  label,
  effectLabel,
  active,
  onToggle,
  className,
}: {
  label: string;
  effectLabel: string;
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2.5 py-1.5 ring-1 ring-transparent transition-colors hover:bg-muted/40",
        active &&
          "bg-[color:var(--accent-active)]/10 ring-[color:var(--accent-active)]/30",
        className,
      )}
    >
      <span className="flex items-center gap-2.5 text-sm">
        <Switch
          checked={active}
          onCheckedChange={() => onToggle()}
          aria-label={`${label}, ${effectLabel}`}
          className={cn(
            active && "data-[state=checked]:bg-[color:var(--accent-active)]",
          )}
        />
        <span
          className={cn(
            "select-none font-medium",
            active ? "text-foreground" : "text-foreground/80",
          )}
        >
          {label}
        </span>
      </span>
      <Badge
        variant={active ? "default" : "outline"}
        className={cn(
          "text-sm tabular-nums",
          active &&
            "border-transparent bg-[color:var(--accent-active)] text-white",
        )}
      >
        {effectLabel}
      </Badge>
    </label>
  );
}
