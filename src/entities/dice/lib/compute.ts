import type {
  AttackMode,
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
import { MODIFIER_CONFIGS } from "@/entities/dice/model/modifiers";
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

function numericContribution(
  state: ModifierState,
  config: ModifierConfig,
): number {
  if (config.effect.kind !== "numeric") return 0;
  const ev = config.effect.value;
  if (!config.variableValue) return ev;
  const sv = state.value ?? config.variableValue.default;
  // variableValue with a negative minimum means the stepper carries a
  // signed value (e.g. Custom ±To Hit -5..+5). Otherwise it's a positive
  // magnitude that gets multiplied by the effect's sign (e.g. Plague of
  // Rust effect.value=-1, variableValue 1-9 → contribution = -magnitude).
  if (config.variableValue.min < 0) return sv;
  return ev * sv;
}

export function activeNumericModifierSum(
  modifiers: readonly ModifierState[],
): number {
  let total = 0;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (!config || config.effect.kind !== "numeric") continue;
    total += numericContribution(state, config);
  }
  return total;
}

function activeDeltaStat(modifiers: readonly ModifierState[]): {
  attackerS: number;
  defenderT: number;
} {
  let attackerS = 0;
  let defenderT = 0;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "delta-stat") continue;
    const sign = config.effect.sign;
    const fixedMag = config.effect.magnitude;
    const fallback = config.variableValue?.default ?? 1;
    const valueAtk = fixedMag ?? state.value ?? fallback;
    const valueDef = fixedMag ?? state.valueDef ?? state.value ?? fallback;
    const stat = config.effect.stat;
    if (stat === "S") {
      attackerS += sign * valueAtk;
    } else if (stat === "T") {
      defenderT += sign * valueAtk;
    } else {
      const target = state.target ?? "attacker";
      if (target === "attacker") attackerS += sign * valueAtk;
      else if (target === "defender") defenderT += sign * valueAtk;
      else {
        attackerS += sign * valueAtk;
        defenderT += sign * valueDef;
      }
    }
  }
  return { attackerS, defenderT };
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

function activeModifierArray(
  card: CardState,
  attackMode: AttackMode,
): readonly ModifierState[] {
  return attackMode === "melee" ? card.modifiers : card.modifiersShooting;
}

export function getEffectiveStrength(
  toWound: CardState,
  attackMode: AttackMode,
): number {
  const base = toWound.inputs.strength ?? INITIAL_DEFAULTS.strength;
  const buff = activeDeltaStat(
    activeModifierArray(toWound, attackMode),
  ).attackerS;
  return base + buff;
}

export function getEffectiveToughness(
  toWound: CardState,
  attackMode: AttackMode,
): number {
  const base = toWound.inputs.toughness ?? INITIAL_DEFAULTS.toughness;
  const buff = activeDeltaStat(
    activeModifierArray(toWound, attackMode),
  ).defenderT;
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
    // variable force-ws mods (Custom WS) override effect.value with state.value
    const value = config.variableValue
      ? (state.value ?? config.effect.value)
      : config.effect.value;
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

function activeDeltaBS(modifiers: readonly ModifierState[]): number {
  let sum = 0;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "delta-bs") continue;
    const fallback = config.variableValue?.default ?? 1;
    const sign = config.effect.sign;
    const fixedMag = config.effect.magnitude;
    const mag = fixedMag ?? state.value ?? fallback;
    sum += sign * mag;
  }
  return sum;
}

function clampBS(bs: number): number {
  return Math.max(1, Math.min(10, bs));
}

