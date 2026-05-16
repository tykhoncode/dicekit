import type { KeyboardEvent, ReactNode } from "react";
import { BowArrow, Swords } from "lucide-react";
import type { AttackMode } from "@/entities/dice";
import { cn } from "@/shared/lib/classnames";

type Option = {
  mode: AttackMode;
  name: string;
  scale: string;
  icon: ReactNode;
};

const OPTIONS: readonly Option[] = [
  {
    mode: "melee",
    name: "Melee",
    scale: "WS vs WS",
    icon: <Swords className="size-3.5" />,
  },
  {
    mode: "shooting",
    name: "Shooting",
    scale: "BS",
    icon: <BowArrow className="size-3.5" />,
  },
];

export function AttackModeTabs({
  value,
  onChange,
  className,
}: {
  value: AttackMode;
  onChange: (mode: AttackMode) => void;
  className?: string;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = OPTIONS.findIndex((o) => o.mode === value);
    if (i < 0) return;
    const next =
      OPTIONS[
        e.key === "ArrowRight"
          ? (i + 1) % OPTIONS.length
          : (i - 1 + OPTIONS.length) % OPTIONS.length
      ];
    if (next) onChange(next.mode);
  };

  return (
    <div
      role="tablist"
      aria-label="Attack mode"
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl bg-foreground/5 p-1.5 ring-1 ring-foreground/5",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = opt.mode === value;
        return (
          <button
            key={opt.mode}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.mode)}
            className={cn(
              "flex flex-col items-start rounded-xl px-3 py-1 text-left outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring/40",
              active
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "[&_svg]:size-3.5",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
                aria-hidden
              >
                {opt.icon}
              </span>
              <span className="font-heading text-sm font-semibold tracking-tight">
                {opt.name}
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              {opt.scale}
            </span>
          </button>
        );
      })}
    </div>
  );
}
