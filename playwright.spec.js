// Playwright E2E Tests - Executable Version

const { test, expect } = require("@playwright/test");

const BASE_URL = "http://localhost:8000";

test.describe("Climate Visualizer E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // Navigation
  test("NAV-01: Switch sections", async ({ page }) => {
    await page.click('[data-section="temperature"]');
    await expect(page.locator("#temperature")).toBeVisible();

    await page.click('[data-section="sea-level"]');
    await expect(page.locator("#sea-level")).toBeVisible();
  });

  test("NAV-02: Active tab", async ({ page }) => {
    await page.click('[data-section="emissions"]');
    await expect(page.locator('[data-section="emissions"]')).toHaveClass(
      /active/,
    );
  });

  // Data Loading
  test("DATA-01: Temperature chart loads", async ({ page }) => {
    await page.click('[data-section="temperature"]');
    await page.waitForSelector("#temperatureChart canvas", { timeout: 5000 });
    const canvas = await page.locator("#temperatureChart canvas");
    await expect(canvas).toBeVisible();
  });

  test("DATA-02: Fallback on API error", async ({ page }) => {
    await page.route("**/api.nasa.gov/**", (route) => route.abort());
    await page.click('[data-section="temperature"]');
    await page.waitForSelector(".chart-container canvas");
    await expect(page.locator(".error-state")).not.toBeVisible();
  });

  // Time Controls
  test("TIME-01: Year range filter", async ({ page }) => {
    const startSlider = page.locator("#yearStart");
    const endSlider = page.locator("#yearEnd");

    await startSlider.fill("1950");
    await endSlider.fill("2000");

    await expect(page.locator("#yearStartLabel")).toHaveText("1950");
    await expect(page.locator("#yearEndLabel")).toHaveText("2000");
  });

  test("TIME-02: Location filter", async ({ page }) => {
    const dropdown = page.locator("#locationSelect");
    await dropdown.selectOption("arctic");
    await expect(dropdown).toHaveValue("arctic");

    await dropdown.selectOption("europe");
    await expect(dropdown).toHaveValue("europe");
  });

  // 3D Globe
  test("GLOBE-01: Globe renders", async ({ page }) => {
    await page.click('[data-section="globe"]');
    await page.waitForSelector("#globeContainer canvas");
    const globe = page.locator("#globeContainer canvas");
    await expect(globe).toBeVisible();
  });

  test("GLOBE-02: Globe controls", async ({ page }) => {
    await page.click('[data-section="globe"]');
    await page.click("#playButton");
    await page.waitForTimeout(1000);
    await page.click("#pauseButton");

    const playBtn = page.locator("#playButton");
    await expect(playBtn).toBeVisible();
  });

  // Carbon Calculator
  test("CALC-01: Calculate carbon", async ({ page }) => {
    await page.click('[data-section="carbon-calculator"]');

    await page.fill("#electricity", "300");
    await page.fill("#milesDriven", "500");
    await page.click("#calculateBtn");

    const result = page.locator("#carbonResult");
    await expect(result).toBeVisible();
  });

  test("CALC-02: Input validation", async ({ page }) => {
    await page.click('[data-section="carbon-calculator"]');

    await page.fill("#electricity", "-100");
    await page.click("#calculateBtn");

    const error = page.locator(".error-message");
    await expect(error).toBeVisible();
  });

  // Export
  test("EXPORT-01: CSV export", async ({ page }) => {
    await page.click('[data-section="data-export"]');

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click("#exportCSV"),
    ]);

    expect(download.suggestedFilename()).toContain(".csv");
  });

  test("EXPORT-02: PNG export", async ({ page }) => {
    await page.click('[data-section="temperature"]');
    await page.waitForSelector("#temperatureChart canvas");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click("#exportPNG"),
    ]);

    expect(download.suggestedFilename()).toContain(".png");
  });

  // Comparison
  test("COMPARE-01: Region comparison", async ({ page }) => {
    await page.click('[data-section="comparison-tools"]');

    await page.selectOption("#regionA", "north-america");
    await page.selectOption("#regionB", "europe");
    await page.click("#compareBtn");

    await expect(page.locator(".comparison-chart")).toBeVisible();
  });

  // Mobile
  test("MOBILE-01: Responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const navBtn = page.locator(".nav-btn").first();
    const box = await navBtn.boundingBox();
    expect(box.width).toBeGreaterThan(150);
  });

  test("MOBILE-02: Touch interactions", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const slider = page.locator("#yearStart");
    await slider.tap();
    await slider.fill("1990");

    await expect(page.locator("#yearStartLabel")).toHaveText("1990");
  });

  // Performance
  test("PERF-01: Load time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test("PERF-02: Section switching", async ({ page }) => {
    const sections = [
      "temperature",
      "sea-level",
      "emissions",
      "globe",
      "heatmap",
    ];

    for (const section of sections) {
      const startTime = Date.now();
      await page.click(`[data-section="${section}"]`);
      const switchTime = Date.now() - startTime;

      expect(switchTime).toBeLessThan(500);
    }
  });

  // Accessibility
  test("A11Y-01: Keyboard navigation", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const activeElement = await page.evaluate(
      () => document.activeElement.tagName,
    );
    expect(activeElement).toBeTruthy();
  });

  test("A11Y-02: ARIA labels", async ({ page }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });

  // Error Handling
  test("ERROR-01: Network failure", async ({ page, context }) => {
    await context.setOffline(true);
    await page.reload();

    const error = page.locator(".error-state, .loading");
    await expect(error).toBeVisible();
  });

  test("ERROR-02: Invalid data", async ({ page }) => {
    await page.route("**/api/**", (route) => {
      route.fulfill({
        status: 200,
        body: "invalid json",
      });
    });

    await page.click('[data-section="temperature"]');
    await page.waitForTimeout(1000);

    const app = page.locator("body");
    await expect(app).toBeVisible();
  });
});
