import { defineConfig, devices } from "@playwright/test";

/**
 * Local: start `npm run dev` (or `npm run preview`) yourself before running
 * `npx playwright test` — the dev server is intentionally not auto-managed
 * so devs control their own loop.
 *
 * CI: `webServer` below auto-starts `vite preview` against the production
 * build on port 5173.
 *
 * Override `SMOKE_BASE_URL` to point at a deployed preview/staging URL.
 */
const baseURL = process.env.SMOKE_BASE_URL ?? "http://localhost:5173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer:
    process.env.CI && !process.env.SMOKE_BASE_URL
      ? {
          command: "npm run preview -- --port 5173 --strictPort",
          url: baseURL,
          reuseExistingServer: false,
          timeout: 60_000,
          stdout: "ignore",
          stderr: "pipe",
        }
      : undefined,
});
