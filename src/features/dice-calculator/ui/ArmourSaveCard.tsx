import { useMemo, type ReactElement } from "react";
import { Shield } from "lucide-react";
import {
  MODIFIER_CONFIGS,
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
import { SaveSelect } from "@/shared/ui/save-select";
import { effectLabel } from "../lib/effectLabel";
import { CalculatorCard } from "./CalculatorCard";

const ARMOUR_MODIFIERS = MODIFIER_CONFIGS.filter(
  (m) => m.card === "armourSave",
);

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

export function ArmourSaveCard({
  state,
  result,
  onSetSaveTarget,
  onToggleModifier,
  onSetModifierValue,
  onSetModifierValueDef,
  onSetModifierTarget,
  onTogglePinned,
}: {
  state: CardState;
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
  const baseTarget: SaveBaseTarget = state.inputs.baseTarget ?? 6;
  const stateById = useMemo(
    () => new Map(state.modifiers.map((m) => [m.id, m])),
    [state.modifiers],
  );

  const groupedConfigs = useMemo(() => {
    const general: ModifierConfig[] = [];
    const spells: ModifierConfig[] = [];
    const custom: ModifierConfig[] = [];
    for (const c of ARMOUR_MODIFIERS) {
      switch (c.category ?? "general") {
        case "general":
          general.push(c);
          break;
        case "spell":
          spells.push(c);
          break;
        case "custom":
          custom.push(c);
          break;
        default:
          general.push(c);
      }
    }
    return {
      general: sorted(general),
      spells: [...spells].sort((a, b) => a.label.localeCompare(b.label)),
      custom: sorted(custom),
    };
  }, []);

  const isAutoResult = (c: ModifierConfig) => c.effect.kind === "auto-result";
  const isPinned = (c: ModifierConfig) => Boolean(stateById.get(c.id)?.pinned);

  const pinnedRows = useMemo(
    () =>
      sorted(
        ARMOUR_MODIFIERS.filter(
          (c) =>
            !isAutoResult(c) &&
            isPinned(c) &&
            (c.category ?? "general") !== "general",
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.modifiers],
  );

  const pinnedIds = new Set(pinnedRows.map((c) => c.id));
  const stripPinned = (arr: ModifierConfig[]) =>
    arr.filter((c) => !pinnedIds.has(c.id));

  const groups = {
    general: groupedConfigs.general, // keep auto-result + Armour Piercing always visible
    spells: stripPinned(groupedConfigs.spells),
    custom: stripPinned(groupedConfigs.custom),
  };

  const toneFor = (c: ModifierConfig): ModifierTone => {
    if (c.category === "spell") return "spell";
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

  // Reference these to silence unused-prop lints — exposed for future
  // delta-stat / target-switch additions on AS.
  void onSetModifierValueDef;
  void onSetModifierTarget;

  return (
    <CalculatorCard
      icon={<Shield />}
      title="Armour Save"
      subtitle="AS"
      infoText="Base armour save, modified by toggles plus the auto-derived Strength penalty (S4→-1, S5→-2, …) from the To Wound card."
      inputs={
        <SaveSelect
          label="Base Armour Save"
          value={baseTarget}
          onChange={onSetSaveTarget}
        />
      }
      modifiers={
        <>
          {groups.general.map((c) => renderRow(c, "default"))}
          {pinnedRows.map((c) => renderRow(c))}
          {groups.spells.length > 0 && (
            <ModifierGroup title="Spells">
              {groups.spells.map((c) => renderRow(c, "spell"))}
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
          kind="armourSave"
        />
      }
    />
  );
}
