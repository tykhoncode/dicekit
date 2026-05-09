import type { ModifierConfig, ModifierId } from "@/entities/dice/model/types";

export const MODIFIER_CONFIGS: readonly ModifierConfig[] = [
  // ── To Hit ──────────────────────────────────────────────────────────────
  // General (uncategorized — rendered above collapsible groups)
  {
    id: "toHit:autoHit",
    card: "toHit",
    label: "Hits Automatically",
    effect: { kind: "auto-result", value: "pass" },
    category: "general",
  },
  {
    id: "toHit:fear",
    card: "toHit",
    label: "Fear (Failed Test)",
    effect: { kind: "force-ws", target: "attacker", value: 1 },
    category: "general",
    postPhase: true,
  },

  // Spells
  {
    id: "toHit:speedOfLight",
    card: "toHit",
    label: "Speed of Light",
    effect: { kind: "force-ws", target: "attacker", value: 10 },
    category: "spell",
    prePhase: true,
  },
  {
    id: "toHit:handOfGlory",
    card: "toHit",
    label: "Hand of Glory",
    effect: { kind: "delta-ws", target: "attacker", sign: 1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toHit:melkothsMiasma",
    card: "toHit",
    label: "Melkoth's Miasma",
    effect: { kind: "delta-ws", target: "attacker", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toHit:wordOfPain",
    card: "toHit",
    label: "Word of Pain",
    effect: { kind: "delta-ws", target: "attacker", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toHit:miasmaOfPestilence",
    card: "toHit",
    label: "Miasma of Pestilence",
    effect: { kind: "delta-ws", target: "attacker", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toHit:transmutationOfLead",
    card: "toHit",
    label: "Transmutation of Lead",
    effect: { kind: "delta-ws", target: "attacker", sign: -1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toHit:blissInTorment",
    card: "toHit",
    label: "Bliss in Torment",
    effect: { kind: "delta-ws", target: "attacker", sign: 1 },
    variableValue: { min: 1, max: 10, default: 1 },
    category: "spell",
  },
  {
    id: "toHit:enchantedBlades",
    card: "toHit",
    label: "Enchanted Blades of Aiban",
    effect: { kind: "numeric", value: 1 },
    category: "spell",
  },
  {
    id: "toHit:phasProtection",
    card: "toHit",
    label: "Pha's Protection",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },
  {
    id: "toHit:iceshardBlizzard",
    card: "toHit",
    label: "Iceshard Blizzard",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },
  {
    id: "toHit:tempest",
    card: "toHit",
    label: "Tempest",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },
  {
    id: "toHit:ashStorm",
    card: "toHit",
    label: "Ash Storm",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },
  {
    id: "toHit:curseOfAnraheir",
    card: "toHit",
    label: "The Curse of Anraheir",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },

  // BRB Artifacts
  {
    id: "toHit:swordOfStriking",
    card: "toHit",
    label: "Sword of Striking",
    effect: { kind: "numeric", value: 1 },
    category: "brb-artifact",
  },
  {
    id: "toHit:glitteringScales",
    card: "toHit",
    label: "Glittering Scales",
    effect: { kind: "numeric", value: -1 },
    category: "brb-artifact",
  },

  // Special Rules — Beastmen
  {
    id: "toHit:runeOfTheTrueBeast",
    card: "toHit",
    label: "Rune of the True Beast",
    effect: { kind: "numeric", value: -1 },
    category: "race-artifact",
    race: "Beastmen",
    tooltip: "Gift of Chaos — enemies hit the bearer at -1.",
  },

  // Special Rules — Beastmen (race-ability)
  {
    id: "toHit:sonsOfGhorros",
    card: "toHit",
    label: "The Sons of Ghorros",
    effect: { kind: "delta-ws", target: "attacker", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Beastmen",
  },

  // Special Rules — Bretonnia (race-ability)
  {
    id: "toHit:trialOfBlades",
    card: "toHit",
    label: "The Trial of Blades",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Bretonnia",
    tooltip: "Only if the enemy has a higher WS or S.",
  },

  // Special Rules — Tomb Kings (race-ability)
  {
    id: "toHit:stolenCrowns",
    card: "toHit",
    label: "The Stolen Crowns",
    effect: { kind: "delta-ws", target: "attacker", sign: 1, magnitude: 2 },
    category: "race-ability",
    race: "Tomb Kings",
  },

  // Special Rules — Bretonnia
  {
    id: "toHit:tressOfIsoulde",
    card: "toHit",
    label: "Tress of Isoulde",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Bretonnia",
    tooltip: "One use only — nominate one enemy unit/character.",
  },
  {
    id: "toHit:armourOfMidsummerSun",
    card: "toHit",
    label: "Armour of the Midsummer Sun",
    effect: { kind: "numeric", value: -1 },
    category: "race-artifact",
    race: "Bretonnia",
    tooltip: "Only for the wearer and his mount.",
  },

  // Special Rules — Daemons of Chaos
  {
    id: "toHit:daemonsOfNurgle",
    card: "toHit",
    label: "Daemons of Nurgle",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },

  // Special Rules — Dark Elves
  {
    id: "toHit:enchantingBeauty",
    card: "toHit",
    label: "Enchanting Beauty",
    effect: { kind: "delta-ws", target: "attacker", sign: -1, magnitude: 5 },
    category: "race-ability",
    race: "Dark Elves",
    tooltip: "Does not affect units immune to psychology.",
    postPhase: true,
  },

  // Special Rules — Dwarfs (race-artifact runes + race-ability)
  {
    id: "toHit:masterRuneSnorri",
    card: "toHit",
    label: "Master Rune of Snorri Spangelhelm",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "toHit:runeOfStriking",
    card: "toHit",
    label: "Rune of Striking (1/2)",
    effect: { kind: "delta-ws", target: "attacker", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "toHit:runeOfStrikingX3",
    card: "toHit",
    label: "Rune of Striking (×3)",
    effect: { kind: "force-ws", target: "attacker", value: 10 },
    category: "race-artifact",
    race: "Dwarfs",
    prePhase: true,
  },
  {
    id: "toHit:runeOfDaemonSlaying",
    card: "toHit",
    label: "Rune of Daemon Slaying (×1/×2)",
    effect: { kind: "numeric", value: 1 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Only against Daemons.",
  },
  {
    id: "toHit:runeOfDaemonSlayingX3",
    card: "toHit",
    label: "Rune of Daemon Slaying (×3)",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Only against Daemons.",
  },
  {
    id: "toHit:grudgeRune",
    card: "toHit",
    label: "Grudge Rune",
    effect: { kind: "numeric", value: 1 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Only against the nominated character or monster.",
  },
  {
    id: "toHit:runeOfParrying",
    card: "toHit",
    label: "Rune of Parrying",
    effect: { kind: "numeric", value: -1 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Only against the wielder of the rune.",
  },
  {
    id: "toHit:entrenchment",
    card: "toHit",
    label: "Entrenchment",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Dwarfs",
  },

  // Special Rules — Empire
  {
    id: "toHit:whiteCloakOfUlric",
    card: "toHit",
    label: "White Cloak of Ulric",
    effect: { kind: "numeric", value: -1 },
    category: "race-artifact",
    race: "Empire",
  },
  {
    id: "toHit:portentsOfBattle",
    card: "toHit",
    label: "Portents of Battle",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Empire",
  },

  // Special Rules — High Elves
  {
    id: "toHit:hornOfIsha",
    card: "toHit",
    label: "Horn of Isha",
    effect: { kind: "numeric", value: 1 },
    category: "race-artifact",
    race: "High Elves",
  },
  {
    id: "toHit:bloodOath",
    card: "toHit",
    label: "Blood Oath",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "High Elves",
    tooltip: "Only against Grom the Paunch.",
  },

  // Special Rules — Skaven
  {
    id: "toHit:flailingFists",
    card: "toHit",
    label: "Flailing Fists",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Skaven",
  },

  // Special Rules — Vampire Counts
  {
    id: "toHit:bannerOfTheBarrows",
    card: "toHit",
    label: "Banner of the Barrows",
    effect: { kind: "numeric", value: 1 },
    category: "race-artifact",
    race: "Vampire Counts",
  },
  {
    id: "toHit:battleOfWills",
    card: "toHit",
    label: "Battle of Wills",
    effect: { kind: "delta-ws", target: "attacker", sign: -1, magnitude: 1 },
    category: "race-ability",
    race: "Vampire Counts",
  },
  {
    id: "toHit:swarmOfFlies",
    card: "toHit",
    label: "Swarm of Flies",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Vampire Counts",
  },

  // Special Rules — Warriors of Chaos
  {
    id: "toHit:markOfNurgle",
    card: "toHit",
    label: "Mark of Nurgle",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },

  // Special Rules — Wood Elves
  {
    id: "toHit:helmOfTheHunt",
    card: "toHit",
    label: "Helm of the Hunt (on charge)",
    effect: { kind: "delta-ws", target: "attacker", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Wood Elves",
    noTargetSwitch: true,
  },

  // Terrain
  {
    id: "toHit:fenceWall",
    card: "toHit",
    label: "Fence/Wall (on charge)",
    effect: { kind: "numeric", value: -1 },
    category: "terrain",
  },
  {
    id: "toHit:acropolisOfHeroes",
    card: "toHit",
    label: "Acropolis of Heroes",
    effect: { kind: "numeric", value: 1 },
    category: "terrain",
  },

  // ── To Wound ────────────────────────────────────────────────────────────
  {
    id: "toWound:autoWound",
    card: "toWound",
    label: "Wounds Automatically",
    effect: { kind: "auto-result", value: "pass" },
    category: "general",
  },
  {
    id: "toWound:greatWeapon",
    card: "toWound",
    label: "Great Weapon (+2 Strength)",
    effect: { kind: "numeric", value: 2 },
    category: "general",
  },
  {
    id: "toWound:halberd",
    card: "toWound",
    label: "Halberd (+1 Strength)",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },
  {
    id: "toWound:lance",
    card: "toWound",
    label: "Lance (on charge)",
    effect: { kind: "numeric", value: 2 },
    category: "general",
  },
  {
    id: "toWound:strengthBuff",
    card: "toWound",
    label: "Strength Buff (+1)",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },
  {
    id: "toWound:strengthDebuff",
    card: "toWound",
    label: "Strength Debuff (-1)",
    effect: { kind: "numeric", value: -1 },
    category: "general",
  },
  {
    id: "toWound:wyssans",
    card: "toWound",
    label: "Wyssan's / Blessing (+1 Strength)",
    effect: { kind: "numeric", value: 1 },
    category: "spell",
  },
  {
    id: "toWound:curseHex",
    card: "toWound",
    label: "Curse / Hex (-1 Strength)",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },

  // ── Armour Save ─────────────────────────────────────────────────────────
  {
    id: "armourSave:noSave",
    card: "armourSave",
    label: "No Armour Save Allowed",
    effect: { kind: "auto-result", value: "fail" },
    category: "general",
  },
  {
    id: "armourSave:shield",
    card: "armourSave",
    label: "Shield Bonus",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },
  {
    id: "armourSave:mounted",
    card: "armourSave",
    label: "Mounted Bonus",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },
  {
    id: "armourSave:armourPiercing",
    card: "armourSave",
    label: "Armour Piercing",
    effect: { kind: "numeric", value: -1 },
    category: "general",
  },
  {
    id: "armourSave:cover",
    card: "armourSave",
    label: "Cover Bonus (shooting)",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },

  // ── Ward Save ───────────────────────────────────────────────────────────
  {
    id: "wardSave:noWard",
    card: "wardSave",
    label: "No Saves Allowed",
    effect: { kind: "auto-result", value: "fail" },
    category: "general",
  },
  {
    id: "wardSave:magicResistance",
    card: "wardSave",
    label: "Magic Resistance (+ward vs spells)",
    effect: { kind: "numeric", value: 1 },
    category: "general",
  },
  {
    id: "wardSave:parry",
    card: "wardSave",
    label: "Parry Ward (6++)",
    effect: { kind: "replace-ward", value: 6 },
    category: "general",
  },
  {
    id: "wardSave:improvedWard",
    card: "wardSave",
    label: "Improved Ward (+1)",
    effect: { kind: "numeric", value: 1 },
    category: "general",
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

/** Sort key within a group: force-ws (ws=) → delta-ws (ws+/-) → numeric+ → numeric-. */
export function modifierSortKey(config: ModifierConfig): number {
  const kind = config.effect.kind;
  if (kind === "force-ws") return 0;
  if (kind === "delta-ws") return 1;
  if (kind === "force-target") return 2;
  if (kind === "numeric") return config.effect.value >= 0 ? 3 : 4;
  if (kind === "auto-result") return 5;
  if (kind === "replace-ward") return 6;
  return 7;
}
