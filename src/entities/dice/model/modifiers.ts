import type { ModifierConfig } from "@/entities/dice/model/types";

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

  // Custom (user-driven steppers)
  {
    id: "toHit:customWs",
    card: "toHit",
    label: "Custom WS",
    effect: { kind: "force-ws", target: "attacker", value: 1 },
    variableValue: { min: 1, max: 10, default: 1 },
    category: "custom",
  },
  {
    id: "toHit:customWsDelta",
    card: "toHit",
    label: "Custom ±WS",
    effect: { kind: "delta-ws", target: "attacker", sign: 1 },
    variableValue: { min: -10, max: 10, default: 0 },
    category: "custom",
  },
  {
    id: "toHit:customToHitDelta",
    card: "toHit",
    label: "Custom ±To Hit",
    effect: { kind: "numeric", value: 0 },
    variableValue: { min: -5, max: 5, default: 0 },
    category: "custom",
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
  // General
  {
    id: "toWound:autoWound",
    card: "toWound",
    label: "Wounds Automatically",
    effect: { kind: "auto-result", value: "pass" },
    category: "general",
  },

  // Spells (flat list — sorted alphabetically in the UI)
  {
    id: "toWound:wyssansWildform",
    card: "toWound",
    label: "Wyssan's Wildform",
    effect: { kind: "delta-stat", stat: "both", sign: 1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:savageBeastOfHorros",
    card: "toWound",
    label: "Savage Beast of Horros",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 3 },
    category: "spell",
  },
  {
    id: "toWound:pannsImpenetrablePelt",
    card: "toWound",
    label: "Pann's Impenetrable Pelt",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 3 },
    category: "spell",
  },
  {
    id: "toWound:fleshToStone",
    card: "toWound",
    label: "Flesh to Stone",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 2 },
    category: "spell",
  },
  {
    id: "toWound:fleshToStoneThrone",
    card: "toWound",
    label: "Flesh to Stone + Throne",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 4 },
    category: "spell",
  },
  {
    id: "toWound:enfeeblingFoe",
    card: "toWound",
    label: "The Enfeebling Foe",
    effect: { kind: "delta-stat", stat: "S", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:withering",
    card: "toWound",
    label: "The Withering",
    effect: { kind: "delta-stat", stat: "T", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:soulblight",
    card: "toWound",
    label: "Soulblight",
    effect: { kind: "delta-stat", stat: "both", sign: -1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:flamingSwordOfRhuin",
    card: "toWound",
    label: "Flaming Sword of Rhuin",
    effect: { kind: "numeric", value: 1 },
    category: "spell",
  },
  {
    id: "toWound:okkamsMindrazor",
    card: "toWound",
    label: "Okkam's Mindrazor",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 4 },
    category: "spell",
    tooltip: "Use Ld as S — close combat only.",
  },
  {
    id: "toWound:powerOfDarkness",
    card: "toWound",
    label: "Power of Darkness",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:wordOfPainBoosted",
    card: "toWound",
    label: "Word of Pain (boosted)",
    effect: { kind: "delta-stat", stat: "S", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:desiccation",
    card: "toWound",
    label: "Desiccation",
    effect: { kind: "delta-stat", stat: "both", sign: -1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:desiccationBoosted",
    card: "toWound",
    label: "Desiccation (boosted)",
    effect: { kind: "delta-stat", stat: "both", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:curseOfLeperFriendly",
    card: "toWound",
    label: "Curse of the Leper (friendly)",
    effect: { kind: "delta-stat", stat: "T", sign: 1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:curseOfLeperEnemy",
    card: "toWound",
    label: "Curse of the Leper (enemy)",
    effect: { kind: "delta-stat", stat: "T", sign: -1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:bullgorger",
    card: "toWound",
    label: "Bullgorger",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:toothcracker",
    card: "toWound",
    label: "Toothcracker",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:fistsOfGork",
    card: "toWound",
    label: "Fists of Gork",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 3 },
    category: "spell",
  },
  {
    id: "toWound:powerOfDaWaaagh",
    card: "toWound",
    label: "Power of da Waaagh! active",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "spell",
  },
  {
    id: "toWound:mantleOfGhorok",
    card: "toWound",
    label: "Mantle of Ghorok",
    effect: { kind: "delta-stat", stat: "S", sign: 1 },
    variableValue: { min: 1, max: 6, default: 1 },
    category: "spell",
  },
  {
    id: "toWound:wither",
    card: "toWound",
    label: "Wither",
    effect: { kind: "delta-stat", stat: "T", sign: -1, magnitude: 1 },
    category: "spell",
    tooltip: "Permanent.",
  },

  // Army & Unit Rules — High Elves
  {
    id: "toWound:blizzardAura",
    card: "toWound",
    label: "Blizzard Aura",
    effect: { kind: "delta-stat", stat: "S", sign: -1, magnitude: 1 },
    category: "race-ability",
    race: "High Elves",
    tooltip: "Enemy in melee with the bearer is at -1 S.",
  },
  {
    id: "toWound:attunedToMagic",
    card: "toWound",
    label: "Attuned to Magic",
    effect: { kind: "delta-stat", stat: "S", sign: 1 },
    variableValue: { min: -1, max: 1, default: 1 },
    category: "race-ability",
    race: "High Elves",
    tooltip: "+1 S when channelling, -1 S when drained.",
  },

  // Army & Unit Rules — Orcs & Goblins
  {
    id: "toWound:netters",
    card: "toWound",
    label: "Netters",
    effect: { kind: "delta-stat", stat: "S", sign: -1, magnitude: 1 },
    category: "race-ability",
    race: "Orcs & Goblins",
  },
  {
    id: "toWound:tuskerCharge",
    card: "toWound",
    label: "Tusker Charge (on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 2 },
    category: "race-ability",
    race: "Orcs & Goblins",
  },

  // Army & Unit Rules — Dwarfs
  {
    id: "toWound:resolute",
    card: "toWound",
    label: "Resolute (on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Dwarfs",
  },
  {
    id: "toWound:liquidFortification",
    card: "toWound",
    label: "Liquid Fortification",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Dwarfs",
  },

  // Army & Unit Rules — Beastmen
  {
    id: "toWound:thunderousCharge",
    card: "toWound",
    label: "Thunderous Charge (on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Beastmen",
  },

  // Army & Unit Rules — Warriors of Chaos
  {
    id: "toWound:murderousCharge",
    card: "toWound",
    label: "Murderous Charge (on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },
  {
    id: "toWound:eyeSlaughterersStr",
    card: "toWound",
    label: "Eye of the Gods: Slaughterer's Str",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },
  {
    id: "toWound:eyeUnholyResilience",
    card: "toWound",
    label: "Eye of the Gods: Unholy Resilience",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },

  // Army & Unit Rules — Daemons of Chaos
  {
    id: "toWound:tallyPestilence7",
    card: "toWound",
    label: "Tally of Pestilence 7+",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },
  {
    id: "toWound:tallyPestilence14",
    card: "toWound",
    label: "Tally of Pestilence 14+",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },

  // Army & Unit Rules — Empire
  {
    id: "toWound:endIsNigh",
    card: "toWound",
    label: "The End is Nigh!",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-ability",
    race: "Empire",
  },

  // Army & Unit Rules — Dark Elves
  {
    id: "toWound:manbane",
    card: "toWound",
    label: "Manbane",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Dark Elves",
  },
  {
    id: "toWound:trialOfBladesDe",
    card: "toWound",
    label: "Trial of Blades",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Dark Elves",
  },

  // Army & Unit Rules — Wood Elves
  {
    id: "toWound:sistersOfTwilight",
    card: "toWound",
    label: "Sisters of Twilight",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Wood Elves",
  },

  // Army & Unit Rules — Skaven
  {
    id: "toWound:trophyHeads",
    card: "toWound",
    label: "Trophy Heads",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Skaven",
  },

  // Army & Unit Rules — Lizardmen
  {
    id: "toWound:thunderousBludgeon",
    card: "toWound",
    label: "Thunderous Bludgeon",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 7 },
    category: "race-ability",
    race: "Lizardmen",
    tooltip: "Hits at S 10 (assumes base S ≈ 3 — adjust ±S for other bases).",
  },

  // Magic Items & Upgrades — Core Rulebook (BRB)
  {
    id: "toWound:potionOfStrength",
    card: "toWound",
    label: "Potion of Strength",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 3 },
    category: "brb-artifact",
  },
  {
    id: "toWound:potionOfToughness",
    card: "toWound",
    label: "Potion of Toughness",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 3 },
    category: "brb-artifact",
  },

  // Magic Items & Upgrades — Dwarfs
  {
    id: "toWound:masterRuneOfAdamant",
    card: "toWound",
    label: "Master Rune of Adamant",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 7 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Bearer is treated as T 10.",
  },
  {
    id: "toWound:runeOfFortitude",
    card: "toWound",
    label: "Rune of Fortitude",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "toWound:runeOfIronX2",
    card: "toWound",
    label: "Rune of Iron ×2",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "toWound:runeOfIronX3",
    card: "toWound",
    label: "Rune of Iron ×3",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Dwarfs",
  },

  // Magic Items & Upgrades — Lizardmen
  {
    id: "toWound:sacredStegadonHelm",
    card: "toWound",
    label: "Sacred Stegadon Helm",
    effect: { kind: "delta-stat", stat: "T", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Lizardmen",
  },

  // Magic Items & Upgrades — Vampire Counts
  {
    id: "toWound:nightshroud",
    card: "toWound",
    label: "Nightshroud",
    effect: { kind: "delta-stat", stat: "S", sign: -1, magnitude: 1 },
    category: "race-artifact",
    race: "Vampire Counts",
    tooltip: "Removes the enemy's weapon Strength bonus.",
  },

  // Magic Items & Upgrades — Bretonnia legacy
  {
    id: "toWound:rubyGoblet",
    card: "toWound",
    label: "Ruby Goblet",
    effect: { kind: "force-target", value: 3 },
    category: "race-artifact",
    race: "Bretonnia",
    tooltip: "Bearer cannot be wounded better than 3+.",
  },
  {
    id: "toWound:maneOfPurebreed",
    card: "toWound",
    label: "Mane of the Purebreed",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-artifact",
    race: "Bretonnia",
    tooltip: "+1 S to warhorses on the first charge.",
  },

  // Weapons — Core Rulebook (BRB)
  {
    id: "toWound:spearMounted",
    card: "toWound",
    label: "Spear (mounted, on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "brb-weapon",
  },
  {
    id: "toWound:lance",
    card: "toWound",
    label: "Lance (on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 2 },
    category: "brb-weapon",
  },
  {
    id: "toWound:halberd",
    card: "toWound",
    label: "Halberd",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "brb-weapon",
  },
  {
    id: "toWound:greatWeapon",
    card: "toWound",
    label: "Great Weapon",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 2 },
    category: "brb-weapon",
  },
  {
    id: "toWound:flail",
    card: "toWound",
    label: "Flail (first combat round)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 2 },
    category: "brb-weapon",
  },
  {
    id: "toWound:morningStar",
    card: "toWound",
    label: "Morning Star (first combat round)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "brb-weapon",
  },

  // Weapons — Chaos Dwarfs / Legion of Azgorh
  {
    id: "toWound:ensorcelledHandWeapon",
    card: "toWound",
    label: "Ensorcelled Hand Weapon",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-weapon",
    race: "Chaos Dwarfs",
  },
  {
    id: "toWound:fireglaive",
    card: "toWound",
    label: "Fireglaive",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-weapon",
    race: "Chaos Dwarfs",
  },
  {
    id: "toWound:darkforgedPossessed",
    card: "toWound",
    label: "Darkforged Weapon: Possessed",
    effect: { kind: "force-target", value: 2 },
    category: "race-weapon",
    race: "Chaos Dwarfs",
    tooltip: "Wounds on 2+.",
  },

  // Weapons — Dwarfs
  {
    id: "toWound:steamDrill",
    card: "toWound",
    label: "Steam Drill",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 3 },
    category: "race-weapon",
    race: "Dwarfs",
  },

  // Weapons — Orcs & Goblins
  {
    id: "toWound:choppa",
    card: "toWound",
    label: "Choppa (first combat round)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-weapon",
    race: "Orcs & Goblins",
  },

  // Weapons — Wood Elves
  {
    id: "toWound:asraiSpear",
    card: "toWound",
    label: "Asrai Spear (mounted, on charge)",
    effect: { kind: "delta-stat", stat: "S", sign: 1, magnitude: 1 },
    category: "race-weapon",
    race: "Wood Elves",
  },

  // Custom (user-driven steppers)
  {
    id: "toWound:customSDelta",
    card: "toWound",
    label: "Custom ±S",
    effect: { kind: "delta-stat", stat: "S", sign: 1 },
    variableValue: { min: -10, max: 10, default: 0 },
    category: "custom",
  },
  {
    id: "toWound:customTDelta",
    card: "toWound",
    label: "Custom ±T",
    effect: { kind: "delta-stat", stat: "T", sign: 1 },
    variableValue: { min: -10, max: 10, default: 0 },
    category: "custom",
  },
  {
    id: "toWound:customToWoundDelta",
    card: "toWound",
    label: "Custom ±To Wound",
    effect: { kind: "numeric", value: 0 },
    variableValue: { min: -5, max: 5, default: 0 },
    category: "custom",
  },
  {
    id: "toWound:customForceTarget",
    card: "toWound",
    label: "Custom: wounds on N+",
    effect: { kind: "force-target", value: 2 },
    variableValue: { min: 2, max: 6, default: 2 },
    category: "custom",
  },

  // ── Armour Save ─────────────────────────────────────────────────────────
  // General (always visible)
  {
    id: "armourSave:noSave",
    card: "armourSave",
    label: "No Armour Save Allowed",
    effect: { kind: "auto-result", value: "fail" },
    category: "general",
  },
  {
    id: "armourSave:armourPiercing",
    card: "armourSave",
    label: "Armour Piercing",
    effect: { kind: "numeric", value: -1 },
    variableValue: { min: 1, max: 9, default: 1 },
    category: "general",
  },

  // Spells
  {
    id: "armourSave:plagueOfRust",
    card: "armourSave",
    label: "Plague of Rust",
    effect: { kind: "numeric", value: -1 },
    variableValue: { min: 1, max: 9, default: 1 },
    category: "spell",
  },
  {
    id: "armourSave:transmutationOfLead",
    card: "armourSave",
    label: "Transmutation of Lead",
    effect: { kind: "numeric", value: -1 },
    category: "spell",
  },
  {
    id: "armourSave:traitorKin",
    card: "armourSave",
    label: "Traitor-Kin",
    effect: { kind: "numeric", value: -1 },
    variableValue: { min: 1, max: 2, default: 1 },
    category: "spell",
  },

  // Custom
  {
    id: "armourSave:customDelta",
    card: "armourSave",
    label: "Custom ±AS",
    effect: { kind: "numeric", value: 0 },
    variableValue: { min: -10, max: 10, default: 0 },
    category: "custom",
  },
  {
    id: "armourSave:customForceTarget",
    card: "armourSave",
    label: "Custom: AS on N+",
    effect: { kind: "force-target", value: 2 },
    variableValue: { min: 2, max: 6, default: 2 },
    category: "custom",
  },

  // ── Ward Save ───────────────────────────────────────────────────────────
  // General (always visible)
  {
    id: "wardSave:noWard",
    card: "wardSave",
    label: "No Saves Allowed",
    effect: { kind: "auto-result", value: "fail" },
    category: "general",
  },
  {
    id: "wardSave:regeneration",
    card: "wardSave",
    label: "Regeneration",
    effect: { kind: "force-target", value: 5 },
    variableValue: { min: 1, max: 6, default: 5 },
    category: "general",
  },
  {
    id: "wardSave:parry",
    card: "wardSave",
    label: "Parry Save",
    effect: { kind: "replace-ward", value: 6 },
    category: "general",
    tooltip: "Hand weapon + shield, front close-combat only.",
  },
  {
    id: "wardSave:magicResistance",
    card: "wardSave",
    label: "Magic Resistance",
    effect: { kind: "numeric", value: 1 },
    variableValue: { min: 1, max: 6, default: 1 },
    category: "general",
    tooltip: "Only against spells / magical attacks.",
  },

  // Spells & Bound Prayers — Ward grants
  {
    id: "wardSave:shieldOfSaphery",
    card: "wardSave",
    label: "Shield of Saphery",
    effect: { kind: "numeric", value: 1 },
    category: "spell",
    tooltip: "+1 ward (max 3+); grants 6+ if no ward.",
  },
  {
    id: "wardSave:nerusIncantation",
    card: "wardSave",
    label: "Neru's Incantation of Protection",
    effect: { kind: "force-target", value: 5 },
    category: "spell",
  },
  {
    id: "wardSave:fistsOfGorkWard",
    card: "wardSave",
    label: "Fists of Gork (caster)",
    effect: { kind: "force-target", value: 6 },
    category: "spell",
    tooltip: "Caster only.",
  },
  {
    id: "wardSave:shieldOfFaith",
    card: "wardSave",
    label: "Shield of Faith",
    effect: { kind: "force-target", value: 5 },
    category: "spell",
    tooltip: "Vs close-combat wounds.",
  },

  // Spells & Bound Prayers — Regeneration grants (modeled as ward force-target)
  {
    id: "wardSave:earthBlood",
    card: "wardSave",
    label: "Earth Blood (Regen 5+)",
    effect: { kind: "force-target", value: 5 },
    category: "spell",
  },
  {
    id: "wardSave:earthBloodThrone",
    card: "wardSave",
    label: "Earth Blood + Throne (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "spell",
  },
  {
    id: "wardSave:trollguts",
    card: "wardSave",
    label: "Trollguts (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "spell",
  },
  {
    id: "wardSave:fleshlyAbundance",
    card: "wardSave",
    label: "Fleshly Abundance (Regen 5+)",
    effect: { kind: "force-target", value: 5 },
    category: "spell",
    tooltip: "Or +1 Regen, max 2+.",
  },

  // Army & Unit Rules — Daemons of Chaos
  {
    id: "wardSave:daemonicAura",
    card: "wardSave",
    label: "Daemonic Aura",
    effect: { kind: "force-target", value: 5 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },
  {
    id: "wardSave:reignChaoticEbb",
    card: "wardSave",
    label: "Reign: Chaotic Ebb",
    effect: { kind: "numeric", value: -1 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },
  {
    id: "wardSave:reignChaoticSurge",
    card: "wardSave",
    label: "Reign: Chaotic Surge",
    effect: { kind: "numeric", value: 1 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },
  {
    id: "wardSave:greaterLocusFecundity",
    card: "wardSave",
    label: "Greater Locus of Fecundity (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Daemons of Chaos",
  },
  {
    id: "wardSave:warpflame",
    card: "wardSave",
    label: "Warpflame (Regen 6+)",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Daemons of Chaos",
    tooltip: "Or +1 Regen.",
  },

  // Army & Unit Rules — Warriors of Chaos
  {
    id: "wardSave:markOfTzeentch",
    card: "wardSave",
    label: "Mark of Tzeentch",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Warriors of Chaos",
    tooltip: "6+ ward; or +1 ward, max 3+.",
  },
  {
    id: "wardSave:eyeAuraOfChaos",
    card: "wardSave",
    label: "Eye of the Gods: Aura of Chaos",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Warriors of Chaos",
    tooltip: "6+ ward; or +1 ward, max 3+.",
  },
  {
    id: "wardSave:daemonicInvulnerability",
    card: "wardSave",
    label: "Daemonic Invulnerability",
    effect: { kind: "force-target", value: 5 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:protectionDarkGods",
    card: "wardSave",
    label: "Protection of the Dark Gods",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:regeneratingFlesh",
    card: "wardSave",
    label: "Regenerating Flesh (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:mutantRegeneration",
    card: "wardSave",
    label: "Mutant Regeneration (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Warriors of Chaos",
  },

  // Army & Unit Rules — Bretonnia legacy
  {
    id: "wardSave:blessingOfTheLady",
    card: "wardSave",
    label: "Blessing of the Lady",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Bretonnia",
  },
  {
    id: "wardSave:blessingVsS5",
    card: "wardSave",
    label: "Blessing vs S5+",
    effect: { kind: "force-target", value: 5 },
    category: "race-ability",
    race: "Bretonnia",
  },
  {
    id: "wardSave:fayEnchantressBlessing",
    card: "wardSave",
    label: "Fay Enchantress Blessing",
    effect: { kind: "force-target", value: 5 },
    category: "race-ability",
    race: "Bretonnia",
  },

  // Army & Unit Rules — Orcs & Goblins
  {
    id: "wardSave:warpaint",
    card: "wardSave",
    label: "Warpaint",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Orcs & Goblins",
  },
  {
    id: "wardSave:warpaintWurrzag",
    card: "wardSave",
    label: "Warpaint of Wurrzag",
    effect: { kind: "force-target", value: 5 },
    category: "race-ability",
    race: "Orcs & Goblins",
  },

  // Army & Unit Rules — Dark Elves
  {
    id: "wardSave:bloodshieldKhaine",
    card: "wardSave",
    label: "Bloodshield of Khaine",
    effect: { kind: "force-target", value: 4 },
    variableValue: { min: 4, max: 6, default: 4 },
    category: "race-ability",
    race: "Dark Elves",
    tooltip: "4+ / 5+ / 6+ ward depending on conditions.",
  },

  // Army & Unit Rules — High Elves
  {
    id: "wardSave:attunedToMagicWard",
    card: "wardSave",
    label: "Attuned to Magic",
    effect: { kind: "force-target", value: 5 },
    variableValue: { min: 4, max: 6, default: 5 },
    category: "race-ability",
    race: "High Elves",
    tooltip: "4+ / 5+ / 6+ depending on channelling.",
  },
  {
    id: "wardSave:witnessToDestiny",
    card: "wardSave",
    label: "Witness to Destiny",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "High Elves",
  },
  {
    id: "wardSave:windrider",
    card: "wardSave",
    label: "Windrider (vs shooting)",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "High Elves",
  },

  // Army & Unit Rules — Wood Elves
  {
    id: "wardSave:forestSpirit",
    card: "wardSave",
    label: "Forest Spirit",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Wood Elves",
  },
  {
    id: "wardSave:talismanicTattoos",
    card: "wardSave",
    label: "Talismanic Tattoos",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Wood Elves",
  },

  // Army & Unit Rules — Lizardmen
  {
    id: "wardSave:shieldOfOldOnes",
    card: "wardSave",
    label: "Shield of the Old Ones",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Lizardmen",
  },
  {
    id: "wardSave:supremeShieldOfOldOnes",
    card: "wardSave",
    label: "Supreme Shield of the Old Ones",
    effect: { kind: "force-target", value: 3 },
    category: "race-ability",
    race: "Lizardmen",
  },

  // Army & Unit Rules — Skaven
  {
    id: "wardSave:dodge",
    card: "wardSave",
    label: "Dodge",
    effect: { kind: "force-target", value: 6 },
    variableValue: { min: 5, max: 6, default: 6 },
    category: "race-ability",
    race: "Skaven",
    tooltip: "6+ or 5+ depending on subtype.",
  },
  {
    id: "wardSave:dodge4",
    card: "wardSave",
    label: "Dodge (4+)",
    effect: { kind: "force-target", value: 4 },
    category: "race-ability",
    race: "Skaven",
  },

  // Army & Unit Rules — Tomb Kings
  {
    id: "wardSave:stoneShaper",
    card: "wardSave",
    label: "Stone Shaper (Regen 6+)",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Tomb Kings",
  },

  // Army & Unit Rules — Vampire Counts
  {
    id: "wardSave:reliquary",
    card: "wardSave",
    label: "The Reliquary (Regen 6+)",
    effect: { kind: "force-target", value: 6 },
    category: "race-ability",
    race: "Vampire Counts",
    tooltip: "Or +1 Regen, max 4+.",
  },

  // Magic Items & Upgrades — Core Rulebook
  {
    id: "wardSave:armourOfDestiny",
    card: "wardSave",
    label: "Armour of Destiny",
    effect: { kind: "force-target", value: 4 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:armourOfFortune",
    card: "wardSave",
    label: "Armour of Fortune",
    effect: { kind: "force-target", value: 5 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:gamblersArmour",
    card: "wardSave",
    label: "Gambler's Armour",
    effect: { kind: "force-target", value: 6 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:spellshield",
    card: "wardSave",
    label: "Spellshield (MR 1)",
    effect: { kind: "numeric", value: 1 },
    category: "brb-artifact",
    tooltip: "Magic Resistance (1) — vs spells.",
  },
  {
    id: "wardSave:dragonhelm",
    card: "wardSave",
    label: "Dragonhelm (vs Flaming)",
    effect: { kind: "force-target", value: 2 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:talismanOfPreservation",
    card: "wardSave",
    label: "Talisman of Preservation",
    effect: { kind: "force-target", value: 4 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:talismanOfEndurance",
    card: "wardSave",
    label: "Talisman of Endurance",
    effect: { kind: "force-target", value: 5 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:talismanOfProtection",
    card: "wardSave",
    label: "Talisman of Protection",
    effect: { kind: "force-target", value: 6 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:opalAmulet",
    card: "wardSave",
    label: "Opal Amulet (vs first wound)",
    effect: { kind: "force-target", value: 4 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:dragonbaneGem",
    card: "wardSave",
    label: "Dragonbane Gem (vs Flaming)",
    effect: { kind: "force-target", value: 2 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:pigeonPluckerPendant",
    card: "wardSave",
    label: "Pigeon Plucker Pendant (vs Fly in CC)",
    effect: { kind: "force-target", value: 5 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:ironcurseIcon",
    card: "wardSave",
    label: "Ironcurse Icon (vs war machines)",
    effect: { kind: "force-target", value: 6 },
    category: "brb-artifact",
  },
  {
    id: "wardSave:obsidianTrinket",
    card: "wardSave",
    label: "Obsidian Trinket (MR 1)",
    effect: { kind: "numeric", value: 1 },
    category: "brb-artifact",
    tooltip: "Magic Resistance (1) — vs spells.",
  },
  {
    id: "wardSave:obsidianAmulet",
    card: "wardSave",
    label: "Obsidian Amulet (MR 2)",
    effect: { kind: "numeric", value: 2 },
    category: "brb-artifact",
    tooltip: "Magic Resistance (2) — vs spells.",
  },
  {
    id: "wardSave:obsidianLodestone",
    card: "wardSave",
    label: "Obsidian Lodestone (MR 3)",
    effect: { kind: "numeric", value: 3 },
    category: "brb-artifact",
    tooltip: "Magic Resistance (3) — vs spells.",
  },
  {
    id: "wardSave:seedOfRebirth",
    card: "wardSave",
    label: "Seed of Rebirth (Regen 6+)",
    effect: { kind: "force-target", value: 6 },
    category: "brb-artifact",
  },

  // Magic Items & Upgrades — High Elves
  {
    id: "wardSave:bannerOfWorldDragon",
    card: "wardSave",
    label: "Banner of the World Dragon (vs spells/magic)",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "High Elves",
  },

  // Magic Items & Upgrades — Dwarfs
  {
    id: "wardSave:masterRuneGrungni",
    card: "wardSave",
    label: "Master Rune of Grungni",
    effect: { kind: "force-target", value: 4 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "4+ ward bearer / 5+ ward aura.",
  },
  {
    id: "wardSave:runeOfSanctuary",
    card: "wardSave",
    label: "Rune of Sanctuary (MR 1/2/3)",
    effect: { kind: "numeric", value: 1 },
    variableValue: { min: 1, max: 3, default: 1 },
    category: "race-artifact",
    race: "Dwarfs",
    tooltip: "Magic Resistance — vs spells.",
  },
  {
    id: "wardSave:runeOfShielding",
    card: "wardSave",
    label: "Rune of Shielding (vs shooting/missiles)",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfPreservation",
    card: "wardSave",
    label: "Rune of Preservation (vs KB/HKB)",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfFortitudeX2",
    card: "wardSave",
    label: "Rune of Fortitude ×2",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfIronX3Ward",
    card: "wardSave",
    label: "Rune of Iron ×3 (Regen 5+)",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfWarding",
    card: "wardSave",
    label: "Rune of Warding",
    effect: { kind: "force-target", value: 6 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfWardingX2",
    card: "wardSave",
    label: "Rune of Warding ×2",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfWardingX3",
    card: "wardSave",
    label: "Rune of Warding ×3",
    effect: { kind: "force-target", value: 4 },
    category: "race-artifact",
    race: "Dwarfs",
  },
  {
    id: "wardSave:runeOfFurnace",
    card: "wardSave",
    label: "Rune of the Furnace (vs Flaming)",
    effect: { kind: "force-target", value: 2 },
    category: "race-artifact",
    race: "Dwarfs",
  },

  // Magic Items & Upgrades — Warriors of Chaos
  {
    id: "wardSave:collarOfKhorne",
    card: "wardSave",
    label: "Collar of Khorne (MR 3)",
    effect: { kind: "numeric", value: 3 },
    category: "race-artifact",
    race: "Warriors of Chaos",
    tooltip: "Magic Resistance (3) — vs spells.",
  },
  {
    id: "wardSave:poisonousSlime",
    card: "wardSave",
    label: "Poisonous Slime (vs Poisoned)",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:burningBody",
    card: "wardSave",
    label: "Burning Body (vs Flaming)",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:chaliceRegenFlesh",
    card: "wardSave",
    label: "Chalice of Chaos: Regenerating Flesh (Regen 4+)",
    effect: { kind: "force-target", value: 4 },
    category: "race-artifact",
    race: "Warriors of Chaos",
  },
  {
    id: "wardSave:chaliceDarkFortune",
    card: "wardSave",
    label: "Chalice of Chaos: Dark Fortune",
    effect: { kind: "force-target", value: 5 },
    category: "race-artifact",
    race: "Warriors of Chaos",
  },

  // Custom — Ward
  {
    id: "wardSave:customDelta",
    card: "wardSave",
    label: "Custom ±Ward",
    effect: { kind: "numeric", value: 0 },
    variableValue: { min: -10, max: 10, default: 0 },
    category: "custom",
  },
  {
    id: "wardSave:customForceTarget",
    card: "wardSave",
    label: "Custom: ward on N+",
    effect: { kind: "force-target", value: 4 },
    variableValue: { min: 2, max: 6, default: 4 },
    category: "custom",
  },
];

/** Sort key within a group: force-ws/stat → delta-ws/stat → force-target → numeric+ → numeric-. */
export function modifierSortKey(config: ModifierConfig): number {
  const kind = config.effect.kind;
  if (kind === "force-ws") return 0;
  if (kind === "delta-ws") return 1;
  if (kind === "delta-stat") return 1;
  if (kind === "force-target") return 2;
  if (kind === "numeric") return config.effect.value >= 0 ? 3 : 4;
  if (kind === "auto-result") return 5;
  if (kind === "replace-ward") return 6;
  return 7;
}
