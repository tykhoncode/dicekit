import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Info, Minus, Pin, Plus } from "lucide-react";
import { cn } from "@/shared/lib/classnames";
import { Badge } from "./badge";
import { Switch } from "./switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type ModifierTone = "default" | "spell" | "artifact";

const TONE_VAR: Record<ModifierTone, string> = {
  default: "var(--accent-active)",
  spell: "var(--accent-spell)",
  artifact: "var(--accent-artifact)",
};

export type ModifierValueStepper = {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  ariaSuffix?: string;
};

export type ModifierTargetSwitch = {
  value: "attacker" | "defender" | "both";
  onChange: (next: "attacker" | "defender" | "both") => void;
};

const TARGET_OPTIONS: ReadonlyArray<{
  key: "attacker" | "both" | "defender";
  label: string;
}> = [
  { key: "attacker", label: "atk" },
  { key: "both", label: "both" },
  { key: "defender", label: "def" },
];

function TruncatableLabel({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [label]);
  return (
    <span
      ref={ref}
      title={truncated ? label : undefined}
      className="min-w-0 truncate font-medium"
    >
      {label}
    </span>
  );
}

function ValueStepper({
  label,
  stepper,
  active,
}: {
  label: string;
  stepper: ModifierValueStepper;
  active: boolean;
}) {
  const aria = stepper.ariaSuffix ? `${label} ${stepper.ariaSuffix}` : label;
  return (
    <span
      className={cn(
        "flex h-5 items-center rounded-full bg-foreground/10 p-0.5 transition-opacity",
        !active && "opacity-50",
      )}
      onClick={(e) => e.preventDefault()}
    >
      <button
        type="button"
        aria-label={`Decrease ${aria}`}
        disabled={!active || stepper.value <= stepper.min}
        onClick={(e) => {
          e.preventDefault();
          stepper.onChange(stepper.value - 1);
        }}
        className="flex size-4 cursor-pointer items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/15 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Minus className="size-3" />
      </button>
      <span
        className="min-w-3.5 text-center text-[11px] font-semibold tabular-nums"
        aria-live="polite"
      >
        {stepper.value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${aria}`}
        disabled={!active || stepper.value >= stepper.max}
        onClick={(e) => {
          e.preventDefault();
          stepper.onChange(stepper.value + 1);
        }}
        className="flex size-4 cursor-pointer items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/15 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Plus className="size-3" />
      </button>
    </span>
  );
}

function TargetSwitcher({
  label,
  switcher,
  active,
}: {
  label: string;
  switcher: ModifierTargetSwitch;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-5 items-center gap-0.5 rounded-full bg-foreground/10 p-0.5 transition-opacity",
        !active && "opacity-50",
      )}
      onClick={(e) => e.preventDefault()}
    >
      {TARGET_OPTIONS.map((opt) => {
        const selected = switcher.value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            aria-label={`${label}: target ${opt.label}`}
            aria-pressed={selected}
            disabled={!active}
            onClick={(e) => {
              e.preventDefault();
              switcher.onChange(opt.key);
            }}
            className={cn(
              "flex h-4 cursor-pointer items-center justify-center rounded-full px-1 text-[9px] font-medium lowercase transition-colors disabled:cursor-default",
              selected
                ? "bg-foreground/80 text-background"
                : "text-foreground/70 hover:bg-foreground/15",
              !active && "hover:bg-transparent",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </span>
  );
}

export function ModifierToggleRow({
  label,
  effectLabel,
  active,
  onToggle,
  valueStepper,
  valueStepperDef,
  targetSwitch,
  tone = "default",
  tooltip,
  pinned,
  onTogglePinned,
  className,
}: {
  label: string;
  effectLabel: string;
  active: boolean;
  onToggle: () => void;
  valueStepper?: ModifierValueStepper;
  valueStepperDef?: ModifierValueStepper;
  targetSwitch?: ModifierTargetSwitch;
  tone?: ModifierTone;
  tooltip?: string;
  pinned?: boolean;
  /** When provided, a pin button is rendered after the badge.
   *  Click to bump the row above its category. */
  onTogglePinned?: () => void;
  className?: string;
}) {
  const accent = TONE_VAR[tone];
  return (
    <label
      style={{ "--row-accent": accent } as CSSProperties}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2.5 py-1.5 ring-1 ring-transparent transition-colors hover:bg-muted/40",
        active &&
          "bg-[color:var(--row-accent)]/10 ring-[color:var(--row-accent)]/30",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm">
        <Switch
          checked={active}
          onCheckedChange={() => onToggle()}
          aria-label={`${label}, ${effectLabel}`}
          className={cn(
            active && "data-[state=checked]:bg-[color:var(--row-accent)]",
          )}
        />
        {targetSwitch && (
          <TargetSwitcher
            label={label}
            switcher={targetSwitch}
            active={active}
          />
        )}
        <span
          className={cn(
            "flex min-w-0 items-center gap-1 select-none",
            active ? "text-foreground" : "text-foreground/80",
          )}
        >
          <TruncatableLabel label={label} />
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label={`${label} — info`}
                  onClick={(e) => e.preventDefault()}
                  className="rounded-full p-0.5 text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Info className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {valueStepper && (
          <ValueStepper label={label} stepper={valueStepper} active={active} />
        )}
        {valueStepperDef && (
          <ValueStepper
            label={label}
            stepper={valueStepperDef}
            active={active}
          />
        )}
        <Badge
          variant={active ? "default" : "outline"}
          className={cn(
            "tabular-nums",
            active &&
              "border-transparent bg-[color:var(--row-accent)] text-white",
          )}
        >
          {effectLabel}
        </Badge>
        {onTogglePinned && (
          <button
            type="button"
            aria-label={
              pinned ? `Send ${label} back to category` : `Pin ${label} to top`
            }
            aria-pressed={pinned}
            onClick={(e) => {
              e.preventDefault();
              onTogglePinned();
            }}
            className={cn(
              "flex size-5 cursor-pointer items-center justify-center rounded-full transition-colors",
              pinned
                ? "bg-foreground text-background hover:bg-foreground/85"
                : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            <Pin
              className="size-3.5 rotate-45"
              strokeWidth={pinned ? 2.5 : 2}
            />
          </button>
        )}
      </span>
    </label>
  );
}
