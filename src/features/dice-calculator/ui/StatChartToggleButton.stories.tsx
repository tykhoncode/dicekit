import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { StatChartToggleButton } from "./StatChartToggleButton";

const meta: Meta<typeof StatChartToggleButton> = {
  title: "Dice Calculator / StatChartToggleButton",
  component: StatChartToggleButton,
};
export default meta;

type Story = StoryObj<typeof StatChartToggleButton>;

function Controlled({ initial }: { initial: boolean }) {
  const [pressed, setPressed] = useState(initial);
  return (
    <StatChartToggleButton pressed={pressed} onPressedChange={setPressed} />
  );
}

export const Idle: Story = {
  render: () => <Controlled initial={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Show table/ });
    await expect(button).toHaveAttribute("aria-pressed", "false");
  },
};

export const Pressed: Story = {
  render: () => <Controlled initial={true} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Show table/ });
    await expect(button).toHaveAttribute("aria-pressed", "true");
  },
};

export const TogglesOnClick: Story = {
  render: () => <Controlled initial={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Show table/ });
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  },
};
