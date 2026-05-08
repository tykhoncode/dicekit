import type { DiceTargetString } from "@/entities/dice/model/types";

export const TO_HIT_CHART = [
  ["4+", "4+", "5+", "5+", "5+", "5+", "5+", "5+", "5+", "5+"],
  ["3+", "4+", "4+", "4+", "5+", "5+", "5+", "5+", "5+", "5+"],
  ["3+", "3+", "4+", "4+", "4+", "4+", "5+", "5+", "5+", "5+"],
  ["3+", "3+", "3+", "4+", "4+", "4+", "4+", "4+", "5+", "5+"],
  ["3+", "3+", "3+", "3+", "4+", "4+", "4+", "4+", "4+", "4+"],
  ["3+", "3+", "3+", "3+", "3+", "4+", "4+", "4+", "4+", "4+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+", "4+", "4+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+", "4+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "3+", "3+", "4+", "4+"],
  ["3+", "3+", "3+", "3+", "3+", "3+", "3+", "3+", "3+", "4+"],
] as const satisfies readonly (readonly DiceTargetString[])[];

export const TO_WOUND_CHART = [
  ["4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+", "6+", "6+"],
  ["3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+", "6+"],
  ["2+", "3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+", "6+"],
  ["2+", "2+", "3+", "4+", "5+", "6+", "6+", "6+", "6+", "6+"],
  ["2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+", "6+", "6+"],
  ["2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+", "6+"],
  ["2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+", "6+"],
  ["2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+", "6+"],
  ["2+", "2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+", "5+"],
  ["2+", "2+", "2+", "2+", "2+", "2+", "2+", "2+", "3+", "4+"],
] as const satisfies readonly (readonly DiceTargetString[])[];

export const STAT_MIN = 1;
export const STAT_MAX = 10;

function clampStat(value: number): number {
  return Math.min(STAT_MAX, Math.max(STAT_MIN, Math.trunc(value)));
}

export function lookupToHit(
  attackerWS: number,
  defenderWS: number,
): DiceTargetString {
  const row = TO_HIT_CHART[clampStat(attackerWS) - 1];
  const cell = row?.[clampStat(defenderWS) - 1];
  return cell ?? "4+";
}

export function lookupToWound(
  strength: number,
  toughness: number,
): DiceTargetString {
  const row = TO_WOUND_CHART[clampStat(strength) - 1];
  const cell = row?.[clampStat(toughness) - 1];
  return cell ?? "4+";
}

export function parseTarget(target: DiceTargetString): number {
  return Number.parseInt(target, 10);
}
