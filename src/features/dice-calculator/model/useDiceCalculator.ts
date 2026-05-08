import { useCallback, useMemo, useState } from "react";
import {
  computeFullState,
  createInitialState,
  type CardKind,
  type ComputedCardResult,
  type DiceTarget,
  type FullState,
  type ModifierId,
  type Outcome,
  type StatInputs,
} from "@/entities/dice";

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
    setSaveTarget: (card: "armourSave" | "wardSave", value: DiceTarget) => void;
    toggleModifier: (card: CardKind, id: ModifierId) => void;
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
    (card: "armourSave" | "wardSave", value: DiceTarget) => {
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
        modifiers: prev[card].modifiers.map((m) =>
          m.id === id ? { ...m, active: !m.active } : m,
        ),
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
    actions: { setStat, setSaveTarget, toggleModifier, resetAll },
  };
}
