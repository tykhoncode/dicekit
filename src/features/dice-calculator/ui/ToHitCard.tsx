import { Swords } from "lucide-react";
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

const TO_HIT_MODIFIERS = MODIFIER_CONFIGS.filter((m) => m.card === "toHit");

export function ToHitCard({
  state,
  result,
  onSetStat,
  onToggleModifier,
}: {
  state: CardState;
  result: ComputedCardResult;
  onSetStat: (key: "attackerWS" | "defenderWS", value: number) => void;
  onToggleModifier: (id: ModifierId) => void;
}) {
  const attackerWS = state.inputs.attackerWS ?? 4;
  const defenderWS = state.inputs.defenderWS ?? 4;
  const activeMap = new Map(state.modifiers.map((m) => [m.id, m.active]));

  return (
    <CalculatorCard
      icon={<Swords />}
      title="To Hit"
      subtitle="WS vs WS"
      infoText="Lookup the WHFB 8th Edition close-combat To Hit chart, then apply active modifiers."
      inputs={
        <>
          <NumberStepper
            label="Attacker WS"
            value={attackerWS}
            onChange={(v) => onSetStat("attackerWS", v)}
          />
          <NumberStepper
            label="Defender WS"
            value={defenderWS}
            onChange={(v) => onSetStat("defenderWS", v)}
          />
        </>
      }
      modifiers={TO_HIT_MODIFIERS.map((config) => (
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
          kind="toHit"
        />
      }
    />
  );
}
