import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ModifierToggleRow } from "./modifier-toggle-row";

const meta = {
  title: "shared/ui/ModifierToggleRow",
  component: ModifierToggleRow,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Modifier",
    effectLabel: "+1",
    active: false,
    onToggle: () => {},
  },
} satisfies Meta<typeof ModifierToggleRow>;

export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({
  initial,
  label,
  effectLabel,
}: {
  initial: boolean;
  label: string;
  effectLabel: string;
}) {
  const [active, setActive] = useState(initial);
  return (
    <div className="w-72">
      <ModifierToggleRow
        label={label}
        effectLabel={effectLabel}
        active={active}
        onToggle={() => setActive((v) => !v)}
      />
    </div>
  );
}

export const Inactive: Story = {
  render: () => (
    <Controlled label="Charging" effectLabel="+1" initial={false} />
  ),
};

export const ActiveBonus: Story = {
  render: () => <Controlled label="Charging" effectLabel="+1" initial={true} />,
};

export const ActivePenalty: Story = {
  render: () => (
    <Controlled label="Long Range Penalty" effectLabel="-1" initial={true} />
  ),
};
