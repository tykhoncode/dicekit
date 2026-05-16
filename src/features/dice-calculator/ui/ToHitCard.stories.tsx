import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { AttackMode, ModifierId } from "@/entities/dice/model/types";
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

function Live({
  activate = [],
  initialMode,
}: {
  activate?: ModifierId[];
  initialMode?: AttackMode;
}) {
  const calc = useDiceCalculator();
  useEffect(() => {
    if (initialMode) calc.actions.setAttackMode(initialMode);
    for (const id of activate) calc.actions.toggleModifier("toHit", id);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dark w-80">
      <ToHitCard
        state={calc.state.toHit}
        attackMode={calc.state.attackMode}
        result={calc.results.toHit}
        onSetAttackMode={(mode) => calc.actions.setAttackMode(mode)}
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

export const Shooting: Story = {
  render: () => <Live initialMode="shooting" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });
    await expect(shootingTab).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByRole("button", { name: /Decrease Attacker BS/ }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(/50\.0% chance to hit/)).toBeInTheDocument();
  },
};

export const ModeSwitchPreservesState: Story = {
  render: () => <Live />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meleeTab = canvas.getByRole("tab", { name: /Melee/ });
    const shootingTab = canvas.getByRole("tab", { name: /Shooting/ });

    const fearSwitch = canvas.getByRole("switch", {
      name: /Fear \(Failed Test\)/,
    });
    await userEvent.click(fearSwitch);
    await expect(fearSwitch).toHaveAttribute("aria-checked", "true");

    await userEvent.click(shootingTab);
    await expect(
      canvas.queryByRole("switch", { name: /Fear \(Failed Test\)/ }),
    ).not.toBeInTheDocument();

    await userEvent.click(meleeTab);
    const fearSwitchBack = canvas.getByRole("switch", {
      name: /Fear \(Failed Test\)/,
    });
    await expect(fearSwitchBack).toHaveAttribute("aria-checked", "true");
  },
};
