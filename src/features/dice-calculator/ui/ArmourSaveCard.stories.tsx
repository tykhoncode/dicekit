import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type { ModifierId } from "@/entities/dice/model/types";
import { useDiceCalculator } from "../model/useDiceCalculator";
import { ArmourSaveCard } from "./ArmourSaveCard";

const meta = {
  title: "features/dice-calculator/ArmourSaveCard",
  component: ArmourSaveCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ArmourSaveCard>;

export default meta;

type Story = StoryObj<typeof ArmourSaveCard>;

function Live({
  activate = [],
  strength,
}: {
  activate?: ModifierId[];
  strength?: number;
}) {
  const calc = useDiceCalculator();
  useEffect(() => {
    for (const id of activate) calc.actions.toggleModifier("armourSave", id);
    if (strength !== undefined)
      calc.actions.setStat("toWound", "strength", strength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-72">
      <ArmourSaveCard
        state={calc.state.armourSave}
        attackMode={calc.state.attackMode}
        baseStrength={calc.state.toWound.inputs.strength ?? 3}
        effectiveStrength={calc.state.toWound.inputs.strength ?? 3}
        result={calc.results.armourSave}
        onSetSaveTarget={(v) => calc.actions.setSaveTarget("armourSave", v)}
        onToggleModifier={(id) => calc.actions.toggleModifier("armourSave", id)}
        onSetModifierValue={(id, value) =>
          calc.actions.setModifierValue("armourSave", id, value)
        }
        onSetModifierValueDef={(id, value) =>
          calc.actions.setModifierValueDef("armourSave", id, value)
        }
        onSetModifierTarget={(id, target) =>
          calc.actions.setModifierTarget("armourSave", id, target)
        }
        onTogglePinned={(id) => calc.actions.togglePinned("armourSave", id)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Live />,
};

export const WithShield: Story = {
  render: () => <Live activate={["armourSave:shield"]} />,
};

export const WithStrength6Penalty: Story = {
  render: () => <Live strength={6} />,
};

export const NoSave: Story = {
  render: () => <Live activate={["armourSave:armourPiercing"]} strength={8} />,
};
