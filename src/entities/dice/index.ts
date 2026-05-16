export type {
  AttackMode,
  CardKind,
  CardState,
  ComputedCardResult,
  DiceTarget,
  DiceTargetString,
  DisplayedTarget,
  FullState,
  ModifierCategory,
  ModifierConfig,
  ModifierEffect,
  ModifierId,
  ModifierState,
  Outcome,
  ProbabilityFraction,
  SaveBaseTarget,
  StatInputs,
  UnrollableMarker,
} from "./model/types";

export {
  STAT_MIN,
  STAT_MAX,
  lookupToHit,
  lookupToWound,
  parseTarget,
} from "./lib/charts";

export { MODIFIER_CONFIGS } from "./model/modifiers";

export { INITIAL_DEFAULTS, createInitialState } from "./model/defaults";

export {
  chanceFromTarget,
  clampAndFormat,
  computeArmourSaveTarget,
  computeFullState,
  computeOutcome,
  computeToHitTarget,
  computeToWoundTarget,
  computeWardSaveTarget,
  getEffectiveStrength,
  unsavedWoundProbability,
} from "./lib/compute";

export {
  UNROLLABLE_GLYPH,
  formatOutcome,
  formatProbability,
  formatTarget,
} from "./lib/format";
