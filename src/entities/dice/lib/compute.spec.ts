import { describe, expect, it } from "vitest";
import {
  chanceFromTarget,
  clampAndFormat,
  computeArmourSaveTarget,
  computeFullState,
  computeToHitTarget,
  computeToWoundTarget,
  computeWardSaveTarget,
  getEffectiveAttackerWS,
  getEffectiveDefenderWS,
  getEffectiveStrength,
  unsavedWoundProbability,
} from "./compute";
import { lookupToHit, lookupToWound, parseTarget } from "./charts";
import { createInitialState } from "@/entities/dice/model/defaults";
import type { CardState, FullState } from "@/entities/dice/model/types";

function withModifierActive(card: CardState, id: string): CardState {
  return {
    ...card,
    modifiers: card.modifiers.map((m) =>
      m.id === id ? { ...m, active: true } : m,
    ),
  };
}

describe("chart lookups", () => {
  it("To Hit corner cases match the WHFB chart", () => {
    expect(parseTarget(lookupToHit(1, 1))).toBe(4);
    expect(parseTarget(lookupToHit(10, 10))).toBe(4);
    expect(parseTarget(lookupToHit(1, 10))).toBe(5);
    expect(parseTarget(lookupToHit(10, 1))).toBe(3);
  });

  it("To Hit equal-WS diagonal is 4+", () => {
    for (const ws of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(parseTarget(lookupToHit(ws, ws))).toBe(4);
    }
  });

  it("To Wound corner cases match the WHFB chart", () => {
    expect(parseTarget(lookupToWound(1, 1))).toBe(4);
    expect(parseTarget(lookupToWound(10, 10))).toBe(4);
    expect(parseTarget(lookupToWound(1, 10))).toBe(6);
    expect(parseTarget(lookupToWound(10, 1))).toBe(2);
  });

  it("To Wound diagonal (S=T) is 4+", () => {
    for (const t of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
      expect(parseTarget(lookupToWound(t, t))).toBe(4);
    }
  });

  it("To Wound: S one higher than T → 3+", () => {
    expect(parseTarget(lookupToWound(4, 3))).toBe(3);
    expect(parseTarget(lookupToWound(7, 6))).toBe(3);
  });
});

describe("sign convention (FR-018b)", () => {
  it("2+ AS with -1 modifier becomes 3+", () => {
    const state = createInitialState();
    const ap = withModifierActive(
      { ...state.armourSave, inputs: { baseTarget: 2 as const } },
      "armourSave:armourPiercing",
    );
    const raw = computeArmourSaveTarget(ap, 0, "melee");
    expect(raw).toBe(3);
  });

  it("5+ AS with +1 modifier becomes 4+", () => {
    const state = createInitialState();
    // Custom ±AS with state.value = 1 → +1 to save (lower target).
    const buffed: typeof state.armourSave = {
      ...state.armourSave,
      inputs: { baseTarget: 5 as const },
      modifiers: state.armourSave.modifiers.map((m) =>
        m.id === "armourSave:customDelta"
          ? { ...m, active: true, value: 1 }
          : m,
      ),
    };
    const raw = computeArmourSaveTarget(buffed, 0, "melee");
    expect(raw).toBe(4);
  });
});

describe("Strength → AS penalty (FR-018a)", () => {
  it("S ≤ 3 yields no penalty", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 1, "melee")).toBe(4);
    expect(computeArmourSaveTarget(as, 3, "melee")).toBe(4);
  });

  it("S4 yields -1 penalty (raises target by 1)", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 4, "melee")).toBe(5);
  });

  it("S10 yields -7 penalty (raises target by 7)", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 10, "melee")).toBe(11);
  });
});

describe("FR-T02 no-double-count rule", () => {
  it("S=4 / T=4 + Halberd active → effective S=5, target 3+ (not 2+)", () => {
    const state = createInitialState();
    const card = withModifierActive(
      { ...state.toWound, inputs: { strength: 4, toughness: 4 } },
      "toWound:halberd",
    );
    expect(getEffectiveStrength(card, "melee")).toBe(5);
    expect(computeToWoundTarget(card, "melee")).toBe(3);
  });

  it("S=4 / T=3 + Great Weapon active → effective S=6, target 2+", () => {
    const state = createInitialState();
    const card = withModifierActive(
      { ...state.toWound, inputs: { strength: 4, toughness: 3 } },
      "toWound:greatWeapon",
    );
    expect(getEffectiveStrength(card, "melee")).toBe(6);
    expect(computeToWoundTarget(card, "melee")).toBe(2);
  });
});

