import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ArmourSaveChartPanel } from "./ArmourSaveChartPanel";

const meta: Meta<typeof ArmourSaveChartPanel> = {
  title: "Dice Calculator / ArmourSaveChartPanel",
  component: ArmourSaveChartPanel,
};
export default meta;

type Story = StoryObj<typeof ArmourSaveChartPanel>;

export const Default: Story = {
  args: {
    baseAS: 5,
    baseS: 3,
    effectiveS: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("tab", { name: /Unmodified/ }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByLabelText("Base 5+ at S3-: 5+"),
    ).toBeInTheDocument();
  },
};

export const ToggleSwitchesHighlight: Story = {
  args: {
    baseAS: 5,
    baseS: 3,
    effectiveS: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const modified = canvas.getByRole("tab", { name: /Modified/ });
    await userEvent.click(modified);
    await expect(modified).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByLabelText("Base 5+ at S5: —")).toBeInTheDocument();
  },
};

export const ModifiedShowsModRows: Story = {
  args: {
    baseAS: 4,
    baseS: 3,
    effectiveS: 3,
    asModSum: -1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByLabelText("After mods at S3-: 5+"),
    ).not.toBeInTheDocument();
    const modified = canvas.getByRole("tab", { name: /Modified/ });
    await userEvent.click(modified);
    await expect(modified).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByLabelText("After mods at S3-: 5+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Modifier sum at S4: −1"),
    ).toBeInTheDocument();
  },
};
