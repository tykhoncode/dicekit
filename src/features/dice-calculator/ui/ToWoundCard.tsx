import { Flame } from "lucide-react";
import {
  MODIFIER_CONFIGS,
  type CardState,
  type ComputedCardResult,
  type ModifierId,
} from "@/entities/dice";
import { modifierSortKey } from "@/entities/dice/model/modifiers";
import { ModifierToggleRow } from "@/shared/ui/modifier-toggle-row";
import { NumberStepper } from "@/shared/ui/number-stepper";
import { ResultBadge } from "@/shared/ui/result-badge";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

const TO_WOUND_MODIFIERS = [
  ...MODIFIER_CONFIGS.filter((m) => m.card === "toWound"),
].sort((a, b) => {
  const aAuto = a.effect.kind === "auto-result";
  const bAuto = b.effect.kind === "auto-result";
  if (aAuto !== bAuto) return aAuto ? -1 : 1;
  return (
    modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label)
  );
});

export function ToWoundCard({
  state,
  result,
  onSetStat,
  onToggleModifier,
}: {
  state: CardState;
  result: ComputedCardResult;
  onSetStat: (key: "strength" | "toughness", value: number) => void;
  onToggleModifier: (id: ModifierId) => void;
}) {
  const strength = state.inputs.strength ?? 4;
  const toughness = state.inputs.toughness ?? 3;
  const activeMap = new Map(
    state.modifiers.map((m) => [m.id, m.active] as const),
  );

  return (
    <CalculatorCard
      icon={<Flame />}
      title="To Wound"
      subtitle="S vs T"
      infoText="Lookup the WHFB 8th Edition To Wound chart using effective Strength (base + active Strength-source modifiers) vs Toughness."
      inputs={
        <>
          <NumberStepper
            label="Strength"
            value={strength}
            onChange={(v) => onSetStat("strength", v)}
          />
          <NumberStepper
            label="Toughness"
            value={toughness}
            onChange={(v) => onSetStat("toughness", v)}
          />
        </>
      }
      modifiers={TO_WOUND_MODIFIERS.map((config) => (
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
          kind="toWound"
        />
      }
    />
  );
}
