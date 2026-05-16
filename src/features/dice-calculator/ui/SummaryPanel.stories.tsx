import { within, expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type {
  ComputedCardResult,
  ModifierId,
  Outcome,
} from "@/entities/dice/model/types";
import { useDiceCalculator } from "../model/useDiceCalculator";
import { SummaryPanel } from "./SummaryPanel";

const meta = {
  title: "features/dice-calculator/SummaryPanel",
  component: SummaryPanel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SummaryPanel>;

export default meta;

type Story = StoryObj<typeof SummaryPanel>;

function Live({
  toHit = [],
  toWound = [],
  armourSave = [],
  strength,
}: {
  toHit?: ModifierId[];
  toWound?: ModifierId[];
  armourSave?: ModifierId[];
  strength?: number;
}) {
  const calc = useDiceCalculator();
  useEffect(() => {
    for (const id of toHit) calc.actions.toggleModifier("toHit", id);
    for (const id of toWound) calc.actions.toggleModifier("toWound", id);
    for (const id of armourSave) calc.actions.toggleModifier("armourSave", id);
    if (strength !== undefined)
      calc.actions.setStat("toWound", "strength", strength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-full max-w-5xl">
      <SummaryPanel results={calc.results} outcome={calc.outcome} />
    </div>
  );
}

export const Default: Story = {
  render: () => <Live />,
};

export const AfterModifiers: Story = {
  render: () => (
    <Live
      toHit={["toHit:enchantedBlades"]}
      toWound={["toWound:greatWeapon"]}
      armourSave={["armourSave:armourPiercing"]}
    />
  ),
};

export const WithUnrollableSave: Story = {
  render: () => (
    <Live strength={8} armourSave={["armourSave:armourPiercing"]} />
  ),
};

const baseWound: ComputedCardResult = {
  kind: "toWound",
  target: 4,
  probability: 0.5,
  rawTarget: 4,
  steps: [],
};

const baseArmour: ComputedCardResult = {
  kind: "armourSave",
  target: "no-save",
  probability: 0,
  rawTarget: 7,
  steps: [],
};

const baseWard: ComputedCardResult = {
  kind: "wardSave",
  target: "no-ward",
  probability: 0,
  rawTarget: 7,
  steps: [],
};

const baseOutcome: Outcome = {
  unsavedWoundChance: 0,
  expectedUnsavedWounds: 0,
};

export const CascadeToHit: Story = {
  render: () => (
    <div className="dark w-full max-w-5xl">
      <SummaryPanel
        results={{
          toHit: {
            kind: "toHit",
            target: 6,
            cascade: { first: 6, followUp: 4 },
            probability: 1 / 12,
            rawTarget: 8,
            steps: [],
          },
          toWound: baseWound,
          armourSave: baseArmour,
          wardSave: baseWard,
        }}
        outcome={baseOutcome}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("8+")).toBeInTheDocument();
    await expect(canvas.getByText("To Hit")).toBeInTheDocument();
  },
};

export const ImpossibleToHit: Story = {
  render: () => (
    <div className="dark w-full max-w-5xl">
      <SummaryPanel
        results={{
          toHit: {
            kind: "toHit",
            target: "impossible",
            probability: 0,
            rawTarget: 10,
            steps: [],
          },
          toWound: baseWound,
          armourSave: baseArmour,
          wardSave: baseWard,
        }}
        outcome={baseOutcome}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const crosses = canvas.getAllByText("✕");
    await expect(crosses.length).toBeGreaterThan(0);
    await expect(canvas.getByText("To Hit")).toBeInTheDocument();
  },
};
