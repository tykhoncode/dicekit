import type {
  CardKind,
  CardState,
  ComputedCardResult,
  DiceTarget,
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

function activeAutoResult(
  modifiers: readonly ModifierState[],
): "pass" | "fail" | null {
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind === "auto-result") return config.effect.value;
  }
  return null;
}

export function getEffectiveStrength(toWound: CardState): number {
  const base = toWound.inputs.strength ?? INITIAL_DEFAULTS.strength;
  const buff = activeNumericModifierSum(toWound.modifiers, {
    includeStrengthSources: true,
  });
  return base + buff;
}

function resolvedTarget(
  state: ModifierState,
  config: ModifierConfig,
): "attacker" | "defender" | "both" {
  if (state.target) return state.target;
  if (config.effect.kind === "force-ws" || config.effect.kind === "delta-ws") {
    return config.effect.target;
  }
  return "attacker";
}

type Phase = "pre" | "magic" | "post";

function configPhase(config: ModifierConfig): Phase {
  if (config.prePhase) return "pre";
  if (config.postPhase) return "post";
  return "magic";
}

function inPhase(config: ModifierConfig, phase: Phase): boolean {
  return configPhase(config) === phase;
}

function activeForceWS(
  modifiers: readonly ModifierState[],
  phase: Phase,
): { attacker: number | null; defender: number | null } {
  let attacker: number | null = null;
  let defender: number | null = null;
  const apply = (side: "attacker" | "defender", value: number) => {
    if (side === "attacker") {
      attacker = attacker === null ? value : Math.min(attacker, value);
    } else {
      defender = defender === null ? value : Math.min(defender, value);
    }
  };
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "force-ws") continue;
    if (!inPhase(config, phase)) continue;
    const value = config.effect.value;
    const target = resolvedTarget(state, config);
    if (target === "attacker" || target === "both") apply("attacker", value);
    if (target === "defender" || target === "both") apply("defender", value);
  }
  return { attacker, defender };
}

function activeDeltaWS(
  modifiers: readonly ModifierState[],
  phase: Phase,
): { attacker: number; defender: number } {
  let attacker = 0;
  let defender = 0;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "delta-ws") continue;
    if (!inPhase(config, phase)) continue;
    const target = resolvedTarget(state, config);
    const fallback = config.variableValue?.default ?? 1;
    const sign = config.effect.sign;
    const fixedMag = config.effect.magnitude;
    const atkMag = fixedMag ?? state.value ?? fallback;
    const defMag = fixedMag ?? state.valueDef ?? state.value ?? fallback;
    if (target === "attacker") attacker += sign * atkMag;
    else if (target === "defender") defender += sign * atkMag;
    else {
      attacker += sign * atkMag;
      defender += sign * defMag;
    }
  }
  return { attacker, defender };
}

function activeForceTarget(modifiers: readonly ModifierState[]): number | null {
  let target: number | null = null;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "force-target") continue;
    const v = config.effect.value;
    target = target === null ? v : Math.min(target, v);
  }
  return target;
}

function clampWS(ws: number): number {
  return Math.max(1, Math.min(10, ws));
}

type CardBreakdown = { rawTarget: number; steps: string[] };

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function formatTargetForStep(raw: number): string {
  const r = Math.min(6, Math.max(1, Math.round(raw)));
  return `${r}+`;
}

function statLabel(base: number, effective: number): string {
  return base === effective ? `${base}` : `(${base}→${effective})`;
}

