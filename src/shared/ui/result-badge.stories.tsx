import { within, expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResultBadge } from "./result-badge";

const meta = {
  title: "shared/ui/ResultBadge",
  component: ResultBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ResultBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { target: 4, probability: 0.5, kind: "toHit" },
};

export const HighProbability: Story = {
  args: { target: 2, probability: 5 / 6, kind: "toWound" },
};

export const Unrollable: Story = {
  args: { target: "no-save", probability: 0, kind: "armourSave" },
};

export const OnePlus: Story = {
  args: { target: 1, probability: 5 / 6, kind: "armourSave" },
};

export const ShootingCascade: Story = {
  args: {
    target: 6,
    cascade: { first: 6, followUp: 4 },
    probability: 1 / 12,
    kind: "toHit",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("6+")).toBeInTheDocument();
    await expect(canvas.getByText("4+")).toBeInTheDocument();
    await expect(canvas.getByText(/8\.3%/)).toBeInTheDocument();
  },
};

export const Impossible: Story = {
  args: { target: "impossible", probability: 0, kind: "toHit" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("✕")).toBeInTheDocument();
    await expect(canvas.getByText(/Cannot hit/i)).toBeInTheDocument();
  },
};
