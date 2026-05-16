import { useMemo, type ReactElement } from "react";
import { Flame } from "lucide-react";
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
import { CalculatorCard } from "./CalculatorCard";

function sorted(configs: readonly ModifierConfig[]): ModifierConfig[] {
  return [...configs].sort(
    (a, b) =>
      modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label),
  );
}

type RenderRow = (config: ModifierConfig, tone?: ModifierTone) => ReactElement;

export function ToWoundCard({
  state,
  attackMode,
  result,
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
  onSetStat: (key: "strength" | "toughness", value: number) => void;
  onToggleModifier: (id: ModifierId) => void;
  onSetModifierValue: (id: ModifierId, value: number) => void;
  onSetModifierValueDef: (id: ModifierId, value: number) => void;
  onSetModifierTarget: (
    id: ModifierId,
    target: "attacker" | "defender" | "both",
  ) => void;
  onTogglePinned: (id: ModifierId) => void;
}) {
  const activeModifiers =
    attackMode === "melee" ? state.modifiers : state.modifiersShooting;
  const TO_WOUND_CONFIGS = useMemo(
    () =>
      MODIFIER_CONFIGS.filter(
        (c) =>
          c.card === "toWound" &&
          (c.mode === undefined || c.mode === attackMode),
      ),
    [attackMode],
  );
  const strength = state.inputs.strength ?? 3;
  const toughness = state.inputs.toughness ?? 3;
  const stateById = useMemo(
    () => new Map(activeModifiers.map((m) => [m.id, m])),
    [activeModifiers],
  );

  const groupedConfigs = useMemo(() => {
    const general: ModifierConfig[] = [];
    const spells: ModifierConfig[] = [];
    const brbArtifacts: ModifierConfig[] = [];
    const brbWeapons: ModifierConfig[] = [];
    const custom: ModifierConfig[] = [];
    const racialArtifactsMap = new Map<string, ModifierConfig[]>();
    const racialAbilitiesMap = new Map<string, ModifierConfig[]>();
    const raceWeaponsMap = new Map<string, ModifierConfig[]>();
    for (const c of TO_WOUND_CONFIGS) {
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
        case "brb-weapon":
          brbWeapons.push(c);
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
        case "race-weapon": {
          const race = c.race ?? "Other";
          const arr = raceWeaponsMap.get(race) ?? [];
          arr.push(c);
          raceWeaponsMap.set(race, arr);
          break;
        }
        case "custom":
          custom.push(c);
          break;
      }
    }
    const sortByRace = <T,>(map: Map<string, T>): [string, T][] =>
      [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    return {
      general: sorted(general),
      // Spells flat-alphabetical (per spec)
      spells: [...spells].sort((a, b) => a.label.localeCompare(b.label)),
      brbArtifacts: sorted(brbArtifacts),
      brbWeapons: sorted(brbWeapons),
      racialArtifacts: sortByRace(racialArtifactsMap).map(([race, arr]) => ({
        race,
        items: [...arr].sort((a, b) => a.label.localeCompare(b.label)),
      })),
      raceWeapons: sortByRace(raceWeaponsMap).map(([race, arr]) => ({
        race,
        items: [...arr].sort((a, b) => a.label.localeCompare(b.label)),
      })),
      racialAbilities: [...racialAbilitiesMap.values()].flat().sort((a, b) => {
        return (
          modifierSortKey(a) - modifierSortKey(b) ||
          a.label.localeCompare(b.label)
        );
      }),
      custom: sorted(custom),
    };
  }, [TO_WOUND_CONFIGS]);

  const isAutoResult = (c: ModifierConfig) => c.effect.kind === "auto-result";
  const isPinned = (c: ModifierConfig) => Boolean(stateById.get(c.id)?.pinned);

  const autoRows = useMemo(
    () =>
      sorted([
        ...groupedConfigs.general.filter(isAutoResult),
        ...groupedConfigs.spells.filter(isAutoResult),
        ...groupedConfigs.brbArtifacts.filter(isAutoResult),
        ...groupedConfigs.brbWeapons.filter(isAutoResult),
        ...groupedConfigs.custom.filter(isAutoResult),
        ...groupedConfigs.racialArtifacts.flatMap((g) =>
          g.items.filter(isAutoResult),
        ),
        ...groupedConfigs.raceWeapons.flatMap((g) =>
          g.items.filter(isAutoResult),
        ),
        ...groupedConfigs.racialAbilities.filter(isAutoResult),
      ]),
    [groupedConfigs],
  );

  const pinnedRows = useMemo(
    () =>
      sorted(
        TO_WOUND_CONFIGS.filter(
          (c) =>
            !isAutoResult(c) &&
            isPinned(c) &&
            (c.category ?? "general") !== "general",
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeModifiers, TO_WOUND_CONFIGS],
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
    brbWeapons: stripPinned(groupedConfigs.brbWeapons),
    racialArtifacts: stripPinnedRaceArr(groupedConfigs.racialArtifacts),
    raceWeapons: stripPinnedRaceArr(groupedConfigs.raceWeapons),
    racialAbilities: stripPinned(groupedConfigs.racialAbilities),
    custom: stripPinned(groupedConfigs.custom),
  };

  const toneFor = (c: ModifierConfig): ModifierTone => {
    switch (c.category) {
      case "spell":
        return "spell";
      case "brb-artifact":
      case "race-artifact":
        return "artifact";
      case "brb-weapon":
      case "race-weapon":
        return "weapon";
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
    const value = variable ? (modState?.value ?? variable.default) : undefined;
    const valueDef = variable
      ? (modState?.valueDef ?? variable.default)
      : undefined;
    // Only "delta-stat both" exposes the atk/both/def slider.
    const isDualStat =
      config.effect.kind === "delta-stat" && config.effect.stat === "both";
    const target: "attacker" | "defender" | "both" | undefined = isDualStat
      ? (modState?.target ?? "attacker")
      : undefined;
    const showSecondStepper =
      isDualStat && target === "both" && Boolean(variable);
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
          isDualStat && target && !config.noTargetSwitch
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
      icon={<Flame />}
      title="To Wound"
      subtitle="S vs T"
      infoText="Lookup the WHFB 8th Edition To Wound chart using effective Strength and Toughness, then apply active modifiers."
      inputs={
        <>
          <NumberStepper
            label="Attacker S"
            value={strength}
            onChange={(v) => onSetStat("strength", v)}
          />
          <Separator orientation="vertical" />
          <NumberStepper
            label="Defender T"
            value={toughness}
            onChange={(v) => onSetStat("toughness", v)}
          />
        </>
      }
      modifiers={
        <>
          {autoRows.map((c) => renderRow(c))}
          {groups.general.map((c) => renderRow(c, "default"))}
          {pinnedRows.map((c) => renderRow(c))}
          {groups.racialAbilities.length > 0 && (
            <ModifierGroup title="Army & Unit Rules">
              {groups.racialAbilities.map((c) => renderRow(c, "default"))}
            </ModifierGroup>
          )}
          {groups.spells.length > 0 && (
            <ModifierGroup title="Spells">
              {groups.spells.map((c) => renderRow(c, "spell"))}
            </ModifierGroup>
          )}
          {(groups.brbArtifacts.length > 0 ||
            groups.racialArtifacts.length > 0) && (
            <ModifierGroup title="Magic Items & Upgrades">
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
          {(groups.brbWeapons.length > 0 || groups.raceWeapons.length > 0) && (
            <ModifierGroup title="Weapons">
              {groups.brbWeapons.length > 0 && (
                <ModifierGroup title="Core Rulebook (BRB)" level={1}>
                  {groups.brbWeapons.map((c) => renderRow(c, "weapon"))}
                </ModifierGroup>
              )}
              {groups.raceWeapons.length > 0 && (
                <ModifierGroup title="Faction Weapons" level={1}>
                  {groups.raceWeapons.map(({ race, items }) => (
                    <ModifierGroup key={race} title={race} level={2}>
                      {items.map((c) => renderRow(c, "weapon"))}
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
          probability={result.probability}
          kind="toWound"
        />
      }
    />
  );
}
