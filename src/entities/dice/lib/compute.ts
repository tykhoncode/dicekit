import type {
  CardKind,
  CardState,
  ComputedCardResult,
  DisplayedTarget,
  FullState,
  ModifierConfig,
  ModifierState,
  Outcome,
  ProbabilityFraction,
} from "@/entities/dice/model/types";
import {
  isStrengthSourceModifier,
  MODIFIER_CONFIGS,
} from "@/entities/dice/model/modifiers";
import {
  lookupToHit,
  lookupToWound,
  parseTarget,
} from "@/entities/dice/lib/charts";
import { INITIAL_DEFAULTS } from "@/entities/dice/model/defaults";

const PARRY_WARD_VALUE = 6;

const CONFIG_BY_ID = new Map<string, ModifierConfig>(
  MODIFIER_CONFIGS.map((c) => [c.id, c]),
);

function activeNumericModifierSum(
  modifiers: readonly ModifierState[],
  options: { includeStrengthSources: boolean },
): number {
  let total = 0;
  for (const state of modifiers) {
    if (!state.active) continue;
    if (!options.includeStrengthSources && isStrengthSourceModifier(state.id)) {
      continue;
    }
    const config = CONFIG_BY_ID.get(state.id);
    if (!config || config.effect.kind !== "numeric") continue;
    total += config.effect.value;
  }
  return total;
}

function hasActiveReplaceWard(modifiers: readonly ModifierState[]): boolean {
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind === "replace-ward") return true;
  }
  return false;
}

export function getEffectiveStrength(toWound: CardState): number {
  const base = toWound.inputs.strength ?? INITIAL_DEFAULTS.strength;
  const buff = activeNumericModifierSum(toWound.modifiers, {
    includeStrengthSources: true,
  });
  return base + buff;
}

export function computeToHitTarget(toHit: CardState): number {
  const a = toHit.inputs.attackerWS ?? INITIAL_DEFAULTS.attackerWS;
  const d = toHit.inputs.defenderWS ?? INITIAL_DEFAULTS.defenderWS;
  const chartTarget = parseTarget(lookupToHit(a, d));
  const modSum = activeNumericModifierSum(toHit.modifiers, {
    includeStrengthSources: false,
  });
  return chartTarget - modSum;
}

export function computeToWoundTarget(toWound: CardState): number {
  const effectiveS = getEffectiveStrength(toWound);
  const t = toWound.inputs.toughness ?? INITIAL_DEFAULTS.toughness;
  const chartTarget = parseTarget(lookupToWound(effectiveS, t));
  const directModSum = activeNumericModifierSum(toWound.modifiers, {
    includeStrengthSources: false,
  });
  return chartTarget - directModSum;
}

export function computeArmourSaveTarget(
  armourSave: CardState,
  effectiveStrength: number,
): number {
  const base =
    armourSave.inputs.baseTarget ?? INITIAL_DEFAULTS.armourBaseTarget;
  const modSum = activeNumericModifierSum(armourSave.modifiers, {
    includeStrengthSources: false,
  });
  const strengthPenalty = -Math.max(0, effectiveStrength - 3);
  return base - modSum - strengthPenalty;
}

export function computeWardSaveTarget(wardSave: CardState): number {
  const base = wardSave.inputs.baseTarget ?? INITIAL_DEFAULTS.wardBaseTarget;
  const modSum = activeNumericModifierSum(wardSave.modifiers, {
    includeStrengthSources: false,
  });
  const raw = base - modSum;
  if (hasActiveReplaceWard(wardSave.modifiers)) {
    return Math.min(raw, PARRY_WARD_VALUE);
  }
  return raw;
}

type BoundaryKind = "toHit" | "toWound" | "armourSave" | "wardSave";

function boundaryMarker(kind: BoundaryKind): DisplayedTarget {
  switch (kind) {
    case "toHit":
    case "toWound":
      return "auto-fail";
    case "armourSave":
      return "no-save";
    case "wardSave":
      return "no-ward";
  }
}

export function clampAndFormat(
  rawTarget: number,
  kind: CardKind,
): { target: DisplayedTarget; probability: ProbabilityFraction } {
  const rounded = Math.round(rawTarget);
  if (rounded <= 1) {
    return { target: 1, probability: 5 / 6 };
  }
  if (rounded >= 7) {
    return { target: boundaryMarker(kind as BoundaryKind), probability: 0 };
  }
  const dice = rounded as 2 | 3 | 4 | 5 | 6;
  return { target: dice, probability: (7 - dice) / 6 };
}

export function chanceFromTarget(target: number): ProbabilityFraction {
  if (target <= 1) return 5 / 6;
  if (target >= 7) return 0;
  return (7 - target) / 6;
}

export function computeOutcome(
  results: readonly ComputedCardResult[],
): Outcome {
  const [hit, wound, armour, ward] = results;
  if (!hit || !wound || !armour || !ward) {
    return { unsavedWoundChance: 0, expectedUnsavedWounds: 0 };
  }
  const hitP = hit.probability;
  const woundP = wound.probability;
  const failArmourP = 1 - armour.probability;
  const failWardP = 1 - ward.probability;
  const unsavedWoundChance = hitP * woundP * failArmourP * failWardP;
  return {
    unsavedWoundChance,
    expectedUnsavedWounds: unsavedWoundChance,
  };
}

export function computeFullState(state: FullState): {
  results: ComputedCardResult[];
  outcome: Outcome;
} {
  const effectiveS = getEffectiveStrength(state.toWound);

  const toHitRaw = computeToHitTarget(state.toHit);
  const toWoundRaw = computeToWoundTarget(state.toWound);
  const armourRaw = computeArmourSaveTarget(state.armourSave, effectiveS);
  const wardRaw = computeWardSaveTarget(state.wardSave);

  const toHitFmt = clampAndFormat(toHitRaw, "toHit");
  const toWoundFmt = clampAndFormat(toWoundRaw, "toWound");
  const armourFmt = clampAndFormat(armourRaw, "armourSave");
  const wardFmt = clampAndFormat(wardRaw, "wardSave");

  const results: ComputedCardResult[] = [
    {
      kind: "toHit",
      target: toHitFmt.target,
      probability: toHitFmt.probability,
      rawTarget: toHitRaw,
    },
    {
      kind: "toWound",
      target: toWoundFmt.target,
      probability: toWoundFmt.probability,
      rawTarget: toWoundRaw,
    },
    {
      kind: "armourSave",
      target: armourFmt.target,
      probability: armourFmt.probability,
      rawTarget: armourRaw,
    },
    {
      kind: "wardSave",
      target: wardFmt.target,
      probability: wardFmt.probability,
      rawTarget: wardRaw,
    },
  ];

  return { results, outcome: computeOutcome(results) };
}

export function unsavedWoundProbability(state: FullState): ProbabilityFraction {
  return computeFullState(state).outcome.unsavedWoundChance;
}
