export type CardKind = "toHit" | "toWound" | "armourSave" | "wardSave";

export type DiceTarget = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceTargetString = `${DiceTarget}+`;

export type UnrollableMarker = "auto-fail" | "no-save" | "no-ward";

export type DisplayedTarget = DiceTarget | UnrollableMarker;

export type ProbabilityFraction = number;

export type ModifierEffect =
  | { kind: "numeric"; value: number }
  | { kind: "replace-ward"; value: 6 };

export type ModifierId = string;

export type ModifierConfig = {
  id: ModifierId;
  card: CardKind;
  label: string;
  effect: ModifierEffect;
  source?: string;
};

export type ModifierState = {
  id: ModifierId;
  active: boolean;
};

export type StatInputs = {
  attackerWS?: number;
  defenderWS?: number;
  strength?: number;
  toughness?: number;
  baseTarget?: DiceTarget;
};

export type CardState = {
  kind: CardKind;
  inputs: StatInputs;
  modifiers: ModifierState[];
};

export type ComputedCardResult = {
  kind: CardKind;
  target: DisplayedTarget;
  probability: ProbabilityFraction;
  rawTarget: number;
};

export type Outcome = {
  unsavedWoundChance: ProbabilityFraction;
  expectedUnsavedWounds: number;
};

export type FullState = {
  toHit: CardState;
  toWound: CardState;
  armourSave: CardState;
  wardSave: CardState;
};