function explainToHit(toHit: CardState): CardBreakdown {
  const baseA = toHit.inputs.attackerWS ?? INITIAL_DEFAULTS.attackerWS;
  const baseD = toHit.inputs.defenderWS ?? INITIAL_DEFAULTS.defenderWS;

  // Pre-magic phase: persistent artifacts (e.g. Rune of Striking ×3)
  // — lowest priority, can be overridden by spells in the magic phase.
  const preForce = activeForceWS(toHit.modifiers, "pre");
  const aPre = preForce.attacker ?? baseA;
  const dPre = preForce.defender ?? baseD;

  // Magic phase: force-ws + delta-ws not flagged postPhase
  const magicForce = activeForceWS(toHit.modifiers, "magic");
  const magicDelta = activeDeltaWS(toHit.modifiers, "magic");
  const aMagic = clampWS((magicForce.attacker ?? aPre) + magicDelta.attacker);
  const dMagic = clampWS((magicForce.defender ?? dPre) + magicDelta.defender);

  // Post phase: pre-combat tests (Fear, Enchanting Beauty) — applied last
  const postForce = activeForceWS(toHit.modifiers, "post");
  const postDelta = activeDeltaWS(toHit.modifiers, "post");
  let a = postForce.attacker ?? aMagic;
  let d = postForce.defender ?? dMagic;
  a = clampWS(a + postDelta.attacker);
  d = clampWS(d + postDelta.defender);

  const chartTarget = parseTarget(lookupToHit(a, d));
  const modSum = activeNumericModifierSum(toHit.modifiers, {
    includeStrengthSources: false,
  });
  const computed = chartTarget - modSum;

  const steps: string[] = [
    `WS ${statLabel(baseA, a)} vs ${statLabel(baseD, d)} → ${chartTarget}+`,
    `mods ${signed(modSum)} → ${formatTargetForStep(computed)}`,
  ];

  const forced = activeForceTarget(toHit.modifiers);
  if (forced !== null) {
    const finalTarget = Math.min(forced, Math.max(1, Math.round(computed)));
    steps.push(`forced → ${forced}+`);
    return { rawTarget: finalTarget, steps };
  }

  return { rawTarget: computed, steps };
}

function explainToWound(toWound: CardState): CardBreakdown {
  const baseS = toWound.inputs.strength ?? INITIAL_DEFAULTS.strength;
  const effectiveS = getEffectiveStrength(toWound);
  const t = toWound.inputs.toughness ?? INITIAL_DEFAULTS.toughness;
  const chartTarget = parseTarget(lookupToWound(effectiveS, t));
  const directModSum = activeNumericModifierSum(toWound.modifiers, {
    includeStrengthSources: false,
  });
  const raw = chartTarget - directModSum;

  const steps: string[] = [
    `S ${statLabel(baseS, effectiveS)} vs T ${t} → ${chartTarget}+`,
    `mods ${signed(directModSum)} → ${formatTargetForStep(raw)}`,
  ];
  return { rawTarget: raw, steps };
}

function explainArmourSave(
  armourSave: CardState,
  effectiveStrength: number,
  base: DiceTarget,
): CardBreakdown {
  const modSum = activeNumericModifierSum(armourSave.modifiers, {
    includeStrengthSources: false,
  });
  const strengthPenalty = -Math.max(0, effectiveStrength - 3);
  const afterStrength = base - strengthPenalty;
  const raw = afterStrength - modSum;

  const steps: string[] = [`base ${base}+`];
  if (strengthPenalty !== 0) {
    steps.push(
      `S ${effectiveStrength} ${signed(strengthPenalty)} → ${formatTargetForStep(afterStrength)}`,
    );
  }
  steps.push(`mods ${signed(modSum)} → ${formatTargetForStep(raw)}`);
  return { rawTarget: raw, steps };
}

function explainWardSave(wardSave: CardState, base: DiceTarget): CardBreakdown {
  const modSum = activeNumericModifierSum(wardSave.modifiers, {
    includeStrengthSources: false,
  });
  let raw = base - modSum;
  const hasParry = hasActiveReplaceWard(wardSave.modifiers);
  if (hasParry) raw = Math.min(raw, PARRY_WARD_VALUE);

  const steps: string[] = [
    `base ${base}+`,
    `mods ${signed(modSum)} → ${formatTargetForStep(raw)}`,
  ];
  if (hasParry) steps.push(`Parry floor ${PARRY_WARD_VALUE}+`);
  return { rawTarget: raw, steps };
}

export function computeToHitTarget(toHit: CardState): number {
  return explainToHit(toHit).rawTarget;
}

export function computeToWoundTarget(toWound: CardState): number {
  return explainToWound(toWound).rawTarget;
}

function resolveBase(
  card: CardState,
  fallback: DiceTarget | "none",
): DiceTarget | "none" {
  return card.inputs.baseTarget ?? fallback;
}

