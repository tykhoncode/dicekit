import { useMemo, type ReactElement } from "react";
import {
  MODIFIER_CONFIGS,
  type AttackMode,
  type CardState,
  type ComputedCardResult,
  type ModifierConfig,
  type ModifierId,
} from "@/entities/dice";
import { modifierSortKey } from "@/entities/dice/model/modifiers";
import { ModifierGroup } from "@/shared/ui/modifier-group";
import {
  ModifierToggleRow,
  type ModifierTone,
} from "@/shared/ui/modifier-toggle-row";
import { NumberStepper } from "@/shared/ui/number-stepper";
import { Separator } from "@/shared/ui/separator";
import { ResultBadge } from "@/shared/ui/result-badge";
import { effectLabel } from "../lib/effectLabel";
import { AttackModeTabs } from "./AttackModeTabs";
import { CalculatorCard } from "./CalculatorCard";

/** Faction Rules pinned to the bottom in this exact order. */
const FACTION_RULES_BOTTOM: readonly string[] = [
  "toHit:bloodOath",
  "toHit:battleOfWills",
  "toHit:enchantingBeauty",
  "toHit:sonsOfGhorros",
  "toHit:stolenCrowns",
];

/** Top-of-list ordering for the shooting general group. */
const SHOOTING_TOP: readonly string[] = [
  "toHit:shoot:longRange",
  "toHit:shoot:moving",
  "toHit:shoot:behindUnit",
  "toHit:shoot:multipleShots",
  "toHit:shoot:targetSkirmisher",
  "toHit:shoot:sniper",
  "toHit:shoot:standAndShoot",
];

/** Top-of-list ordering for the shooting terrain group. */
const SHOOTING_TERRAIN_TOP: readonly string[] = [
  "toHit:shoot:softCover",
  "toHit:shoot:hardCover",
];

function sorted(
  configs: readonly ModifierConfig[],
  topOrder?: readonly string[],
): ModifierConfig[] {
  const priority = (c: ModifierConfig): number => {
    if (!topOrder) return Infinity;
    const idx = topOrder.indexOf(c.id);
    return idx === -1 ? Infinity : idx;
  };
  return [...configs].sort((a, b) => {
    const pa = priority(a);
    const pb = priority(b);
    if (pa !== pb) return pa - pb;
    return (
      modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label)
    );
  });
}

type RenderRow = (config: ModifierConfig, tone?: ModifierTone) => ReactElement;

