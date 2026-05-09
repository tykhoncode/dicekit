import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import type { ModifierId } from "@/entities/dice/model/types";
import { useDiceCalculator } from "../model/useDiceCalculator";
import { ToHitCard } from "./ToHitCard";

const meta = {
  title: "features/dice-calculator/ToHitCard",
  component: ToHitCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToHitCard>;

export default meta;

type Story = StoryObj<typeof ToHitCard>;

function Live({ activate = [] }: { activate?: ModifierId[] }) {
  const calc = useDiceCalculator();
  useEffect(() => {
    for (const id of activate) calc.actions.toggleModifier("toHit", id);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-80">
      <ToHitCard
        state={calc.state.toHit}
        result={calc.results.toHit}
        onSetStat={(key, value) => calc.actions.setStat("toHit", key, value)}
        onToggleModifier={(id) => calc.actions.toggleModifier("toHit", id)}
        onSetModifierValue={(id, value) =>
          calc.actions.setModifierValue("toHit", id, value)
        }
        onSetModifierValueDef={(id, value) =>
          calc.actions.setModifierValueDef("toHit", id, value)
        }
        onSetModifierTarget={(id, target) =>
          calc.actions.setModifierTarget("toHit", id, target)
        }
        onTogglePinned={(id) => calc.actions.togglePinned("toHit", id)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Live />,
};

export const WithEnchantedBlades: Story = {
  render: () => <Live activate={["toHit:enchantedBlades"]} />,
};

export const WithFear: Story = {
  render: () => <Live activate={["toHit:fear"]} />,
};

export const WithSpeedOfLight: Story = {
  render: () => <Live activate={["toHit:speedOfLight"]} />,
};

export const WithHandOfGlory: Story = {
  render: () => <Live activate={["toHit:handOfGlory"]} />,
};

export const StackedDebuffs: Story = {
  render: () => (
    <Live
      activate={[
        "toHit:phasProtection",
        "toHit:iceshardBlizzard",
        "toHit:markOfNurgle",
      ]}
    />
  ),
};
