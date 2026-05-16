import type {
  AttackMode,
  CardKind,
  FullState,
} from "@/entities/dice/model/types";
import { MODIFIER_CONFIGS } from "@/entities/dice/model/modifiers";

export const INITIAL_DEFAULTS = {
  attackerWS: 3,
  defenderWS: 3,
  attackerBS: 3,
  strength: 3,
  toughness: 3,
  armourBaseTarget: 6,
  wardBaseTarget: "none",
  attackMode: "melee",
} as const;

function visibleIn(
  cfgMode: AttackMode | undefined,
  attackMode: AttackMode,
): boolean {
  return cfgMode === undefined || cfgMode === attackMode;
}

function modifiersFor(card: CardKind, attackMode: AttackMode) {
  return MODIFIER_CONFIGS.filter(
    (c) => c.card === card && visibleIn(c.mode, attackMode),
  ).map((c) => {
    const base: {
      id: string;
      active: false;
      value?: number;
      valueDef?: number;
      target?: "attacker" | "defender" | "both";
    } = { id: c.id, active: false };
    if (c.variableValue) {
      base.value = c.variableValue.default;
      base.valueDef = c.variableValue.default;
    }
    if (c.effect.kind === "force-ws" || c.effect.kind === "delta-ws") {
      base.target = c.effect.target;
    }
    return base;
  });
}

export function createInitialState(): FullState {
  return {
    attackMode: INITIAL_DEFAULTS.attackMode,
    toHit: {
      kind: "toHit",
      inputs: {
        attackerWS: INITIAL_DEFAULTS.attackerWS,
        defenderWS: INITIAL_DEFAULTS.defenderWS,
        attackerBS: INITIAL_DEFAULTS.attackerBS,
      },
      modifiers: modifiersFor("toHit", "melee"),
      modifiersShooting: modifiersFor("toHit", "shooting"),
    },
    toWound: {
      kind: "toWound",
      inputs: {
        strength: INITIAL_DEFAULTS.strength,
        toughness: INITIAL_DEFAULTS.toughness,
      },
      modifiers: modifiersFor("toWound", "melee"),
      modifiersShooting: modifiersFor("toWound", "shooting"),
    },
    armourSave: {
      kind: "armourSave",
      inputs: {
        baseTarget: INITIAL_DEFAULTS.armourBaseTarget,
      },
      modifiers: modifiersFor("armourSave", "melee"),
      modifiersShooting: modifiersFor("armourSave", "shooting"),
    },
    wardSave: {
      kind: "wardSave",
      inputs: {
        baseTarget: INITIAL_DEFAULTS.wardBaseTarget,
      },
      modifiers: modifiersFor("wardSave", "melee"),
      modifiersShooting: modifiersFor("wardSave", "shooting"),
    },
  };
}
