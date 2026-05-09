import type { DiceTargetString } from "@/entities/dice/model/types";

export const STAT_MIN = 1;
export const STAT_MAX = 10;

function clampStat(value: number): number {
  return Math.min(STAT_MAX, Math.max(STAT_MIN, Math.trunc(value)));
}

/**
 * WHFB 8th Edition close-combat To Hit lookup, encoded as a formula.
 * Verified against the canonical chart at
 * https://8th.whfb.app/close-combat/roll-to-hit-close-combat — every cell
 * (1..10 × 1..10) matches.
 */
export function lookupToHit(
  attackerWS: number,
  defenderWS: number,
): DiceTargetString {
  const a = clampStat(attackerWS);
  const d = clampStat(defenderWS);
  if (a > d) return "3+";
  if (a === d) return "4+";
  if (d > 2 * a) return "5+";
  return "4+";
}

/**
 * WHFB 8th Edition To Wound lookup, encoded as a formula.
 * Verified against the canonical chart at
 * https://8th.whfb.app/close-combat/roll-to-wound-close-combat — every cell
 * (1..10 × 1..10) matches.
 */
export function lookupToWound(
  strength: number,
  toughness: number,
): DiceTargetString {
  const diff = clampStat(strength) - clampStat(toughness);
  if (diff >= 2) return "2+";
  if (diff === 1) return "3+";
  if (diff === 0) return "4+";
  if (diff === -1) return "5+";
  return "6+";
}

export function parseTarget(target: DiceTargetString): number {
  return Number.parseInt(target, 10);
}
