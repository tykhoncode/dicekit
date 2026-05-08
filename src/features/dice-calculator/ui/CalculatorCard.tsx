import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/shared/lib/classnames";
import { Card } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function CalculatorCard({
  icon,
  title,
  subtitle,
  infoText,
  inputs,
  modifiers,
  result,
  className,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  infoText: string;
  inputs: ReactNode;
  modifiers: ReactNode;
  result: ReactNode;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "flex h-full flex-col gap-3 [box-shadow:inset_0_0_40px_var(--card-glow)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-foreground/10 text-foreground/80 [&_svg]:size-4">
            {icon}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="font-heading text-sm font-semibold tracking-tight">
              {title}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label={`${title} — about`}
              className="rounded-full p-1 text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <Info className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top">{infoText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-wrap gap-3 px-4">{inputs}</div>
      <Separator />
      <div className="flex flex-1 flex-col gap-1 px-3">{modifiers}</div>
      <div className="px-3 pb-1">{result}</div>
    </Card>
  );
}
