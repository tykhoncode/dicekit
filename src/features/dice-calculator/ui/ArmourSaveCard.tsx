import { Shield } from "lucide-react";
import {
  MODIFIER_CONFIGS,
  type CardState,
  type ComputedCardResult,
  type DiceTarget,
  type ModifierId,
} from "@/entities/dice";
import { ModifierToggleRow } from "@/shared/ui/modifier-toggle-row";
import { ResultBadge } from "@/shared/ui/result-badge";
import { SaveSelect } from "@/shared/ui/save-select";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

const ARMOUR_MODIFIERS = MODIFIER_CONFIGS.filter(
  (m) => m.card === "armourSave",
);

export function ArmourSaveCard({
  state,
  result,
  onSetSaveTarget,
  onToggleModifier,
}: {
  state: CardState;
  result: ComputedCardResult;
  onSetSaveTarget: (value: DiceTarget) => void;
  onToggleModifier: (id: ModifierId) => void;
}) {
  const baseTarget = (state.inputs.baseTarget ?? 4) as DiceTarget;
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
