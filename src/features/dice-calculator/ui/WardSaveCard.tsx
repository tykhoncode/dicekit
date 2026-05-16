import { useMemo, type ReactElement } from "react";
import { Sparkles } from "lucide-react";
import {
  MODIFIER_CONFIGS,
  type AttackMode,
  type CardState,
  type ComputedCardResult,
  type ModifierConfig,
  type ModifierId,
  type SaveBaseTarget,
} from "@/entities/dice";
import { modifierSortKey } from "@/entities/dice/model/modifiers";
import { ModifierGroup } from "@/shared/ui/modifier-group";
import {
  ModifierToggleRow,
  type ModifierTone,
} from "@/shared/ui/modifier-toggle-row";
import { ResultBadge } from "@/shared/ui/result-badge";
import { SaveStepper } from "@/shared/ui/save-stepper";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

function sorted(configs: readonly ModifierConfig[]): ModifierConfig[] {
  return [...configs].sort((a, b) => {
    const aAuto = a.effect.kind === "auto-result";
    const bAuto = b.effect.kind === "auto-result";
    if (aAuto !== bAuto) return aAuto ? -1 : 1;
    return (
      modifierSortKey(a) - modifierSortKey(b) || a.label.localeCompare(b.label)
    );
  });
}

type RenderRow = (config: ModifierConfig, tone?: ModifierTone) => ReactElement;

export function WardSaveCard({
  state,
  attackMode,
  result,
  onSetSaveTarget,
  onToggleModifier,
  onSetModifierValue,
  onSetModifierValueDef,
  onSetModifierTarget,
  onTogglePinned,
}: {
  state: CardState;
  attackMode: AttackMode;
  result: ComputedCardResult;
  onSetSaveTarget: (value: SaveBaseTarget) => void;
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
  const WARD_SAVE_CONFIGS = useMemo(
    () =>
      MODIFIER_CONFIGS.filter(
        (c) =>
          c.card === "wardSave" &&
          (c.mode === undefined || c.mode === attackMode),
      ),
    [attackMode],
  );
  const baseTarget: SaveBaseTarget = state.inputs.baseTarget ?? "none";
  const stateById = useMemo(
    () => new Map(activeModifiers.map((m) => [m.id, m])),
    [activeModifiers],
  );

  const groupedConfigs = useMemo(() => {
    const general: ModifierConfig[] = [];
    const spells: ModifierConfig[] = [];
    const brbArtifacts: ModifierConfig[] = [];
    const custom: ModifierConfig[] = [];
    const racialAbilitiesMap = new Map<string, ModifierConfig[]>();
    const racialArtifactsMap = new Map<string, ModifierConfig[]>();
    for (const c of WARD_SAVE_CONFIGS) {
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
        case "custom":
          custom.push(c);
          break;
        default:
          general.push(c);
      }
    }
    const sortByRace = <T,>(map: Map<string, T>): [string, T][] =>
      [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    return {
      general: sorted(general),
      spells: [...spells].sort((a, b) => a.label.localeCompare(b.label)),
      brbArtifacts: [...brbArtifacts].sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
      racialArtifacts: sortByRace(racialArtifactsMap).map(([race, arr]) => ({
        race,
        items: [...arr].sort((a, b) => a.label.localeCompare(b.label)),
      })),
      racialAbilities: sortByRace(racialAbilitiesMap).map(([race, arr]) => ({
        race,
        items: [...arr].sort((a, b) => a.label.localeCompare(b.label)),
      })),
      custom: sorted(custom),
    };
  }, [WARD_SAVE_CONFIGS]);

  const isAutoResult = (c: ModifierConfig) => c.effect.kind === "auto-result";
  const isPinned = (c: ModifierConfig) => Boolean(stateById.get(c.id)?.pinned);

  const pinnedRows = useMemo(
    () =>
      sorted(
        WARD_SAVE_CONFIGS.filter(
          (c) =>
            !isAutoResult(c) &&
            isPinned(c) &&
            (c.category ?? "general") !== "general",
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeModifiers, WARD_SAVE_CONFIGS],
  );

  const pinnedIds = new Set(pinnedRows.map((c) => c.id));
  const stripPinned = (arr: ModifierConfig[]) =>
    arr.filter((c) => !pinnedIds.has(c.id));
  const stripPinnedRaceArr = <T extends { items: ModifierConfig[] }>(
    arr: T[],
  ) =>
    arr
      .map((g) => ({ ...g, items: stripPinned(g.items) }))
      .filter((g) => g.items.length > 0);

  const groups = {
    general: groupedConfigs.general,
    spells: stripPinned(groupedConfigs.spells),
    brbArtifacts: stripPinned(groupedConfigs.brbArtifacts),
    racialArtifacts: stripPinnedRaceArr(groupedConfigs.racialArtifacts),
    racialAbilities: stripPinnedRaceArr(groupedConfigs.racialAbilities),
    custom: stripPinned(groupedConfigs.custom),
  };

  const toneFor = (c: ModifierConfig): ModifierTone => {
    if (c.category === "spell") return "spell";
    if (c.category === "brb-artifact" || c.category === "race-artifact")
      return "artifact";
    return "default";
  };
  const isPinnable = (c: ModifierConfig) =>
    !isAutoResult(c) && (c.category ?? "general") !== "general";

  const renderRow: RenderRow = (config, toneOverride) => {
    const modState = stateById.get(config.id);
    const active = modState?.active ?? false;
    const variable = config.variableValue;
    const value = variable ? (modState?.value ?? variable.default) : undefined;
    return (
      <ModifierToggleRow
        key={config.id}
        label={config.label}
        effectLabel={effectLabel(config.effect, value, {
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
              }
            : undefined
        }
      />
    );
  };

  // Threaded for parity with the other cards even though no delta-stat
  // mods exist on Ward Save today.
  void onSetModifierValueDef;
  void onSetModifierTarget;

  return (
    <CalculatorCard
      icon={<Sparkles />}
      title="Ward Save"
      subtitle="WSv"
      infoText="Ward saves are never modified by the attack's Strength. Parry Ward (6++) sets a 6+ floor on the displayed ward target. Regeneration and ward grants resolve via the smallest force-target."
      inputs={
        <SaveStepper
          label="Base Ward Save"
          value={baseTarget}
          onChange={onSetSaveTarget}
        />
      }
      modifiers={
        <>
          {groups.general.map((c) => renderRow(c, "default"))}
          {pinnedRows.map((c) => renderRow(c))}
          {groups.racialAbilities.length > 0 && (
            <ModifierGroup title="Army & Unit Rules">
              {groups.racialAbilities.map(({ race, items }) => (
                <ModifierGroup key={race} title={race} level={1}>
                  {items.map((c) => renderRow(c, "default"))}
                </ModifierGroup>
              ))}
            </ModifierGroup>
          )}
          {groups.spells.length > 0 && (
            <ModifierGroup title="Spells & Bound Prayers">
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
          kind="wardSave"
        />
      }
    />
  );
}
