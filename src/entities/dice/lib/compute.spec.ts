import { describe, expect, it } from "vitest";
import {
  chanceFromTarget,
  clampAndFormat,
  computeArmourSaveTarget,
  computeFullState,
  computeToHitTarget,
  computeToWoundTarget,
  computeWardSaveTarget,
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
    const raw = computeArmourSaveTarget(ap, 0);
    expect(raw).toBe(3);
  });

  it("5+ AS with +1 modifier becomes 4+", () => {
    const state = createInitialState();
    const shielded = withModifierActive(
      { ...state.armourSave, inputs: { baseTarget: 5 as const } },
      "armourSave:shield",
    );
    const raw = computeArmourSaveTarget(shielded, 0);
    expect(raw).toBe(4);
  });
});

describe("Strength → AS penalty (FR-018a)", () => {
  it("S ≤ 3 yields no penalty", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 1)).toBe(4);
    expect(computeArmourSaveTarget(as, 3)).toBe(4);
  });

  it("S4 yields -1 penalty (raises target by 1)", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 4)).toBe(5);
  });

  it("S10 yields -7 penalty (raises target by 7)", () => {
    const state = createInitialState();
    const as = { ...state.armourSave, inputs: { baseTarget: 4 as const } };
    expect(computeArmourSaveTarget(as, 10)).toBe(11);
  });
});

describe("FR-T02 no-double-count rule", () => {
  it("S=4 / T=4 + Halberd active → effective S=5, target 3+ (not 2+)", () => {
    const state = createInitialState();
    const card = withModifierActive(
      { ...state.toWound, inputs: { strength: 4, toughness: 4 } },
      "toWound:halberd",
    );
    expect(getEffectiveStrength(card)).toBe(5);
    expect(computeToWoundTarget(card)).toBe(3);
  });

  it("S=4 / T=3 + Great Weapon active → effective S=6, target 2+", () => {
    const state = createInitialState();
    const card = withModifierActive(
      { ...state.toWound, inputs: { strength: 4, toughness: 3 } },
      "toWound:greatWeapon",
    );
    expect(getEffectiveStrength(card)).toBe(6);
    expect(computeToWoundTarget(card)).toBe(2);
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
    expect(computeWardSaveTarget(ward)).toBe(5);
  });
});

describe("clampAndFormat (FR-T05 boundary handling)", () => {
  it("target ≤ 1 clamps to 1+ with probability 5/6", () => {
    const out = clampAndFormat(0, "toHit");
    expect(out.target).toBe(1);
    expect(out.probability).toBeCloseTo(5 / 6, 5);
  });

  it("target ≥ 7 returns no-save for armourSave", () => {
    const out = clampAndFormat(8, "armourSave");
    expect(out.target).toBe("no-save");
    expect(out.probability).toBe(0);
  });

  it("target ≥ 7 returns no-ward for wardSave", () => {
    const out = clampAndFormat(7, "wardSave");
    expect(out.target).toBe("no-ward");
    expect(out.probability).toBe(0);
  });

  it("target ≥ 7 returns auto-fail for toHit / toWound", () => {
    expect(clampAndFormat(7, "toHit").target).toBe("auto-fail");
    expect(clampAndFormat(9, "toWound").target).toBe("auto-fail");
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
    expect(computeToHitTarget(state.toHit)).toBe(4);
  });

  it("WS 4 v 4 + Charging → 3+", () => {
    const state = createInitialState();
    const charging = withModifierActive(state.toHit, "toHit:charging");
    expect(computeToHitTarget(charging)).toBe(3);
  });

  it("WS 4 v 4 + Hard to Hit → 5+", () => {
    const state = createInitialState();
    const hard = withModifierActive(state.toHit, "toHit:hardToHit");
    expect(computeToHitTarget(hard)).toBe(5);
  });
});

describe("default state outcome (FR-026)", () => {
  it("unsaved wound probability ≈ 0.148 at defaults", () => {
    const state = createInitialState();
    const p = unsavedWoundProbability(state);
    expect(p).toBeCloseTo(0.1481, 3);
  });

  it("default required rolls match FR-013/016/019/022", () => {
    const state = createInitialState();
    const { results } = computeFullState(state);
    expect(results[0]?.target).toBe(4);
    expect(results[1]?.target).toBe(3);
    expect(results[2]?.target).toBe(5);
    expect(results[3]?.target).toBe(5);
  });
});
