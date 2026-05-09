import type { Meta, StoryObj } from "@storybook/react-vite";
import { Swords } from "lucide-react";
import { ResultBadge } from "@/shared/ui/result-badge";
import { CalculatorCard } from "./CalculatorCard";

const meta = {
  title: "features/dice-calculator/CalculatorCard",
  component: CalculatorCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    icon: <Swords />,
    title: "Card title",
    subtitle: "subtitle",
    infoText: "Info tooltip body.",
    inputs: <span className="text-xs text-muted-foreground">inputs slot</span>,
    modifiers: (
      <div className="text-xs text-muted-foreground">modifiers slot</div>
    ),
    result: <ResultBadge target={4} probability={0.5} kind="toHit" />,
  },
} satisfies Meta<typeof CalculatorCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="dark w-72">
      <CalculatorCard {...args} />
    </div>
  ),
};
