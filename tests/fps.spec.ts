import { test, expect } from "@playwright/test";

test("FPS stays above 110 on Safari", async ({ page }) => {
  // Adjust URL as needed
  await page.goto("http://localhost:3000");

  // Wait 3 seconds to allow idle stabilisation
  await page.waitForTimeout(3000);

  const fps = await page.evaluate(() => (window as any).__fps ?? 0);
  expect(fps).toBeGreaterThanOrEqual(110);
}); 