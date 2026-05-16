import { Table } from "lucide-react";
import { cn } from "@/shared/lib/classnames";

export function StatChartToggleButton({
  pressed,
  onPressedChange,
  label = "Show table",
  className,
}: {
  pressed: boolean;
  onPressedChange: (next: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring/40",
        pressed
          ? "bg-foreground/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
        className,
      )}
    >
      <Table className="size-4" />
      {label}
    </button>
  );
}
