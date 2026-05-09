import {
  AppShell,
  ArmourSaveCard,
  CalculatorGrid,
  SummaryPanel,
  ToHitCard,
  ToWoundCard,
  TopBar,
  useDiceCalculator,
  WardSaveCard,
} from "@/features/dice-calculator";

export function CalculatorPage() {
  const calc = useDiceCalculator();
  const { state, results, outcome, actions } = calc;

  return (
    <AppShell>
      <TopBar onResetAll={actions.resetAll} />
      <CalculatorGrid>
        <ToHitCard
          state={state.toHit}
          result={results.toHit}
          onSetStat={(key, value) => actions.setStat("toHit", key, value)}
          onToggleModifier={(id) => actions.toggleModifier("toHit", id)}
          onSetModifierValue={(id, value) =>
            actions.setModifierValue("toHit", id, value)
          }
          onSetModifierValueDef={(id, value) =>
            actions.setModifierValueDef("toHit", id, value)
          }
          onSetModifierTarget={(id, target) =>
            actions.setModifierTarget("toHit", id, target)
          }
          onTogglePinned={(id) => actions.togglePinned("toHit", id)}
        />
        <ToWoundCard
          state={state.toWound}
          result={results.toWound}
          onSetStat={(key, value) => actions.setStat("toWound", key, value)}
          onToggleModifier={(id) => actions.toggleModifier("toWound", id)}
        />
        <ArmourSaveCard
          state={state.armourSave}
          result={results.armourSave}
          onSetSaveTarget={(v) => actions.setSaveTarget("armourSave", v)}
          onToggleModifier={(id) => actions.toggleModifier("armourSave", id)}
        />
        <WardSaveCard
          state={state.wardSave}
          result={results.wardSave}
          onSetSaveTarget={(v) => actions.setSaveTarget("wardSave", v)}
          onToggleModifier={(id) => actions.toggleModifier("wardSave", id)}
        />
      </CalculatorGrid>
      <SummaryPanel results={results} outcome={outcome} />
    </AppShell>
  );
}
