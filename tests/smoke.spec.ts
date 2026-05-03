import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home page renders welcome", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Welcome", level: 1 }),
    ).toBeVisible();
  });

  test("unknown route renders 404 with link home", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(
      page.getByRole("heading", { name: "404", level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Go home" }).click();
    await expect(
      page.getByRole("heading", { name: "Welcome", level: 1 }),
    ).toBeVisible();
  });

  test("no console errors on initial load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Welcome", level: 1 }),
    ).toBeVisible();

    expect(errors).toEqual([]);
  });
});
