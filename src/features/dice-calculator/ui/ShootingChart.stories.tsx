import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ShootingChart } from "./ShootingChart";

const meta: Meta<typeof ShootingChart> = {
  title: "Dice Calculator / ShootingChart",
  component: ShootingChart,
};
export default meta;

type Story = StoryObj<typeof ShootingChart>;

export const DefaultBS3: Story = {
  args: {
    baseBS: 3,
    highlightBS: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("To Hit score at BS 1: 6"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("To Hit score at BS 3: 4"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("To Hit score at BS 7: 0"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("To Hit score at BS 10: −3"),
    ).toBeInTheDocument();
  },
};

export const ModifiedWithMinusOne: Story = {
  args: {
    baseBS: 3,
    highlightBS: 3,
    directModSum: -1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("Modifier sum at BS 3: −1"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Modifier sum at BS 10: −1"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at BS 3: 5+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at BS 1: 6→4"),
    ).toBeInTheDocument();
  },
};

export const ModifiedReachesImpossible: Story = {
  args: {
    baseBS: 1,
    highlightBS: 1,
    directModSum: -4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("After mods at BS 1: ✕"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at BS 4: 6→4"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at BS 10: 1+"),
    ).toBeInTheDocument();
  },
};
