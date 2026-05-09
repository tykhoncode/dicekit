import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type { ModifierId } from "@/entities/dice/model/types";
import { useDiceCalculator } from "../model/useDiceCalculator";
import { WardSaveCard } from "./WardSaveCard";

const meta = {
  title: "features/dice-calculator/WardSaveCard",
  component: WardSaveCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof WardSaveCard>;

export default meta;

type Story = StoryObj<typeof WardSaveCard>;

function Live({ activate = [] }: { activate?: ModifierId[] }) {
  const calc = useDiceCalculator();
  useEffect(() => {
    for (const id of activate) calc.actions.toggleModifier("wardSave", id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-72">
      <WardSaveCard
        state={calc.state.wardSave}
        result={calc.results.wardSave}
        onSetSaveTarget={(v) => calc.actions.setSaveTarget("wardSave", v)}
        onToggleModifier={(id) => calc.actions.toggleModifier("wardSave", id)}
        onSetModifierValue={(id, value) =>
          calc.actions.setModifierValue("wardSave", id, value)
        }
        onSetModifierValueDef={(id, value) =>
          calc.actions.setModifierValueDef("wardSave", id, value)
        }
        onSetModifierTarget={(id, target) =>
          calc.actions.setModifierTarget("wardSave", id, target)
        }
        onTogglePinned={(id) => calc.actions.togglePinned("wardSave", id)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Live />,
};

export const WithMagicResistance: Story = {
  render: () => <Live activate={["wardSave:magicResistance"]} />,
};
