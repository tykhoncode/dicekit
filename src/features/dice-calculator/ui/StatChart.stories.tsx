import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { lookupToHit, lookupToWound } from "@/entities/dice/lib/charts";
import { StatChart } from "./StatChart";

const meta: Meta<typeof StatChart> = {
  title: "Dice Calculator / StatChart",
  component: StatChart,
};
export default meta;

type Story = StoryObj<typeof StatChart>;

export const ToHitDefault: Story = {
  args: {
    rowLabel: "Attacker WS",
    colLabel: "Defender WS",
    lookup: (r, c) => lookupToHit(r, c),
    highlight: { row: 3, col: 3 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // WS 3 vs WS 3 = 4+
    await expect(
      canvas.getByLabelText("Attacker WS 3 vs Defender WS 3: 4+"),
    ).toBeInTheDocument();
    // Cells from other rows / cols exist too
    await expect(
      canvas.getByLabelText("Attacker WS 1 vs Defender WS 10: 5+"),
    ).toBeInTheDocument();
  },
};

export const ToWoundHighlightShifts: Story = {
  args: {
    rowLabel: "Attacker S",
    colLabel: "Defender T",
    lookup: (r, c) => lookupToWound(r, c),
    highlight: { row: 4, col: 3 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // S 4 vs T 3 = 3+
    await expect(
      canvas.getByLabelText("Attacker S 4 vs Defender T 3: 3+"),
    ).toBeInTheDocument();
  },
};

export const ImpossibleHighlight: Story = {
  args: {
    rowLabel: "Attacker S",
    colLabel: "Defender T",
    lookup: (r, c) => lookupToWound(r, c),
    highlight: { row: 1, col: 10 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // S 1 vs T 10 = "6+" via the lookupToWound formula's else branch.
    await expect(
      canvas.getByLabelText("Attacker S 1 vs Defender T 10: 6+"),
    ).toBeInTheDocument();
  },
};
