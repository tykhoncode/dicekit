import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NumberStepper } from "./number-stepper";

const meta = {
  title: "shared/ui/NumberStepper",
  component: NumberStepper,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { label: "Stat", value: 4, onChange: () => {} },
} satisfies Meta<typeof NumberStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({
  initial,
  ...rest
}: {
  initial: number;
  label: string;
  min?: number;
  max?: number;
}) {
  const [value, setValue] = useState(initial);
  return <NumberStepper value={value} onChange={setValue} {...rest} />;
}

export const Default: Story = {
  render: () => <Controlled label="Attacker WS" initial={4} />,
};

export const AtMin: Story = {
  render: () => <Controlled label="Strength" initial={1} />,
};

export const AtMax: Story = {
  render: () => <Controlled label="Toughness" initial={10} />,
};
