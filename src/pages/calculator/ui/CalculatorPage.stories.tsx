import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CalculatorPage } from "./CalculatorPage";

const meta = {
  title: "pages/CalculatorPage",
  component: CalculatorPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof CalculatorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShootingDefault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    await userEvent.click(shootingTab);
    await expect(
      canvas.getByRole("button", { name: /Decrease Attacker BS/ }),
    ).toBeInTheDocument();
  },
};
