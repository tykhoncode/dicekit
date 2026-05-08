import type { ModifierEffect } from "@/entities/dice/model/types";

export function effectLabel(effect: ModifierEffect): string {
  if (effect.kind === "replace-ward") return `${effect.value}++`;
  const sign = effect.value >= 0 ? "+" : "";
  return `${sign}${effect.value}`;
}
