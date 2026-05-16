export type CardKind = "toHit" | "toWound" | "armourSave" | "wardSave";

export type AttackMode = "melee" | "shooting";

export type DiceTarget = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceTargetString = `${DiceTarget}+`;

export type UnrollableMarker =
  | "auto-fail"
  | "auto-pass"
  | "no-save"
  | "no-ward"
  | "impossible";

export type DisplayedTarget = DiceTarget | UnrollableMarker;

export type ProbabilityFraction = number;

export type ModifierEffect =
  | { kind: "numeric"; value: number }
  | { kind: "replace-ward"; value: 6 }
  | { kind: "auto-result"; value: "pass" | "fail" }
  | { kind: "force-ws"; target: "attacker" | "defender"; value: number }
  | {
      kind: "delta-ws";
      target: "attacker" | "defender";
      sign: -1 | 1;
      /** Fixed magnitude. When omitted, magnitude is driven by
       *  `ModifierState.value` / `variableValue.default`. */
      magnitude?: number;
    }
  | {
      kind: "delta-bs";
      sign: -1 | 1;
      /** Fixed magnitude. When omitted, magnitude is driven by
       *  `ModifierState.value` / `variableValue.default`. */
      magnitude?: number;
    }
  /** Forces the final to-hit target to a specific dice value (e.g.
   *  Master Rune of Snorri Spangelhelm — always hits on 2+). When
   *  multiple are active, the smallest target wins. */
  | { kind: "force-target"; value: DiceTarget }
  /** Adjusts attacker Strength, defender Toughness, or both — used by
   *  to-wound modifiers (weapons, spells like Wyssan's, faction stat
   *  buffs). When `stat === "both"`, ModifierState.target picks which
   *  side of the combat the buff lands on. */
  | {
      kind: "delta-stat";
      stat: "S" | "T" | "both";
      sign: -1 | 1;
      magnitude?: number;
    };

export type ModifierId = string;

export type ModifierCategory =
  | "general"
  | "spell"
  | "brb-artifact"
  | "race-ability"
  | "race-artifact"
  | "brb-weapon"
  | "race-weapon"
  | "terrain"
  | "custom";

export type ModifierConfig = {
  id: ModifierId;
  card: CardKind;
  label: string;
  effect: ModifierEffect;
  source?: string;
  /** When set, the row exposes a value stepper bound to ModifierState.value
   *  with the given inclusive range and default. Used by `delta-ws` D3
   *  spells (Hand of Glory, Melkoth's Mystifying Miasma). */
  variableValue?: { min: number; max: number; default: number };
  /** Category for grouped rendering. Defaults to "general" (uncategorized,
   *  rendered above the collapsible groups). */
  category?: ModifierCategory;
  /** Race grouping for `race-ability` / `race-artifact` modifiers
   *  (e.g. "Dwarfs", "Tomb Kings"). */
  race?: string;
  /** Optional description rendered behind an info icon next to the label. */
  tooltip?: string;
  /** Hide the atk/both/def slider for `force-ws` / `delta-ws` modifiers
   *  whose effect only ever applies to one side (e.g. on-charge bonuses). */
  noTargetSwitch?: boolean;
  /** When true, this modifier's WS effect is applied AFTER all
   *  magic-phase force-ws / delta-ws effects — used for pre-combat
   *  tests (Fear, Enchanting Beauty) that resolve later in the
   *  timing sequence and override magic-phase buffs. */
  postPhase?: boolean;
  /** When true, this modifier's WS effect is applied BEFORE the
   *  magic phase — used for persistent artifact-based force-ws
   *  effects (e.g. Rune of Striking ×3) that subsequent spells can
   *  override. Lowest priority in the resolution chain. */
  prePhase?: boolean;
  /** Optional. Absent = visible & active in both attack modes (the default
   *  for existing To Wound / AS / Ward configs). Set explicitly to restrict
   *  the rule to a single attack mode. */
  mode?: AttackMode;
};

export type ModifierState = {
  id: ModifierId;
  active: boolean;
  /** Primary D3 value (used by `variableValue` modifiers). When
   *  `target === 'both'` this represents the attacker-side value. */
  value?: number;
  /** Secondary D3 value, used only when `target === 'both'` on a
   *  `variableValue` modifier — the defender-side value. */
  valueDef?: number;
  /** For `force-ws` / `delta-ws` modifiers, the user-selected side
   *  (overrides the config effect's default target). `'both'` applies
   *  the modifier to both sides simultaneously. */
  target?: "attacker" | "defender" | "both";
  /** When true, render this row above its category (still below
   *  auto-result toggles). User-controlled via the pin button. */
  pinned?: boolean;
};

export type SaveBaseTarget = DiceTarget | "none";

export type StatInputs = {
  attackerWS?: number;
  defenderWS?: number;
  attackerBS?: number;
  strength?: number;
  toughness?: number;
  baseTarget?: SaveBaseTarget;
};

export type CardState = {
  kind: CardKind;
  inputs: StatInputs;
  modifiers: ModifierState[];
  /** Parallel active state for shooting attacks. One entry per config where
   *  `config.mode !== "melee"` (i.e. shooting or untagged/both). Active flags
   *  are independent from `modifiers`. */
  modifiersShooting: ModifierState[];
};

export type ComputedCardResult = {
  kind: CardKind;
  target: DisplayedTarget;
  probability: ProbabilityFraction;
  rawTarget: number;
  /** Human-readable per-step breakdown: chart inputs, applied modifiers,
   *  the final clamped target. Each entry is a single short line. */
  steps: string[];
  /** Set only when the To Hit step is in shooting mode and rawTarget is
   *  7, 8, or 9. Encodes the cascade: roll `first+`, then on a 6 roll
   *  `followUp+`. UI renders e.g. "6+ → 4+". */
  cascade?: { first: 6; followUp: DiceTarget };
};

export type Outcome = {
  unsavedWoundChance: ProbabilityFraction;
  expectedUnsavedWounds: number;
};

export type FullState = {
  attackMode: AttackMode;
  toHit: CardState;
  toWound: CardState;
  armourSave: CardState;
  wardSave: CardState;
};
