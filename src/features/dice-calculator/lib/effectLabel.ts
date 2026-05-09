import type { ModifierEffect } from "@/entities/dice/model/types";

type LabelOpts = {
  target?: "attacker" | "defender" | "both";
  valueDef?: number;
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
  if (effect.kind === "force-ws") return `WS ${effect.value}`;
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
  if (effect.kind === "force-target") return `${effect.value}+`;
  return signed(effect.value);
}