export function computeArmourSaveTarget(
  armourSave: CardState,
  effectiveStrength: number,
): number {
  const base = resolveBase(armourSave, INITIAL_DEFAULTS.armourBaseTarget);
  if (base === "none") return Infinity;
  return explainArmourSave(armourSave, effectiveStrength, base).rawTarget;
}

export function computeWardSaveTarget(wardSave: CardState): number {
  const base = resolveBase(wardSave, INITIAL_DEFAULTS.wardBaseTarget);
  if (base === "none") return Infinity;
  return explainWardSave(wardSave, base).rawTarget;
}

function noSaveResult(kind: "armourSave" | "wardSave"): ComputedCardResult {
  return {
    kind,
    target: kind === "armourSave" ? "no-save" : "no-ward",
    probability: 0,
    rawTarget: Infinity,
    steps: [kind === "armourSave" ? "no save" : "no ward"],
  };
}

export function clampAndFormat(rawTarget: number): {
  target: DisplayedTarget;
  probability: ProbabilityFraction;
} {
  const rounded = Math.round(rawTarget);
  if (rounded <= 1) {
    return { target: 1, probability: 5 / 6 };
  }
  if (rounded >= 6) {
    return { target: 6, probability: 1 / 6 };
  }
  const dice = rounded as 2 | 3 | 4 | 5;
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

function autoResultFor(
  kind: CardKind,
  override: "pass" | "fail",
  rawTarget: number,
  steps: string[],
): ComputedCardResult {
  const overrideSteps = [...steps, `override → ${override}`];
  if (override === "pass") {
    return {
      kind,
      target: "auto-pass",
      probability: 1,
      rawTarget,
      steps: overrideSteps,
    };
  }
  if (kind === "armourSave") {
    return {
      kind,
      target: "no-save",
      probability: 0,
      rawTarget,
      steps: overrideSteps,
    };
  }
  if (kind === "wardSave") {
    return {
      kind,
      target: "no-ward",
      probability: 0,
      rawTarget,
      steps: overrideSteps,
    };
  }
  return {
    kind,
    target: "auto-fail",
    probability: 0,
    rawTarget,
    steps: overrideSteps,
  };
}

function resolveCard(
  kind: CardKind,
  modifiers: readonly ModifierState[],
  breakdown: CardBreakdown,
): ComputedCardResult {
  const override = activeAutoResult(modifiers);
  if (override) {
    return autoResultFor(kind, override, breakdown.rawTarget, breakdown.steps);
  }
  const fmt = clampAndFormat(breakdown.rawTarget);
  return {
    kind,
    target: fmt.target,
    probability: fmt.probability,
    rawTarget: breakdown.rawTarget,
    steps: breakdown.steps,
  };
}

export function computeFullState(state: FullState): {
  results: ComputedCardResult[];
  outcome: Outcome;
} {
  const effectiveS = getEffectiveStrength(state.toWound);

  const toHit = explainToHit(state.toHit);
  const toWound = explainToWound(state.toWound);

  const armourBase = resolveBase(
    state.armourSave,
    INITIAL_DEFAULTS.armourBaseTarget,
  );
  const wardBase = resolveBase(state.wardSave, INITIAL_DEFAULTS.wardBaseTarget);

  const armourResult: ComputedCardResult =
    armourBase === "none"
      ? noSaveResult("armourSave")
      : resolveCard(
          "armourSave",
          state.armourSave.modifiers,
          explainArmourSave(state.armourSave, effectiveS, armourBase),
        );

  const wardResult: ComputedCardResult =
    wardBase === "none"
      ? noSaveResult("wardSave")
      : resolveCard(
          "wardSave",
          state.wardSave.modifiers,
          explainWardSave(state.wardSave, wardBase),
        );

  const results: ComputedCardResult[] = [
    resolveCard("toHit", state.toHit.modifiers, toHit),
    resolveCard("toWound", state.toWound.modifiers, toWound),
    armourResult,
    wardResult,
  ];

  return { results, outcome: computeOutcome(results) };
}

export function unsavedWoundProbability(state: FullState): ProbabilityFraction {
  return computeFullState(state).outcome.unsavedWoundChance;
}
