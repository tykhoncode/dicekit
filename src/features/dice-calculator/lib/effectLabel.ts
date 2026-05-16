import type { ModifierEffect } from "@/entities/dice/model/types";

type LabelOpts = {
  target?: "attacker" | "defender" | "both";
  valueDef?: number;
  /** Lower bound of the modifier's variableValue range, when one is
   *  set. < 0 means the stepper carries a signed value (e.g. Custom
   *  ±To Hit). Otherwise it's a magnitude that gets multiplied by
   *  effect.value's sign (e.g. Plague of Rust). */
  variableMin?: number;
};

function signed(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function effectLabel(
  effect: ModifierEffect,
  value?: number,
  opts?: LabelOpts,
): string {
  if (effect.kind === "replace-ward") return `${effect.value}++`;
  if (effect.kind === "auto-result") return "Auto";
  if (effect.kind === "force-ws") return `WS ${value ?? effect.value}`;
  if (effect.kind === "delta-ws") {
    const target = opts?.target ?? effect.target;
    const mag = effect.magnitude;
    if (mag !== undefined) {
      const v = effect.sign * mag;
      return target === "both"
        ? `${signed(v)}/${signed(v)} WS`
        : `${signed(v)} WS`;
    }
    if (target === "both") {
      const a = effect.sign * (value ?? 1);
      const d = effect.sign * (opts?.valueDef ?? 1);
      return `${signed(a)}/${signed(d)} WS`;
    }
    return `${signed(effect.sign * (value ?? 1))} WS`;
  }
  if (effect.kind === "delta-bs") {
    const mag = effect.magnitude;
    if (mag !== undefined) {
      return `BS ${signed(effect.sign * mag)}`;
    }
    return `BS ${signed(effect.sign * (value ?? 1))}`;
  }
  if (effect.kind === "force-target") return `${value ?? effect.value}+`;
  if (effect.kind === "delta-stat") {
    const target = opts?.target ?? "attacker";
    const mag = effect.magnitude;
    const valueAtk = mag ?? value ?? 1;
    const valueDef = mag ?? opts?.valueDef ?? value ?? 1;
    const stat = effect.stat;
    if (stat === "S") return `${signed(effect.sign * valueAtk)} S`;
    if (stat === "T") return `${signed(effect.sign * valueAtk)} T`;
    // stat === "both"
    if (target === "both") {
      return `${signed(effect.sign * valueAtk)} S / ${signed(effect.sign * valueDef)} T`;
    }
    return target === "attacker"
      ? `${signed(effect.sign * valueAtk)} S`
      : `${signed(effect.sign * valueAtk)} T`;
  }
  // numeric
  if (value === undefined) return signed(effect.value);
  const variableMin = opts?.variableMin ?? 0;
  const contribution = variableMin < 0 ? value : effect.value * value;
  return signed(contribution);
}
