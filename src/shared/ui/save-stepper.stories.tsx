import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { SaveBaseTarget } from "@/entities/dice/model/types";
import { SaveStepper } from "./save-stepper";

const meta = {
  title: "shared/ui/SaveStepper",
  component: SaveStepper,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Base Armour Save",
    value: "none" as SaveBaseTarget,
    onChange: () => {},
  },
} satisfies Meta<typeof SaveStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({ initial }: { initial: SaveBaseTarget }) {
  const [value, setValue] = useState<SaveBaseTarget>(initial);
  return (
    <SaveStepper label="Base Armour Save" value={value} onChange={setValue} />
  );
}

export const Default: Story = {
  render: () => <Controlled initial="none" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const display = canvas.getByRole("generic", {
      name: /Base Armour Save: —/,
    });
    await expect(display).toHaveTextContent("—");
    const improveButton = canvas.getByRole("button", {
      name: /Improve Base Armour Save/,
    });
    await userEvent.click(improveButton);
    await expect(display).toHaveTextContent("6+");
  },
};

export const PlusImprovesSave: Story = {
  render: () => <Controlled initial={4} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const improveButton = canvas.getByRole("button", {
      name: /Improve Base Armour Save/,
    });
    await userEvent.click(improveButton);
    const display = canvas.getByRole("generic", {
      name: /Base Armour Save: 3\+/,
    });
    await expect(display).toHaveTextContent("3+");
  },
};

export const MinusWorsensSave: Story = {
  render: () => <Controlled initial={3} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const worsenButton = canvas.getByRole("button", {
      name: /Worsen Base Armour Save/,
    });
    await userEvent.click(worsenButton);
    const display = canvas.getByRole("generic", {
      name: /Base Armour Save: 4\+/,
    });
    await expect(display).toHaveTextContent("4+");
  },
};

export const CannotImprovePast1Plus: Story = {
  render: () => <Controlled initial={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const improveButton = canvas.getByRole("button", {
      name: /Improve Base Armour Save/,
    });
    await expect(improveButton).toBeDisabled();
  },
};

export const CannotWorsenPastNone: Story = {
  render: () => <Controlled initial="none" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const worsenButton = canvas.getByRole("button", {
      name: /Worsen Base Armour Save/,
    });
    await expect(worsenButton).toBeDisabled();
  },
};
