import type { ModifierConfig, ModifierId } from "@/entities/dice/model/types";

export const MODIFIER_CONFIGS: readonly ModifierConfig[] = [
  {
    id: "toHit:fear",
    card: "toHit",
    label: "Fear (failed test)",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:higherGround",
    card: "toHit",
    label: "Higher Ground",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "toHit:charging",
    card: "toHit",
    label: "Charging",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "toHit:hardToHit",
    card: "toHit",
    label: "Enemy Hard to Hit",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:spellHex",
    card: "toHit",
    label: "Spell / Hex (to hit)",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:cover",
    card: "toHit",
    label: "Cover / Shooting Modifier",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:multipleShots",
    card: "toHit",
    label: "Multiple Shots Penalty",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:longRange",
    card: "toHit",
    label: "Long Range Penalty",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toHit:standAndShoot",
    card: "toHit",
    label: "Stand & Shoot Reaction",
    effect: { kind: "numeric", value: -1 },
  },

  {
    id: "toWound:greatWeapon",
    card: "toWound",
    label: "Great Weapon (+2 Strength)",
    effect: { kind: "numeric", value: 2 },
  },
  {
    id: "toWound:halberd",
    card: "toWound",
    label: "Halberd (+1 Strength)",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "toWound:lance",
    card: "toWound",
    label: "Lance (on charge)",
    effect: { kind: "numeric", value: 2 },
  },
  {
    id: "toWound:strengthBuff",
    card: "toWound",
    label: "Strength Buff (+1)",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "toWound:strengthDebuff",
    card: "toWound",
    label: "Strength Debuff (-1)",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "toWound:wyssans",
    card: "toWound",
    label: "Wyssan's / Blessing (+1 Strength)",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "toWound:curseHex",
    card: "toWound",
    label: "Curse / Hex (-1 Strength)",
    effect: { kind: "numeric", value: -1 },
  },

  {
    id: "armourSave:shield",
    card: "armourSave",
    label: "Shield Bonus",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "armourSave:mounted",
    card: "armourSave",
    label: "Mounted Bonus",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "armourSave:armourPiercing",
    card: "armourSave",
    label: "Armour Piercing",
    effect: { kind: "numeric", value: -1 },
  },
  {
    id: "armourSave:cover",
    card: "armourSave",
    label: "Cover Bonus (shooting)",
    effect: { kind: "numeric", value: 1 },
  },

  {
    id: "wardSave:magicResistance",
    card: "wardSave",
    label: "Magic Resistance (+ward vs spells)",
    effect: { kind: "numeric", value: 1 },
  },
  {
    id: "wardSave:parry",
    card: "wardSave",
    label: "Parry Ward (6++)",
    effect: { kind: "replace-ward", value: 6 },
  },
  {
    id: "wardSave:improvedWard",
    card: "wardSave",
    label: "Improved Ward (+1)",
    effect: { kind: "numeric", value: 1 },
  },
];

const STRENGTH_SOURCE_MODIFIER_IDS: ReadonlySet<ModifierId> = new Set([
  "toWound:greatWeapon",
  "toWound:halberd",
  "toWound:lance",
  "toWound:strengthBuff",
  "toWound:strengthDebuff",
  "toWound:wyssans",
  "toWound:curseHex",
]);

export function isStrengthSourceModifier(id: ModifierId): boolean {
  return STRENGTH_SOURCE_MODIFIER_IDS.has(id);
}
