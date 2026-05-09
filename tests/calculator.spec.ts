import { test, expect } from "@playwright/test";

test.describe("calculator page", () => {
  test("renders the four cards with default required rolls", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByText("To Hit", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("To Wound", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Armour Save", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Ward Save", { exact: true }).first(),
    ).toBeVisible();

    await expect(page.getByText("50.0% chance to hit")).toBeVisible();
    await expect(page.getByText("66.7% chance to wound")).toBeVisible();
    await expect(page.getByText("33.3% chance to save")).toHaveCount(2);
  });

  test("toggling a +1 modifier changes the To Hit required roll", async ({
    page,
  }) => {
    await page.goto("/");
    const before = await page.getByText("chance to hit").first().textContent();
    await page
      .getByRole("switch", { name: /^Enchanted Blades of Aiban,/ })
      .click();
    const after = await page.getByText("chance to hit").first().textContent();
    expect(after).not.toBe(before);
  });

  test("summary panel renders default Combat Sequence and Estimated Outcome", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Combat Sequence")).toBeVisible();
    await expect(page.getByText("Estimated Outcome")).toBeVisible();
    await expect(page.getByText("14.8% Chance of unsaved wound")).toBeVisible();
    await expect(page.getByText("0.148 Expected unsaved wounds")).toBeVisible();
  });

  test("toggling a modifier updates the Estimated Outcome", async ({
    page,
  }) => {
    await page.goto("/");
    const before = await page
      .getByText(/Chance of unsaved wound/)
      .textContent();
    await page
      .getByRole("switch", { name: /^Enchanted Blades of Aiban,/ })
      .click();
    const after = await page.getByText(/Chance of unsaved wound/).textContent();
    expect(after).not.toBe(before);
  });

  test("Reset All restores defaults after a state change", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("switch", { name: /^Enchanted Blades of Aiban,/ })
      .click();
    await page.getByRole("switch", { name: /^Sword of Striking,/ }).click();
    await expect(page.getByText("50.0% chance to hit")).toHaveCount(0);

    await page.getByRole("button", { name: "Reset All" }).click();

    await expect(page.getByText("50.0% chance to hit")).toBeVisible();
    await expect(page.getByText("66.7% chance to wound")).toBeVisible();
    await expect(page.getByText("14.8% Chance of unsaved wound")).toBeVisible();
  });

  test("Share and Settings are visible non-functional placeholders", async ({
    page,
  }) => {
    await page.goto("/");
    const before = await page.getByText("50.0% chance to hit").textContent();
    await page.getByRole("button", { name: /^Share$/ }).click();
    await page.getByRole("button", { name: /^Settings$/ }).click();
    const after = await page.getByText("50.0% chance to hit").textContent();
    expect(after).toBe(before);
  });
});