describe("Ward Save not modified by Strength (FR-T04)", () => {
  it("Ward 5+ stays 5+ even when computing alongside high effective Strength", () => {
    const state: FullState = {
      ...createInitialState(),
      toWound: {
        ...createInitialState().toWound,
        inputs: { strength: 10, toughness: 3 },
      },
      wardSave: {
        ...createInitialState().wardSave,
        inputs: { baseTarget: 5 as const },
      },
    };
    const { results } = computeFullState(state);
    const ward = results[3];
    expect(ward).toBeDefined();
    expect(ward?.target).toBe(5);
    expect(ward?.probability).toBeCloseTo(2 / 6, 5);
  });

  it("Parry Ward (replace-ward) caps a worse ward at 6+", () => {
    const state = createInitialState();
    const ward = withModifierActive(
      {
        ...state.wardSave,
        inputs: { baseTarget: 5 as const },
        modifiers: state.wardSave.modifiers.map((m) =>
          m.id === "wardSave:improvedWard" ? { ...m, active: false } : m,
        ),
      },
      "wardSave:parry",
    );
    expect(computeWardSaveTarget(ward, "melee")).toBe(5);
  });
});

describe("clampAndFormat (always cap at 6+)", () => {
  it("target ≤ 1 clamps to 1+ with probability 5/6", () => {
    const out = clampAndFormat(0);
    expect(out.target).toBe(1);
    expect(out.probability).toBeCloseTo(5 / 6, 5);
  });

  it("target ≥ 6 caps at 6+ at 1/6 across every card kind", () => {
    for (const kind of [
      "toHit",
      "toWound",
      "armourSave",
      "wardSave",
    ] as const) {
      void kind; // kept for test readability; behavior is kind-agnostic now
      const out7 = clampAndFormat(7);
      expect(out7.target).toBe(6);
      expect(out7.probability).toBeCloseTo(1 / 6, 5);

      const out12 = clampAndFormat(12);
      expect(out12.target).toBe(6);
      expect(out12.probability).toBeCloseTo(1 / 6, 5);
    }
  });

  it("in-range targets give (7-t)/6 probability", () => {
    expect(chanceFromTarget(2)).toBeCloseTo(5 / 6, 5);
    expect(chanceFromTarget(3)).toBeCloseTo(4 / 6, 5);
    expect(chanceFromTarget(4)).toBeCloseTo(3 / 6, 5);
    expect(chanceFromTarget(5)).toBeCloseTo(2 / 6, 5);
    expect(chanceFromTarget(6)).toBeCloseTo(1 / 6, 5);
  });
});

