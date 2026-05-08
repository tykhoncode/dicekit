import { Dices, RotateCcw, Settings, Share2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function TopBar({ onResetAll }: { onResetAll?: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-3xl bg-foreground/10 text-foreground/80">
          <Dices className="size-5" />
        </span>
        <div className="flex flex-col">
          <span className="font-heading text-xl font-bold leading-none tracking-tight">
            DiceKit
          </span>
          <span className="text-xs text-muted-foreground">
            WHFB 8th Edition Dice Calculator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select defaultValue="none">
          <SelectTrigger className="w-40 tabular-nums" aria-label="Load Preset">
            <SelectValue placeholder="Load Preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" disabled>
              (no presets yet)
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" type="button">
          <Share2 />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onResetAll}
          aria-label="Reset All"
        >
          <RotateCcw />
          Reset All
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          aria-label="Settings"
        >
          <Settings />
        </Button>
      </div>
    </header>
  );
}
