import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type { ModifierId } from "@/entities/dice/model/types";
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
      toHit={["toHit:charging"]}
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
