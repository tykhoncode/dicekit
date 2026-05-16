import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type { ModifierId } from "@/entities/dice/model/types";
import { useDiceCalculator } from "../model/useDiceCalculator";
import { ToWoundCard } from "./ToWoundCard";

const meta = {
  title: "features/dice-calculator/ToWoundCard",
  component: ToWoundCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToWoundCard>;

export default meta;

type Story = StoryObj<typeof ToWoundCard>;

function Live({ activate = [] }: { activate?: ModifierId[] }) {
  const calc = useDiceCalculator();
  useEffect(() => {
    for (const id of activate) calc.actions.toggleModifier("toWound", id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-72">
      <ToWoundCard
        state={calc.state.toWound}
        attackMode={calc.state.attackMode}
        result={calc.results.toWound}
        onSetStat={(key, value) => calc.actions.setStat("toWound", key, value)}
        onToggleModifier={(id) => calc.actions.toggleModifier("toWound", id)}
        onSetModifierValue={(id, value) =>
          calc.actions.setModifierValue("toWound", id, value)
        }
        onSetModifierValueDef={(id, value) =>
          calc.actions.setModifierValueDef("toWound", id, value)
        }
        onSetModifierTarget={(id, target) =>
          calc.actions.setModifierTarget("toWound", id, target)
        }
        onTogglePinned={(id) => calc.actions.togglePinned("toWound", id)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Live />,
};

export const WithGreatWeapon: Story = {
  render: () => <Live activate={["toWound:greatWeapon"]} />,
};

export const WithWyssansWildform: Story = {
  render: () => <Live activate={["toWound:wyssansWildform"]} />,
};