describe("To Hit modifier accumulation", () => {
  it("Default WS 4 v 4 → 4+", () => {
    const state = createInitialState();
    expect(computeToHitTarget(state.toHit, "melee")).toBe(4);
  });

  it("WS 4 v 4 + Enchanted Blades (+1) → 3+", () => {
    const state = createInitialState();
    const card = withModifierActive(state.toHit, "toHit:enchantedBlades");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("WS 4 v 4 + Pha's Protection (-1) → 5+", () => {
    const state = createInitialState();
    const card = withModifierActive(state.toHit, "toHit:phasProtection");
    expect(computeToHitTarget(card, "melee")).toBe(5);
  });
});

function withModifierTarget(
  card: CardState,
  id: string,
  target: "attacker" | "defender" | "both",
): CardState {
  return {
    ...card,
    modifiers: card.modifiers.map((m) => (m.id === id ? { ...m, target } : m)),
  };
}

function withActiveAndValue(
  card: CardState,
  id: string,
  value: number,
): CardState {
  return {
    ...card,
    modifiers: card.modifiers.map((m) =>
      m.id === id ? { ...m, active: true, value } : m,
    ),
  };
}

describe("Speed of Light (force-ws value 10)", () => {
  it("default target (atk) — chart(10, 4) = 3+", () => {
    const state = createInitialState();
    const card = withModifierActive(state.toHit, "toHit:speedOfLight");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("target=defender — chart(4, 10) = 5+", () => {
    const state = createInitialState();
    let card = withModifierActive(state.toHit, "toHit:speedOfLight");
    card = withModifierTarget(card, "toHit:speedOfLight", "defender");
    expect(computeToHitTarget(card, "melee")).toBe(5);
  });

  it("target=both — both sides forced to WS 10 — chart(10, 10) = 4+", () => {
    const state = createInitialState();
    let card = withModifierActive(state.toHit, "toHit:speedOfLight");
    card = withModifierTarget(card, "toHit:speedOfLight", "both");
    expect(computeToHitTarget(card, "melee")).toBe(4);
  });

  it("Fear (atk) WS=1 wins over Speed of Light (atk) WS=10 — smallest force-ws wins", () => {
    const state = createInitialState();
    const card = withModifierActive(
      withModifierActive(state.toHit, "toHit:speedOfLight"),
      "toHit:fear",
    );
    // chart(1, 4) = 5+
    expect(computeToHitTarget(card, "melee")).toBe(5);
  });
});

describe("Hand of Glory / Melkoth's (delta-ws variable)", () => {
  it("Hand of Glory default (atk, value 1) → A_WS 5; chart(5, 4) = 3+", () => {
    const state = createInitialState();
    const card = withModifierActive(state.toHit, "toHit:handOfGlory");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("Hand of Glory atk value 3 → A_WS 7; chart(7, 4) = 3+", () => {
    const state = createInitialState();
    const card = withActiveAndValue(state.toHit, "toHit:handOfGlory", 3);
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("Melkoth's target=defender, value 1 → D_WS 3; chart(4, 3) = 3+", () => {
    const state = createInitialState();
    let card = withModifierActive(state.toHit, "toHit:melkothsMiasma");
    card = withModifierTarget(card, "toHit:melkothsMiasma", "defender");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("Melkoth's target=defender, value 3 → D_WS 1; chart(4, 1) = 3+", () => {
    const state = createInitialState();
    let card = withActiveAndValue(state.toHit, "toHit:melkothsMiasma", 3);
    card = withModifierTarget(card, "toHit:melkothsMiasma", "defender");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("delta-ws clamps to [1, 10]: Melkoth's def value 3 with D_WS 1 stays at 1", () => {
    const state = createInitialState();
    let card = withActiveAndValue(state.toHit, "toHit:melkothsMiasma", 3);
    card = withModifierTarget(card, "toHit:melkothsMiasma", "defender");
    card = { ...card, inputs: { ...card.inputs, defenderWS: 1 } };
    // baseD=1, delta=-3 → -2, clamped up to 1; chart(4, 1) = 3+
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("Hand of Glory target=both uses value (atk side) and valueDef (def side) — chart(6, 6) = 4+", () => {
    const state = createInitialState();
    let card = withActiveAndValue(state.toHit, "toHit:handOfGlory", 2);
    card = {
      ...card,
      modifiers: card.modifiers.map((m) =>
        m.id === "toHit:handOfGlory"
          ? { ...m, valueDef: 2, target: "both" }
          : m,
      ),
    };
    // attackerWS 4 + 2 = 6; defenderWS 4 + 2 = 6 → chart(6, 6) = 4+
    expect(computeToHitTarget(card, "melee")).toBe(4);
  });

  it("Melkoth's target=both with value=1 / valueDef=2 — chart(3, 2) = 3+", () => {
    const state = createInitialState();
    const card: CardState = {
      ...state.toHit,
      modifiers: state.toHit.modifiers.map((m) =>
        m.id === "toHit:melkothsMiasma"
          ? { ...m, active: true, value: 1, valueDef: 2, target: "both" }
          : m,
      ),
    };
    // attackerWS 4 - 1 = 3; defenderWS 4 - 2 = 2 → chart(3, 2) = 3+
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });
});

describe("Fear test failed (force-ws value 1)", () => {
  it("default target (atk) → chart(1, 4) = 5+", () => {
    const state = createInitialState();
    const card = withModifierActive(state.toHit, "toHit:fear");
    expect(computeToHitTarget(card, "melee")).toBe(5);
  });

  it("target=defender → chart(4, 1) = 3+", () => {
    const state = createInitialState();
    let card = withModifierActive(state.toHit, "toHit:fear");
    card = withModifierTarget(card, "toHit:fear", "defender");
    expect(computeToHitTarget(card, "melee")).toBe(3);
  });

  it("target=both → chart(1, 1) = 4+", () => {
    const state = createInitialState();
    let card = withModifierActive(state.toHit, "toHit:fear");
    card = withModifierTarget(card, "toHit:fear", "both");
    expect(computeToHitTarget(card, "melee")).toBe(4);
  });

  it("Force-ws (atk) does NOT change the modifier sum — only swaps chart inputs", () => {
    const state = createInitialState();
    // chart(1, 4) = 5+, then Enchanted Blades -1 mod = 4+.
    let card = withModifierActive(state.toHit, "toHit:fear");
    card = withModifierActive(card, "toHit:enchantedBlades");
    expect(computeToHitTarget(card, "melee")).toBe(4);
  });
});

describe("auto-result override toggles", () => {
  it("toHit:autoHit forces target=auto-pass with probability 1", () => {
    const state = createInitialState();
    const overridden: FullState = {
      ...state,
      toHit: withModifierActive(state.toHit, "toHit:autoHit"),
    };
    const { results, outcome } = computeFullState(overridden);
    expect(results[0]?.target).toBe("auto-pass");
    expect(results[0]?.probability).toBe(1);
    // Hit always succeeds → unsaved-wound chance equals
    // wound × failArmour × failWard at defaults
    // (3/6 wound) × (5/6 failArmour at 6+) × (1 failWard at "no-ward")
    expect(outcome.unsavedWoundChance).toBeCloseTo((3 / 6) * (5 / 6) * 1, 5);
  });

  it("toWound:autoWound forces target=auto-pass with probability 1", () => {
    const state = createInitialState();
    const overridden: FullState = {
      ...state,
      toWound: withModifierActive(state.toWound, "toWound:autoWound"),
    };
    const { results } = computeFullState(overridden);
    expect(results[1]?.target).toBe("auto-pass");
    expect(results[1]?.probability).toBe(1);
  });

  it("armourSave:noSave forces target=no-save with probability 0", () => {
    const state = createInitialState();
    const overridden: FullState = {
      ...state,
      armourSave: withModifierActive(state.armourSave, "armourSave:noSave"),
    };
    const { results } = computeFullState(overridden);
    expect(results[2]?.target).toBe("no-save");
    expect(results[2]?.probability).toBe(0);
  });

  it("wardSave:noWard forces target=no-ward with probability 0", () => {
    const state = createInitialState();
    const overridden: FullState = {
      ...state,
      wardSave: withModifierActive(state.wardSave, "wardSave:noWard"),
    };
    const { results } = computeFullState(overridden);
    expect(results[3]?.target).toBe("no-ward");
    expect(results[3]?.probability).toBe(0);
  });

  it("auto-result overrides numeric modifiers on the same card", () => {
    const state = createInitialState();
    let toHit = withModifierActive(state.toHit, "toHit:autoHit");
    toHit = withModifierActive(toHit, "toHit:phasProtection");
    toHit = withModifierActive(toHit, "toHit:iceshardBlizzard");
    const { results } = computeFullState({ ...state, toHit });
    expect(results[0]?.target).toBe("auto-pass");
    expect(results[0]?.probability).toBe(1);
  });
});

describe("default state outcome", () => {
  it("default required rolls: WS 3 vs 3 → 4+, S 3 vs T 3 → 4+, AS 6+, Ward —", () => {
    const state = createInitialState();
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(4);
    expect(results[1]?.target).toBe(4);
    expect(results[2]?.target).toBe(6);
    expect(results[3]?.target).toBe("no-ward");
  });

  it("unsaved wound probability at defaults: hit × wound × failArmour × failWard", () => {
    const state = createInitialState();
    const p = unsavedWoundProbability(state);
    // (3/6) × (3/6) × (5/6) × 1 = 75/432
    expect(p).toBeCloseTo((3 / 6) * (3 / 6) * (5 / 6) * 1, 5);
  });

  it("'no-ward' base treats ward save as always failed (probability 0)", () => {
    const state = createInitialState();
    const { results } = computeFullState(state);
    expect(results[3]?.target).toBe("no-ward");
    expect(results[3]?.probability).toBe(0);
  });
});

describe("attack mode toggle — shooting branch", () => {
  it("default shooting state: BS 3 → 4+ with 50.0% chance to hit", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(4);
    expect(results[0]?.probability).toBeCloseTo(0.5, 5);
  });

  it("BS 4 → 3+ with 66.7% chance to hit", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.inputs.attackerBS = 4;
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(3);
    expect(results[0]?.probability).toBeCloseTo(4 / 6, 5);
  });

  it("Long Range pushes BS 3 from 4+ to 5+", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:longRange" ? { ...m, active: true } : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(5);
    expect(results[0]?.probability).toBeCloseTo(2 / 6, 5);
  });

  it("Hard Cover (-2) pushes BS 4 from 3+ to 5+", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.inputs.attackerBS = 4;
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:hardCover" ? { ...m, active: true } : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(5);
    expect(results[0]?.probability).toBeCloseTo(2 / 6, 5);
  });

  it("'Hits Automatically' (shooting) bypasses the BS math", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:autoHit" ? { ...m, active: true } : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe("auto-pass");
    expect(results[0]?.probability).toBe(1);
  });

  it("melee modifier active states do NOT bleed into shooting mode", () => {
    // Activate a melee-only To Hit modifier ("Sword of Striking", +1).
    const state = createInitialState();
    state.toHit.modifiers = state.toHit.modifiers.map((m) =>
      m.id === "toHit:swordOfStriking" ? { ...m, active: true } : m,
    );
    // Switch to shooting. Default shooting target should remain 4+ (BS 3)
    // — Sword of Striking is melee-only and is not in modifiersShooting.
    state.attackMode = "shooting";
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(4);
    expect(results[0]?.probability).toBeCloseTo(0.5, 5);
  });

  it("downstream cards read modifiersShooting in shooting mode", () => {
    // Activate Flaming Sword of Rhuin (+1 to wound, dual-mode) ONLY in the
    // shooting modifier state. Pre-Task-6 compute ignores attackMode and reads
    // `state.toWound.modifiers` regardless, so the effect is invisible in
    // shooting — and this assertion FAILS, which is the point of the red phase.
    // Post-Task-6 compute reads `modifiersShooting` in shooting mode, sees the
    // modifier active, and the to-wound chart moves from S=3 vs T=3 (4+) to 3+.
    const state = createInitialState();
    state.toWound.modifiersShooting = state.toWound.modifiersShooting.map(
      (m) =>
        m.id === "toWound:flamingSwordOfRhuin" ? { ...m, active: true } : m,
    );

    // Melee: modifier is OFF in `modifiers` (we only flipped it in
    // `modifiersShooting`), so S=3 vs T=3 → 4+.
    state.attackMode = "melee";
    const melee = computeFullState(state).results;
    expect(melee[1]?.target).toBe(4);

    // Shooting: modifier is ON in `modifiersShooting`. If compute reads the
    // mode-correct array, +1 numeric moves the wound target from 4+ to 3+.
    state.attackMode = "shooting";
    const shooting = computeFullState(state).results;
    expect(shooting[1]?.target).toBe(3);
  });
});

describe("attack mode toggle — shooting cascade & impossible", () => {
  it("raw 7 in shooting → cascade 6 then 4+, P = 1/12", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:customToHitDelta"
        ? { ...m, active: true, value: -3 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(6);
    expect(results[0]?.cascade).toEqual({ first: 6, followUp: 4 });
    expect(results[0]?.probability).toBeCloseTo(1 / 12, 5);
  });

  it("raw 8 in shooting → cascade 6 then 5+, P = 1/18", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:customToHitDelta"
        ? { ...m, active: true, value: -4 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(6);
    expect(results[0]?.cascade).toEqual({ first: 6, followUp: 5 });
    expect(results[0]?.probability).toBeCloseTo(1 / 18, 5);
  });

  it("raw 9 in shooting → cascade 6 then 6+, P = 1/36", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:customToHitDelta"
        ? { ...m, active: true, value: -5 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(6);
    expect(results[0]?.cascade).toEqual({ first: 6, followUp: 6 });
    expect(results[0]?.probability).toBeCloseTo(1 / 36, 5);
  });

  it("raw 10 in shooting → impossible, P = 0", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.inputs.attackerBS = 2;
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:customToHitDelta"
        ? { ...m, active: true, value: -5 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe("impossible");
    expect(results[0]?.cascade).toBeUndefined();
    expect(results[0]?.probability).toBe(0);
  });

  it("raw 11 in shooting → still impossible, P = 0 (caps gracefully)", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.inputs.attackerBS = 1;
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:customToHitDelta"
        ? { ...m, active: true, value: -5 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe("impossible");
    expect(results[0]?.probability).toBe(0);
  });

  it("melee at raw 7+ still clamps to 6+, P = 1/6 (regression)", () => {
    const state = createInitialState();
    state.attackMode = "melee";
    state.toHit.inputs.attackerWS = 1;
    state.toHit.inputs.defenderWS = 4;
    state.toHit.modifiers = state.toHit.modifiers.map((m) =>
      m.id === "toHit:customToHitDelta" ? { ...m, active: true, value: -2 } : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(6);
    expect(results[0]?.cascade).toBeUndefined();
    expect(results[0]?.probability).toBeCloseTo(1 / 6, 5);
  });

  it("auto-hit override (shooting) wins over cascade rules", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) => {
      if (m.id === "toHit:shoot:autoHit") return { ...m, active: true };
      if (m.id === "toHit:shoot:customToHitDelta")
        return { ...m, active: true, value: -4 };
      return m;
    });
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe("auto-pass");
    expect(results[0]?.cascade).toBeUndefined();
    expect(results[0]?.probability).toBe(1);
  });

  it("delta-bs (Miasma -1) on BS 3 → 5+ (was 4+)", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:melkothsMiasma"
        ? { ...m, active: true, value: 1 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(5);
    expect(results[0]?.probability).toBeCloseTo(2 / 6, 5);
  });

  it("delta-bs respects BS-1 minimum (BS 2 with Miasma -3 → effective BS 1 → 6+, not cascade)", () => {
    const state = createInitialState();
    state.attackMode = "shooting";
    state.toHit.inputs.attackerBS = 2;
    state.toHit.modifiersShooting = state.toHit.modifiersShooting.map((m) =>
      m.id === "toHit:shoot:melkothsMiasma"
        ? { ...m, active: true, value: 3 }
        : m,
    );
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(6);
    expect(results[0]?.probability).toBeCloseTo(1 / 6, 5);
    expect(results[0]?.cascade).toBeUndefined();
  });
});

describe("effective WS helpers", () => {
  it("getEffectiveAttackerWS returns base when no WS modifiers are active", () => {
    const state = createInitialState();
    state.toHit.inputs.attackerWS = 4;
    expect(getEffectiveAttackerWS(state.toHit)).toBe(4);
  });

  it("getEffectiveDefenderWS returns base when no WS modifiers are active", () => {
    const state = createInitialState();
    state.toHit.inputs.defenderWS = 5;
    expect(getEffectiveDefenderWS(state.toHit)).toBe(5);
  });

  it("getEffectiveAttackerWS includes delta-ws modifiers (Hand of Glory)", () => {
    const state = createInitialState();
    state.toHit.inputs.attackerWS = 3;
    state.toHit.modifiers = state.toHit.modifiers.map((m) =>
      m.id === "toHit:handOfGlory"
        ? { ...m, active: true, value: 2, target: "attacker" }
        : m,
    );
    expect(getEffectiveAttackerWS(state.toHit)).toBe(5);
  });

  it("getEffectiveDefenderWS includes Fear (force-ws → 1) on defender", () => {
    const state = createInitialState();
    state.toHit.inputs.defenderWS = 6;
    state.toHit.modifiers = state.toHit.modifiers.map((m) =>
      m.id === "toHit:fear" ? { ...m, active: true, target: "defender" } : m,
    );
    expect(getEffectiveDefenderWS(state.toHit)).toBe(1);
  });

  it("matches the value that explainToHitMelee computes internally (regression pin)", () => {
    const state = createInitialState();
    state.toHit.inputs.attackerWS = 3;
    state.toHit.inputs.defenderWS = 3;
    state.toHit.modifiers = state.toHit.modifiers.map((m) => {
      if (m.id === "toHit:handOfGlory")
        return { ...m, active: true, value: 2, target: "attacker" };
      if (m.id === "toHit:swordOfStriking") return { ...m, active: true };
      return m;
    });
    expect(getEffectiveAttackerWS(state.toHit)).toBe(5);
    expect(getEffectiveDefenderWS(state.toHit)).toBe(3);
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(2);
  });
});
