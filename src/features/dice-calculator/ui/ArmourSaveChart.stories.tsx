import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ArmourSaveChart } from "./ArmourSaveChart";

const meta: Meta<typeof ArmourSaveChart> = {
  title: "Dice Calculator / ArmourSaveChart",
  component: ArmourSaveChart,
};
export default meta;

type Story = StoryObj<typeof ArmourSaveChart>;

export const DefaultBaseline5Plus: Story = {
  args: {
    baseAS: 5,
    highlightS: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("Base 5+ at S3-: 5+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Base 5+ at S4: 6+"),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText("Base 5+ at S5: —")).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Strength penalty at S3-: 0"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Strength penalty at S4: −1"),
    ).toBeInTheDocument();
  },
};

export const HardArmour2Plus: Story = {
  args: {
    baseAS: 2,
    highlightS: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("Base 2+ at S3-: 2+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Base 2+ at S4: 3+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Base 2+ at S5: 4+"),
    ).toBeInTheDocument();
    await expect(canvas.getByLabelText("Base 2+ at S9: —")).toBeInTheDocument();
  },
};

export const NoBaseSave: Story = {
  args: {
    baseAS: "none",
    highlightS: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Base — at S3-: —")).toBeInTheDocument();
    await expect(canvas.getByLabelText("Base — at S10: —")).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Strength penalty at S10: −7"),
    ).toBeInTheDocument();
  },
};

export const ModifiedWithArmourPiercing: Story = {
  args: {
    baseAS: 4,
    highlightS: 3,
    asModSum: -1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByLabelText("Modifier sum at S4: −1"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at S3-: 5+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at S4: 6+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("After mods at S5: —"),
    ).toBeInTheDocument();
  },
};
