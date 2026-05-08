import type {
  CardKind,
  DisplayedTarget,
  Outcome,
  ProbabilityFraction,
} from "@/entities/dice/model/types";

export const UNROLLABLE_GLYPH = "—";

export function formatTarget(target: DisplayedTarget): string {
  if (typeof target === "number") return `${target}+`;
  return UNROLLABLE_GLYPH;
}

export function formatProbability(
  probability: ProbabilityFraction,
  kind: CardKind,
  target: DisplayedTarget,
): string {
  if (target === "auto-fail") return "Auto-fail";
  if (target === "no-save") return "No save";
  if (target === "no-ward") return "No ward";
  const percent = (probability * 100).toFixed(1);
  switch (kind) {
    case "toHit":
      return `${percent}% chance to hit`;
    case "toWound":
      return `${percent}% chance to wound`;
    case "armourSave":
    case "wardSave":
      return `${percent}% chance to save`;
  }
}

export function formatOutcome(outcome: Outcome): {
  chance: string;
  expected: string;
} {
  const percent = (outcome.unsavedWoundChance * 100).toFixed(1);
  const expected = outcome.expectedUnsavedWounds.toFixed(3);
  return {
    chance: `${percent}% Chance of unsaved wound`,
    expected: `${expected} Expected unsaved wounds`,
  };
}
