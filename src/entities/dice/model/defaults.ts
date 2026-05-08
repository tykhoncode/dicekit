import type { CardKind, FullState } from "@/entities/dice/model/types";
import { MODIFIER_CONFIGS } from "@/entities/dice/model/modifiers";

export const INITIAL_DEFAULTS = {
  attackerWS: 4,
  defenderWS: 4,
  strength: 4,
  toughness: 3,
  armourBaseTarget: 4,
  wardBaseTarget: 5,
} as const;

function modifiersFor(card: CardKind) {
  return MODIFIER_CONFIGS.filter((c) => c.card === card).map((c) => ({
    id: c.id,
    active: false,
  }));
}

export function createInitialState(): FullState {
  return {
    toHit: {
      kind: "toHit",
      inputs: {
        attackerWS: INITIAL_DEFAULTS.attackerWS,
        defenderWS: INITIAL_DEFAULTS.defenderWS,
      },
      modifiers: modifiersFor("toHit"),
    },
    toWound: {
      kind: "toWound",
      inputs: {
        strength: INITIAL_DEFAULTS.strength,
        toughness: INITIAL_DEFAULTS.toughness,
      },
      modifiers: modifiersFor("toWound"),
    },
    armourSave: {
      kind: "armourSave",
      inputs: {
        baseTarget: INITIAL_DEFAULTS.armourBaseTarget,
      },
      modifiers: modifiersFor("armourSave"),
    },
    wardSave: {
      kind: "wardSave",
      inputs: {
        baseTarget: INITIAL_DEFAULTS.wardBaseTarget,
      },
      modifiers: modifiersFor("wardSave"),
    },
  };
}
