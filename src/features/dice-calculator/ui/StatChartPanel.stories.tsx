import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { lookupToHit } from "@/entities/dice/lib/charts";
import { StatChartPanel } from "./StatChartPanel";

const meta: Meta<typeof StatChartPanel> = {
  title: "Dice Calculator / StatChartPanel",
  component: StatChartPanel,
};
export default meta;

type Story = StoryObj<typeof StatChartPanel>;

export const Default: Story = {
  args: {
    rowLabel: "Attacker WS",
    colLabel: "Defender WS",
    lookup: lookupToHit,
    baseRow: 3,
    baseCol: 3,
    effectiveRow: 3,
    effectiveCol: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("tab", { name: /Unmodified/ }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByLabelText("Attacker WS 3 vs Defender WS 3: 4+"),
    ).toBeInTheDocument();
  },
};

export const ToggleSwitchesHighlight: Story = {
  args: {
    rowLabel: "Attacker WS",
    colLabel: "Defender WS",
    lookup: lookupToHit,
    baseRow: 3,
    baseCol: 3,
    effectiveRow: 5,
    effectiveCol: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const modified = canvas.getByRole("tab", { name: /Modified/ });
    await userEvent.click(modified);
    await expect(modified).toHaveAttribute("aria-selected", "true");
  },
};

export const ModifiedShowsMiniTable: Story = {
  args: {
    rowLabel: "Attacker WS",
    colLabel: "Defender WS",
    lookup: lookupToHit,
    baseRow: 3,
    baseCol: 3,
    effectiveRow: 3,
    effectiveCol: 3,
    directModSum: 1,
    finalTarget: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByLabelText("Direct modifier sum: +1"),
    ).not.toBeInTheDocument();
    const modified = canvas.getByRole("tab", { name: /Modified/ });
    await userEvent.click(modified);
    await expect(
      canvas.getByLabelText("Direct modifier sum: +1"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Final required roll: 3+"),
    ).toBeInTheDocument();
  },
};
