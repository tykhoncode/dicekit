import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ShootingChartPanel } from "./ShootingChartPanel";

const meta: Meta<typeof ShootingChartPanel> = {
  title: "Dice Calculator / ShootingChartPanel",
  component: ShootingChartPanel,
};
export default meta;

type Story = StoryObj<typeof ShootingChartPanel>;

export const Default: Story = {
  args: {
    baseBS: 3,
    effectiveBS: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("tab", { name: /Unmodified/ }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByLabelText("To Hit score at BS 3: 4"),
    ).toBeInTheDocument();
  },
};

export const ModifiedShowsModsAndAfter: Story = {
  args: {
    baseBS: 3,
    effectiveBS: 3,
    directModSum: -1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByLabelText("After mods at BS 3: 5+"),
    ).not.toBeInTheDocument();
    const modified = canvas.getByRole("tab", { name: /Modified/ });
    await userEvent.click(modified);
    await expect(modified).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByLabelText("After mods at BS 3: 5+"),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText("Modifier sum at BS 3: −1"),
    ).toBeInTheDocument();
  },
};
