import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/classnames";

export function ModifierGroup({
  title,
  defaultOpen = false,
  badge,
  level = 0,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badge?: ReactNode;
  /** Indentation depth (0 = top level, 1 = nested race, 2 = nested artifacts). */
  level?: 0 | 1 | 2;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const titleSize =
    level === 0 ? "text-sm font-semibold" : "text-xs font-medium";
  const padX = level === 0 ? "px-2.5" : level === 1 ? "px-3.5" : "px-4.5";
  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-xl py-1 text-left text-foreground/85 transition-colors hover:bg-muted/40",
          padX,
        )}
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        <span
          className={cn("flex-1 truncate uppercase tracking-wide", titleSize)}
        >
          {title}
        </span>
        {badge}
      </button>
      {open && (
        <div className={cn("flex flex-col gap-1 py-1", level > 0 && "pl-3")}>
          {children}
        </div>
      )}
    </div>
  );
}
