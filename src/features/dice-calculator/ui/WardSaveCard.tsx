import { Sparkles } from "lucide-react";
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

const WARD_MODIFIERS = MODIFIER_CONFIGS.filter((m) => m.card === "wardSave");

export function WardSaveCard({
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
  const baseTarget = (state.inputs.baseTarget ?? 5) as DiceTarget;
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
