import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { AttackMode } from "@/entities/dice";
import { AttackModeTabs } from "./AttackModeTabs";

const meta = {
  title: "features/dice-calculator/AttackModeTabs",
  component: AttackModeTabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    value: "melee",
    onChange: () => {},
  },
} satisfies Meta<typeof AttackModeTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({ initial }: { initial: AttackMode }) {
  const [mode, setMode] = useState<AttackMode>(initial);
  return <AttackModeTabs value={mode} onChange={setMode} />;
}

export const MeleeActive: Story = {
  render: () => <Controlled initial="melee" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meleeTab = canvas.getByRole("tab", { name: /Melee/ });
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    await expect(meleeTab).toHaveAttribute("aria-selected", "true");
    await expect(shootingTab).toHaveAttribute("aria-selected", "false");
  },
};

export const ShootingActive: Story = {
  render: () => <Controlled initial="shooting" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    await expect(shootingTab).toHaveAttribute("aria-selected", "true");
  },
};

export const ClickSwitchesMode: Story = {
  render: () => <Controlled initial="melee" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    await userEvent.click(shootingTab);
    await expect(shootingTab).toHaveAttribute("aria-selected", "true");
  },
};

export const ArrowKeysSwitchMode: Story = {
  render: () => <Controlled initial="melee" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meleeTab = canvas.getByRole("tab", { name: /Melee/ });
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    meleeTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(shootingTab).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(meleeTab).toHaveAttribute("aria-selected", "true");
  },
};
