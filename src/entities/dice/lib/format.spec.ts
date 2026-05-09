import { describe, expect, it } from "vitest";
import { formatOutcome, formatProbability, formatTarget } from "./format";

describe("formatTarget", () => {
  it("renders numeric targets as 'X+'", () => {
    expect(formatTarget(1)).toBe("1+");
    expect(formatTarget(2)).toBe("2+");
    expect(formatTarget(6)).toBe("6+");
  });

  it("renders unrollable markers as the em-dash glyph", () => {
    expect(formatTarget("auto-fail")).toBe("—");
    expect(formatTarget("auto-pass")).toBe("—");
    expect(formatTarget("no-save")).toBe("—");
    expect(formatTarget("no-ward")).toBe("—");
  });
});

describe("formatProbability", () => {
  it("formats numeric probabilities with one decimal place", () => {
    expect(formatProbability(0.5, "toHit", 4)).toBe("50.0% chance to hit");
    expect(formatProbability(2 / 3, "toWound", 3)).toBe(
      "66.7% chance to wound",
    );
    expect(formatProbability(1 / 3, "armourSave", 5)).toBe(
      "33.3% chance to save",
    );
    expect(formatProbability(1 / 3, "wardSave", 5)).toBe(
      "33.3% chance to save",
    );
  });

  it("returns boundary copy when target is unrollable", () => {
    expect(formatProbability(0, "toWound", "auto-fail")).toBe("Auto-fail");
    expect(formatProbability(0, "armourSave", "no-save")).toBe("No save");
    expect(formatProbability(0, "wardSave", "no-ward")).toBe("No ward");
    expect(formatProbability(1, "toHit", "auto-pass")).toBe(
      "Hits automatically",
    );
    expect(formatProbability(1, "toWound", "auto-pass")).toBe(
      "Wounds automatically",
    );
  });
});

describe("formatOutcome", () => {
  it("renders the default-state outcome to FR-026 strings", () => {
    const out = formatOutcome({
      unsavedWoundChance: 0.148148,
      expectedUnsavedWounds: 0.148148,
    });
    expect(out.chance).toBe("14.8% Chance of unsaved wound");
    expect(out.expected).toBe("0.148 Expected unsaved wounds");
  });

  it("renders zero outcome cleanly", () => {
    const out = formatOutcome({
      unsavedWoundChance: 0,
      expectedUnsavedWounds: 0,
    });
    expect(out.chance).toBe("0.0% Chance of unsaved wound");
    expect(out.expected).toBe("0.000 Expected unsaved wounds");
  });
});
