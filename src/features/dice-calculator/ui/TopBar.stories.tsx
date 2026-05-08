import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "./TopBar";

const meta = {
  title: "features/dice-calculator/TopBar",
  component: TopBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  render: () => (
    <div className="dark w-full max-w-5xl">
      <TopBar />
    </div>
  ),
};
