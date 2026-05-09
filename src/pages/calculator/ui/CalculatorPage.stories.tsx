import type { Meta, StoryObj } from "@storybook/react-vite";
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
