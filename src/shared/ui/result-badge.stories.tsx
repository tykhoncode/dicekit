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