function activeForceTarget(modifiers: readonly ModifierState[]): number | null {
  let target: number | null = null;
  for (const state of modifiers) {
    if (!state.active) continue;
    const config = CONFIG_BY_ID.get(state.id);
    if (config?.effect.kind !== "force-target") continue;
    const v = config.variableValue
      ? (state.value ?? config.effect.value)
      : config.effect.value;
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

export function getEffectiveAttackerWS(toHit: CardState): number {
  const baseA = toHit.inputs.attackerWS ?? INITIAL_DEFAULTS.attackerWS;
  const aPre = activeForceWS(toHit.modifiers, "pre").attacker ?? baseA;
  const magicForce = activeForceWS(toHit.modifiers, "magic").attacker;
  const aMagic = clampWS(
    (magicForce ?? aPre) + activeDeltaWS(toHit.modifiers, "magic").attacker,
  );
  const postForce = activeForceWS(toHit.modifiers, "post").attacker;
  return clampWS(
    (postForce ?? aMagic) + activeDeltaWS(toHit.modifiers, "post").attacker,
  );
}

export function getEffectiveDefenderWS(toHit: CardState): number {
  const baseD = toHit.inputs.defenderWS ?? INITIAL_DEFAULTS.defenderWS;
  const dPre = activeForceWS(toHit.modifiers, "pre").defender ?? baseD;
  const magicForce = activeForceWS(toHit.modifiers, "magic").defender;
  const dMagic = clampWS(
    (magicForce ?? dPre) + activeDeltaWS(toHit.modifiers, "magic").defender,
  );
  const postForce = activeForceWS(toHit.modifiers, "post").defender;
  return clampWS(
    (postForce ?? dMagic) + activeDeltaWS(toHit.modifiers, "post").defender,
  );
}

function explainToHitMelee(toHit: CardState): CardBreakdown {
  const baseA = toHit.inputs.attackerWS ?? INITIAL_DEFAULTS.attackerWS;
  const baseD = toHit.inputs.defenderWS ?? INITIAL_DEFAULTS.defenderWS;
  const a = getEffectiveAttackerWS(toHit);
  const d = getEffectiveDefenderWS(toHit);

  const chartTarget = parseTarget(lookupToHit(a, d));
  const modSum = activeNumericModifierSum(toHit.modifiers);
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

export function getEffectiveAttackerBS(toHit: CardState): number {
  const baseBS = toHit.inputs.attackerBS ?? INITIAL_DEFAULTS.attackerBS;
  const bsDelta = activeDeltaBS(toHit.modifiersShooting);
  return clampBS(baseBS + bsDelta);
}

function explainToHitShooting(toHit: CardState): CardBreakdown {
  const effectiveBS = getEffectiveAttackerBS(toHit);
  const baseBS = toHit.inputs.attackerBS ?? INITIAL_DEFAULTS.attackerBS;
  const chartTarget = Math.max(2, Math.min(6, 7 - effectiveBS));
  const modSum = activeNumericModifierSum(toHit.modifiersShooting);
  const computed = chartTarget - modSum;

  const steps: string[] = [
    `BS ${statLabel(baseBS, effectiveBS)} → ${chartTarget}+`,
    `mods ${signed(modSum)} → ${formatTargetForStep(computed)}`,
  ];

  const forced = activeForceTarget(toHit.modifiersShooting);
  if (forced !== null) {
    const finalTarget = Math.min(forced, Math.max(1, Math.round(computed)));
    steps.push(`forced → ${forced}+`);
    return { rawTarget: finalTarget, steps };
  }
  return { rawTarget: computed, steps };
}

function explainToHit(toHit: CardState, attackMode: AttackMode): CardBreakdown {
  return attackMode === "melee"
    ? explainToHitMelee(toHit)
    : explainToHitShooting(toHit);
}

function explainToWound(
  toWound: CardState,
  attackMode: AttackMode,
): CardBreakdown {
  const mods = activeModifierArray(toWound, attackMode);
  const baseS = toWound.inputs.strength ?? INITIAL_DEFAULTS.strength;
  const baseT = toWound.inputs.toughness ?? INITIAL_DEFAULTS.toughness;
  const effectiveS = getEffectiveStrength(toWound, attackMode);
  const effectiveT = getEffectiveToughness(toWound, attackMode);
  const chartTarget = parseTarget(lookupToWound(effectiveS, effectiveT));
  const directModSum = activeNumericModifierSum(mods);
  const computed = chartTarget - directModSum;

  const steps: string[] = [
    `S ${statLabel(baseS, effectiveS)} vs T ${statLabel(baseT, effectiveT)} → ${chartTarget}+`,
    `mods ${signed(directModSum)} → ${formatTargetForStep(computed)}`,
  ];

  const forced = activeForceTarget(mods);
  if (forced !== null) {
    const finalTarget = Math.min(forced, Math.max(1, Math.round(computed)));
    steps.push(`forced → ${forced}+`);
    return { rawTarget: finalTarget, steps };
  }
  return { rawTarget: computed, steps };
}

function explainArmourSave(
  armourSave: CardState,
  effectiveStrength: number,
  base: DiceTarget,
  attackMode: AttackMode,
): CardBreakdown {
  const mods = activeModifierArray(armourSave, attackMode);
  const modSum = activeNumericModifierSum(mods);
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

  const forced = activeForceTarget(mods);
  if (forced !== null) {
    const finalTarget = Math.min(forced, Math.max(1, Math.round(raw)));
    steps.push(`forced → ${forced}+`);
    return { rawTarget: finalTarget, steps };
  }
  return { rawTarget: raw, steps };
}

function explainWardSave(
  wardSave: CardState,
  base: DiceTarget,
  attackMode: AttackMode,
): CardBreakdown {
  const mods = activeModifierArray(wardSave, attackMode);
  const modSum = activeNumericModifierSum(mods);
  let raw = base - modSum;
  const hasParry = hasActiveReplaceWard(mods);
  if (hasParry) raw = Math.min(raw, PARRY_WARD_VALUE);

  const steps: string[] = [
    `base ${base}+`,
    `mods ${signed(modSum)} → ${formatTargetForStep(raw)}`,
  ];
  if (hasParry) steps.push(`Parry floor ${PARRY_WARD_VALUE}+`);

  const forced = activeForceTarget(mods);
  if (forced !== null) {
    const finalTarget = Math.min(forced, Math.max(1, Math.round(raw)));
    steps.push(`forced → ${forced}+`);
    return { rawTarget: finalTarget, steps };
  }
  return { rawTarget: raw, steps };
}

export function computeToHitTarget(
  toHit: CardState,
  attackMode: AttackMode,
): number {
  return explainToHit(toHit, attackMode).rawTarget;
}

export function computeToWoundTarget(
  toWound: CardState,
  attackMode: AttackMode,
): number {
  return explainToWound(toWound, attackMode).rawTarget;
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
  attackMode: AttackMode,
): number {
  const base = resolveBase(armourSave, INITIAL_DEFAULTS.armourBaseTarget);
  if (base === "none") return Infinity;
  return explainArmourSave(armourSave, effectiveStrength, base, attackMode)
    .rawTarget;
}

export function computeWardSaveTarget(
  wardSave: CardState,
  attackMode: AttackMode,
): number {
  const base = resolveBase(wardSave, INITIAL_DEFAULTS.wardBaseTarget);
  if (base === "none") return Infinity;
  return explainWardSave(wardSave, base, attackMode).rawTarget;
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

function formatToHitShooting(rawTarget: number): {
  target: DisplayedTarget;
  cascade?: { first: 6; followUp: DiceTarget };
  probability: ProbabilityFraction;
} {
  const rounded = Math.round(rawTarget);
  if (rounded <= 1) {
    return { target: 1, probability: 5 / 6 };
  }
  if (rounded <= 6) {
    const dice = Math.max(2, rounded) as 2 | 3 | 4 | 5 | 6;
    return { target: dice, probability: (7 - dice) / 6 };
  }
  if (rounded <= 9) {
    const followUp = (rounded - 3) as DiceTarget;
    return {
      target: 6,
      cascade: { first: 6, followUp },
      probability: (1 / 6) * ((7 - followUp) / 6),
    };
  }
  return { target: "impossible", probability: 0 };
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
  attackMode: AttackMode,
): ComputedCardResult {
  const override = activeAutoResult(modifiers);
  if (override) {
    return autoResultFor(kind, override, breakdown.rawTarget, breakdown.steps);
  }
  if (kind === "toHit" && attackMode === "shooting") {
    const fmt = formatToHitShooting(breakdown.rawTarget);
    const result: ComputedCardResult = {
      kind,
      target: fmt.target,
      probability: fmt.probability,
      rawTarget: breakdown.rawTarget,
      steps: breakdown.steps,
    };
    if (fmt.cascade) {
      result.cascade = fmt.cascade;
    }
    return result;
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
  const { attackMode } = state;
  const effectiveS = getEffectiveStrength(state.toWound, attackMode);

  const toHit = explainToHit(state.toHit, attackMode);
  const toWound = explainToWound(state.toWound, attackMode);

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
          activeModifierArray(state.armourSave, attackMode),
          explainArmourSave(
            state.armourSave,
            effectiveS,
            armourBase,
            attackMode,
          ),
          attackMode,
        );

  const wardResult: ComputedCardResult =
    wardBase === "none"
      ? noSaveResult("wardSave")
      : resolveCard(
          "wardSave",
          activeModifierArray(state.wardSave, attackMode),
          explainWardSave(state.wardSave, wardBase, attackMode),
          attackMode,
        );

  const results: ComputedCardResult[] = [
    resolveCard(
      "toHit",
      activeModifierArray(state.toHit, attackMode),
      toHit,
      attackMode,
    ),
    resolveCard(
      "toWound",
      activeModifierArray(state.toWound, attackMode),
      toWound,
      attackMode,
    ),
    armourResult,
    wardResult,
  ];

  return { results, outcome: computeOutcome(results) };
}

export function unsavedWoundProbability(state: FullState): ProbabilityFraction {
  return computeFullState(state).outcome.unsavedWoundChance;
}
