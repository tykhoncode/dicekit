import { Shield } from "lucide-react";
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

const ARMOUR_MODIFIERS = [
  ...MODIFIER_CONFIGS.filter((m) => m.card === "armourSave"),
].sort((a, b) => {
  const aAuto = a.effect.kind === "auto-result";
  const bAuto = b.effect.kind === "auto-result";
  if (aAuto !== bAuto) return aAuto ? -1 : 1;
  return (
    modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label)
  );
});

export function ArmourSaveCard({
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
  const baseTarget: SaveBaseTarget = state.inputs.baseTarget ?? 6;
  const activeMap = new Map(state.modifiers.map((m) => [m.id, m.active]));

  return (
    <CalculatorCard
      icon={<Shield />}
      title="Armour Save"
      subtitle="AS"
      infoText="Base armour save, modified by toggles plus the auto-derived Strength penalty (S4→-1, S5→-2, …) from the To Wound card."
      inputs={
        <SaveSelect
          label="Base Armour Save"
          value={baseTarget}
          onChange={onSetSaveTarget}
        />
      }
      modifiers={ARMOUR_MODIFIERS.map((config) => (
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
          kind="armourSave"
        />
      }
    />
  );
}
