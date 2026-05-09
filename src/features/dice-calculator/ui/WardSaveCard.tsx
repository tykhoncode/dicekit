import { Sparkles } from "lucide-react";
import {
  MODIFIER_CONFIGS,
  type CardState,
  type ComputedCardResult,
  type ModifierId,
  type SaveBaseTarget,
} from "@/entities/dice";
import { modifierSortKey } from "@/entities/dice/model/modifiers";
import { ModifierToggleRow } from "@/shared/ui/modifier-toggle-row";
import { ResultBadge } from "@/shared/ui/result-badge";
import { SaveSelect } from "@/shared/ui/save-select";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

const WARD_MODIFIERS = [
  ...MODIFIER_CONFIGS.filter((m) => m.card === "wardSave"),
].sort((a, b) => {
  const aAuto = a.effect.kind === "auto-result";
  const bAuto = b.effect.kind === "auto-result";
  if (aAuto !== bAuto) return aAuto ? -1 : 1;
  return (
    modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label)
  );
});

export function WardSaveCard({
  state,
  result,
  onSetSaveTarget,
  onToggleModifier,
}: {
  state: CardState;
  result: ComputedCardResult;
  onSetSaveTarget: (value: SaveBaseTarget) => void;
  onToggleModifier: (id: ModifierId) => void;
}) {
  const baseTarget: SaveBaseTarget = state.inputs.baseTarget ?? "none";
  const activeMap = new Map(state.modifiers.map((m) => [m.id, m.active]));

  return (
    <CalculatorCard
      icon={<Sparkles />}
      title="Ward Save"
      subtitle="WSv"
      infoText="Ward saves are never modified by the attack's Strength. Parry Ward (6++) sets a 6+ floor on the displayed ward target."
      inputs={
        <SaveSelect
          label="Base Ward Save"
          value={baseTarget}
          onChange={onSetSaveTarget}
        />
      }
      modifiers={WARD_MODIFIERS.map((config) => (
        <ModifierToggleRow
          key={config.id}
          label={config.label}
          effectLabel={effectLabel(config.effect)}
          active={activeMap.get(config.id) ?? false}
          onToggle={() => onToggleModifier(config.id)}
        />
      ))}
      steps={result.steps}
      result={
        <ResultBadge
          target={result.target}
          probability={result.probability}
          kind="wardSave"
        />
      }
    />
  );
}