export function ToHitCard({
  state,
  attackMode,
  result,
  onSetAttackMode,
  onSetStat,
  onToggleModifier,
  onSetModifierValue,
  onSetModifierValueDef,
  onSetModifierTarget,
  onTogglePinned,
}: {
  state: CardState;
  attackMode: AttackMode;
  result: ComputedCardResult;
  onSetAttackMode: (mode: AttackMode) => void;
  onSetStat: (
    key: "attackerWS" | "defenderWS" | "attackerBS",
    value: number,
  ) => void;
  onToggleModifier: (id: ModifierId) => void;
  onSetModifierValue: (id: ModifierId, value: number) => void;
  onSetModifierValueDef: (id: ModifierId, value: number) => void;
  onSetModifierTarget: (
    id: ModifierId,
    target: "attacker" | "defender" | "both",
  ) => void;
  onTogglePinned: (id: ModifierId) => void;
}) {
  const isShooting = attackMode === "shooting";
  const activeModifiers = isShooting
    ? state.modifiersShooting
    : state.modifiers;
  const TO_HIT_CONFIGS = useMemo(
    () =>
      MODIFIER_CONFIGS.filter(
        (c) =>
          c.card === "toHit" && (c.mode === undefined || c.mode === attackMode),
      ),
    [attackMode],
  );
  const attackerWS = state.inputs.attackerWS ?? 3;
  const defenderWS = state.inputs.defenderWS ?? 3;
  const stateById = useMemo(
    () => new Map(activeModifiers.map((m) => [m.id, m])),
    [activeModifiers],
  );

  const groupedConfigs = useMemo(() => {
    const general: ModifierConfig[] = [];
    const spells: ModifierConfig[] = [];
    const brbArtifacts: ModifierConfig[] = [];
    const terrain: ModifierConfig[] = [];
    const custom: ModifierConfig[] = [];
    const racialArtifactsMap = new Map<string, ModifierConfig[]>();
    const racialAbilitiesMap = new Map<string, ModifierConfig[]>();
    for (const c of TO_HIT_CONFIGS) {
      switch (c.category ?? "general") {
        case "general":
          general.push(c);
          break;
        case "spell":
          spells.push(c);
          break;
        case "brb-artifact":
          brbArtifacts.push(c);
          break;
        case "race-ability": {
          const race = c.race ?? "Other";
          const arr = racialAbilitiesMap.get(race) ?? [];
          arr.push(c);
          racialAbilitiesMap.set(race, arr);
          break;
        }
        case "race-artifact": {
          const race = c.race ?? "Other";
          const arr = racialArtifactsMap.get(race) ?? [];
          arr.push(c);
          racialArtifactsMap.set(race, arr);
          break;
        }
        case "terrain":
          terrain.push(c);
          break;
        case "custom":
          custom.push(c);
          break;
      }
    }
    const sortByRace = <T,>(map: Map<string, T>): [string, T][] =>
      [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    const spellsSorted = [...spells].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    return {
      general: sorted(
        general,
        attackMode === "shooting" ? SHOOTING_TOP : undefined,
      ),
      spells: spellsSorted,
      brbArtifacts: sorted(brbArtifacts),
      racialArtifacts: sortByRace(racialArtifactsMap).map(([race, arr]) => ({
        race,
        items: [...arr].sort((a, b) => a.label.localeCompare(b.label)),
      })),
      racialAbilities: [...racialAbilitiesMap.values()].flat().sort((a, b) => {
        const ai = FACTION_RULES_BOTTOM.indexOf(a.id);
        const bi = FACTION_RULES_BOTTOM.indexOf(b.id);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return 1;
        if (bi !== -1) return -1;
        return (
          modifierSortKey(a) - modifierSortKey(b) ||
          a.label.localeCompare(b.label)
        );
      }),
      terrain: sorted(
        terrain,
        attackMode === "shooting" ? SHOOTING_TERRAIN_TOP : undefined,
      ),
      custom: sorted(custom),
    };
  }, [TO_HIT_CONFIGS, attackMode]);

  const isAutoResult = (c: ModifierConfig) => c.effect.kind === "auto-result";
  const isPinned = (c: ModifierConfig) => Boolean(stateById.get(c.id)?.pinned);

  const autoRows = useMemo(
    () =>
      sorted([
        ...groupedConfigs.general.filter(isAutoResult),
        // auto-result toggles can appear in any category, so collect from all
        ...groupedConfigs.spells.filter(isAutoResult),
        ...groupedConfigs.brbArtifacts.filter(isAutoResult),
        ...groupedConfigs.terrain.filter(isAutoResult),
        ...groupedConfigs.custom.filter(isAutoResult),
        ...groupedConfigs.racialArtifacts.flatMap((g) =>
          g.items.filter(isAutoResult),
        ),
        ...groupedConfigs.racialAbilities.filter(isAutoResult),
      ]),
    [groupedConfigs],
  );

  const pinnedRows = useMemo(
    () =>
      sorted(
        TO_HIT_CONFIGS.filter(
          (c) =>
            !isAutoResult(c) &&
            isPinned(c) &&
            (c.category ?? "general") !== "general",
        ),
      ),
    // recompute when pin state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeModifiers, TO_HIT_CONFIGS],
  );

  const pinnedIds = new Set(pinnedRows.map((c) => c.id));
  const stripPinned = (arr: ModifierConfig[]) =>
    arr.filter((c) => !pinnedIds.has(c.id) && !isAutoResult(c));
  const stripPinnedRaceArr = <T extends { items: ModifierConfig[] }>(
    arr: T[],
  ) =>
    arr
      .map((g) => ({ ...g, items: stripPinned(g.items) }))
      .filter((g) => g.items.length > 0);

  const groups = {
    general: stripPinned(groupedConfigs.general),
    spells: stripPinned(groupedConfigs.spells),
    brbArtifacts: stripPinned(groupedConfigs.brbArtifacts),
    racialArtifacts: stripPinnedRaceArr(groupedConfigs.racialArtifacts),
    racialAbilities: stripPinned(groupedConfigs.racialAbilities),
    terrain: stripPinned(groupedConfigs.terrain),
    custom: stripPinned(groupedConfigs.custom),
  };

  const toneFor = (c: ModifierConfig): ModifierTone => {
    switch (c.category) {
      case "spell":
        return "spell";
      case "brb-artifact":
      case "race-artifact":
        return "artifact";
      default:
        return "default";
    }
  };
  const isPinnable = (c: ModifierConfig) =>
    !isAutoResult(c) && (c.category ?? "general") !== "general";

  const renderRow: RenderRow = (config, toneOverride) => {
    const modState = stateById.get(config.id);
    const active = modState?.active ?? false;
    const variable = config.variableValue;
    // Only thread state.value/valueDef into the badge label and the stepper
    // when the modifier actually has a variableValue spec — otherwise the
    // badge would shadow the static effect.value (e.g. "WS 1" for Speed of
    // Light instead of "WS 10").
    const value = variable ? (modState?.value ?? variable.default) : undefined;
    const valueDef = variable
      ? (modState?.valueDef ?? variable.default)
      : undefined;
    const wsEffect =
      config.effect.kind === "force-ws" || config.effect.kind === "delta-ws"
        ? config.effect
        : null;
    const isWsEffect = wsEffect !== null;
    const target: "attacker" | "defender" | "both" | undefined =
      modState?.target ?? wsEffect?.target;
    const showSecondStepper =
      isWsEffect && target === "both" && Boolean(variable);
    return (
      <ModifierToggleRow
        key={config.id}
        label={config.label}
        effectLabel={effectLabel(config.effect, value, {
          target,
          valueDef,
          variableMin: variable?.min,
        })}
        active={active}
        onToggle={() => onToggleModifier(config.id)}
        tone={toneOverride ?? toneFor(config)}
        tooltip={config.tooltip}
        pinned={modState?.pinned ?? false}
        onTogglePinned={
          isPinnable(config) ? () => onTogglePinned(config.id) : undefined
        }
        valueStepper={
          variable
            ? {
                value: modState?.value ?? variable.default,
                onChange: (v) => onSetModifierValue(config.id, v),
                min: variable.min,
                max: variable.max,
                ariaSuffix: target === "both" ? "(Atk)" : undefined,
              }
            : undefined
        }
        valueStepperDef={
          showSecondStepper && variable
            ? {
                value: modState?.valueDef ?? variable.default,
                onChange: (v) => onSetModifierValueDef(config.id, v),
                min: variable.min,
                max: variable.max,
                ariaSuffix: "(Def)",
              }
            : undefined
        }
        targetSwitch={
          isWsEffect && target && !config.noTargetSwitch
            ? {
                value: target,
                onChange: (next) => onSetModifierTarget(config.id, next),
              }
            : undefined
        }
      />
    );
  };

  return (
    <CalculatorCard
      headerSlot={
        <AttackModeTabs value={attackMode} onChange={onSetAttackMode} />
      }
      infoText={
        isShooting
          ? "Required = 7 − BS, clamped to [2, 6], then apply active shooting modifiers."
          : "Lookup the WHFB 8th Edition close-combat To Hit chart, then apply active modifiers."
      }
      inputs={
        isShooting ? (
          <NumberStepper
            label="Attacker BS"
            value={state.inputs.attackerBS ?? 3}
            onChange={(v) => onSetStat("attackerBS", v)}
          />
        ) : (
          <>
            <NumberStepper
              label="Attacker WS"
              value={attackerWS}
              onChange={(v) => onSetStat("attackerWS", v)}
            />
            <Separator orientation="vertical" />
            <NumberStepper
              label="Defender WS"
              value={defenderWS}
              onChange={(v) => onSetStat("defenderWS", v)}
            />
          </>
        )
      }
      modifiers={
        <>
          {autoRows.map((c) => renderRow(c))}
          {groups.general.map((c) => renderRow(c, "default"))}
          {pinnedRows.map((c) => renderRow(c))}
          {groups.racialAbilities.length > 0 && (
            <ModifierGroup title="Faction Rules">
              {groups.racialAbilities.map((c) => renderRow(c, "default"))}
            </ModifierGroup>
          )}
          {groups.terrain.length > 0 && (
            <ModifierGroup title="Terrain">
              {groups.terrain.map((c) => renderRow(c, "default"))}
            </ModifierGroup>
          )}
          {groups.spells.length > 0 && (
            <ModifierGroup title="Spells">
              {groups.spells.map((c) => renderRow(c, "spell"))}
            </ModifierGroup>
          )}
          {(groups.brbArtifacts.length > 0 ||
            groups.racialArtifacts.length > 0) && (
            <ModifierGroup title="Artifacts & Upgrades">
              {groups.brbArtifacts.length > 0 && (
                <ModifierGroup title="Core Rulebook (BRB)" level={1}>
                  {groups.brbArtifacts.map((c) => renderRow(c, "artifact"))}
                </ModifierGroup>
              )}
              {groups.racialArtifacts.length > 0 && (
                <ModifierGroup title="Faction Items" level={1}>
                  {groups.racialArtifacts.map(({ race, items }) => (
                    <ModifierGroup key={race} title={race} level={2}>
                      {items.map((c) => renderRow(c, "artifact"))}
                    </ModifierGroup>
                  ))}
                </ModifierGroup>
              )}
            </ModifierGroup>
          )}
          {groups.custom.length > 0 && (
            <ModifierGroup title="Custom">
              {groups.custom.map((c) => renderRow(c, "default"))}
            </ModifierGroup>
          )}
        </>
      }
      steps={result.steps}
      result={
        <ResultBadge
          target={result.target}
          cascade={result.cascade}
          probability={result.probability}
          kind="toHit"
        />
      }
    />
  );
}
