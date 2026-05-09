import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { SaveSelect } from "./save-select";

const meta = {
  title: "shared/ui/SaveSelect",
  component: SaveSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { label: "Base", value: 4 as SaveBaseTarget, onChange: () => {} },
} satisfies Meta<typeof SaveSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({
  initial,
  label,
}: {
  initial: SaveBaseTarget;
  label: string;
}) {
  const [value, setValue] = useState<SaveBaseTarget>(initial);
  return <SaveSelect label={label} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <Controlled label="Base Armour Save" initial={6} />,
};

export const Ward: Story = {
  render: () => <Controlled label="Base Ward Save" initial="none" />,
};

export const NoSave: Story = {
  render: () => <Controlled label="Base Armour Save" initial="none" />,
};
