import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "shared/ui/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="4">
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Pick a target" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2">2+</SelectItem>
        <SelectItem value="3">3+</SelectItem>
        <SelectItem value="4">4+</SelectItem>
        <SelectItem value="5">5+</SelectItem>
        <SelectItem value="6">6+</SelectItem>
      </SelectContent>
    </Select>
  ),
};
