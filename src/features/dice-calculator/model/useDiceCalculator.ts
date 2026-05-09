import { useCallback, useMemo, useState } from "react";
import {
  computeFullState,
  createInitialState,
  MODIFIER_CONFIGS,
  type CardKind,
  type ComputedCardResult,
  type FullState,
  type ModifierConfig,
  type ModifierId,
  type ModifierState,
  type Outcome,
  type SaveBaseTarget,
  type StatInputs,
} from "@/entities/dice";

function newModifierState(config: ModifierConfig | undefined): ModifierState {
  const base: ModifierState = { id: config?.id ?? "", active: false };
  if (config?.variableValue) {
    base.value = config.variableValue.default;
    base.valueDef = config.variableValue.default;
  }
  if (
    config?.effect.kind === "force-ws" ||
    config?.effect.kind === "delta-ws"
  ) {
    base.target = config.effect.target;
  }
  return base;
}

function upsertModifier(
  modifiers: readonly ModifierState[],
  id: ModifierId,
  patch: (m: ModifierState) => ModifierState,
): ModifierState[] {
  const idx = modifiers.findIndex((m) => m.id === id);
  if (idx >= 0) {
    return modifiers.map((m) => (m.id === id ? patch(m) : m));
  }
  const config = MODIFIER_CONFIGS.find((c) => c.id === id);
  return [...modifiers, patch({ ...newModifierState(config), id })];
}

type StatKey = keyof StatInputs;

export type UseDiceCalculatorReturn = {
  state: FullState;
  results: {
    toHit: ComputedCardResult;
    toWound: ComputedCardResult;
    armourSave: ComputedCardResult;
    wardSave: ComputedCardResult;
  };
  outcome: Outcome;
  actions: {
    setStat: (card: CardKind, key: StatKey, value: number) => void;
    setSaveTarget: (
      card: "armourSave" | "wardSave",
      value: SaveBaseTarget,
    ) => void;
    toggleModifier: (card: CardKind, id: ModifierId) => void;
    setModifierValue: (card: CardKind, id: ModifierId, value: number) => void;
    setModifierValueDef: (
      card: CardKind,
      id: ModifierId,
      value: number,
    ) => void;
    setModifierTarget: (
      card: CardKind,
      id: ModifierId,
      target: "attacker" | "defender" | "both",
    ) => void;
    togglePinned: (card: CardKind, id: ModifierId) => void;
    resetAll: () => void;
  };
};

export function useDiceCalculator(): UseDiceCalculatorReturn {
  const [state, setState] = useState<FullState>(createInitialState);

  const setStat = useCallback((card: CardKind, key: StatKey, value: number) => {
    setState((prev) => ({
      ...prev,
      [card]: {
        ...prev[card],
        inputs: { ...prev[card].inputs, [key]: value },
      },
    }));
  }, []);

  const setSaveTarget = useCallback(
    (card: "armourSave" | "wardSave", value: SaveBaseTarget) => {
      setState((prev) => ({
        ...prev,
        [card]: {
          ...prev[card],
          inputs: { ...prev[card].inputs, baseTarget: value },
        },
      }));
    },
    [],
  );

  const toggleModifier = useCallback((card: CardKind, id: ModifierId) => {
    setState((prev) => ({
      ...prev,
      [card]: {
        ...prev[card],
        modifiers: upsertModifier(prev[card].modifiers, id, (m) => ({
          ...m,
          active: !m.active,
        })),
      },
    }));
  }, []);

  const setModifierValue = useCallback(
    (card: CardKind, id: ModifierId, value: number) => {
      setState((prev) => ({
        ...prev,
        [card]: {
          ...prev[card],
          modifiers: upsertModifier(prev[card].modifiers, id, (m) => ({
            ...m,
            value,
          })),
        },
      }));
    },
    [],
  );

  const setModifierValueDef = useCallback(
    (card: CardKind, id: ModifierId, value: number) => {
      setState((prev) => ({
        ...prev,
        [card]: {
          ...prev[card],
          modifiers: upsertModifier(prev[card].modifiers, id, (m) => ({
            ...m,
            valueDef: value,
          })),
        },
      }));
    },
    [],
  );

  const setModifierTarget = useCallback(
    (
      card: CardKind,
      id: ModifierId,
      target: "attacker" | "defender" | "both",
    ) => {
      setState((prev) => ({
        ...prev,
        [card]: {
          ...prev[card],
          modifiers: upsertModifier(prev[card].modifiers, id, (m) => ({
            ...m,
            target,
          })),
        },
      }));
    },
    [],
  );

  const togglePinned = useCallback((card: CardKind, id: ModifierId) => {
    setState((prev) => ({
      ...prev,
      [card]: {
        ...prev[card],
        modifiers: upsertModifier(prev[card].modifiers, id, (m) => ({
          ...m,
          pinned: !m.pinned,
        })),
      },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(createInitialState());
  }, []);

  const { results, outcome } = useMemo(() => computeFullState(state), [state]);

  const namedResults = useMemo(() => {
    const [toHit, toWound, armourSave, wardSave] = results;
    if (!toHit || !toWound || !armourSave || !wardSave) {
      throw new Error("computeFullState must return four results");
    }
    return { toHit, toWound, armourSave, wardSave };
  }, [results]);

  return {
    state,
    results: namedResults,
    outcome,
    actions: {
      setStat,
      setSaveTarget,
      toggleModifier,
      setModifierValue,
      setModifierValueDef,
      setModifierTarget,
      togglePinned,
      resetAll,
    },
  };
}
