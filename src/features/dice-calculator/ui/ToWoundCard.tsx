import { Flame } from "lucide-react";
import {
  MODIFIER_CONFIGS,
  type CardState,
  type ComputedCardResult,
  type ModifierId,
} from "@/entities/dice";
import { ModifierToggleRow } from "@/shared/ui/modifier-toggle-row";
import { NumberStepper } from "@/shared/ui/number-stepper";
import { ResultBadge } from "@/shared/ui/result-badge";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

const TO_WOUND_MODIFIERS = MODIFIER_CONFIGS.filter((m) => m.card === "toWound");

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
  const activeMap = new Map(state.modifiers.map((m) => [m.id, m.active]));

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
