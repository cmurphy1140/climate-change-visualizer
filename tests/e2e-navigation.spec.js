// E2E Tests for Phase 1: Modern Navigation Implementation
// Using Playwright for comprehensive testing

const { test, expect } = require("@playwright/test");

test.describe("Phase 1: Modern Navigation Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("file://" + __dirname + "/index-modern.html");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Sidebar Navigation", () => {
    test("should render sidebar with all navigation items", async ({
      page,
    }) => {
      // Check sidebar exists
      const sidebar = await page.locator("#sidebar");
      await expect(sidebar).toBeVisible();

      // Verify all nav sections are present
      const navSections = await page.locator(".nav-section").count();
      expect(navSections).toBe(3); // Climate Data, Visualizations, Tools

      // Verify all nav items
      const expectedItems = [
        "Dashboard",
        "Temperature",
        "Sea Level",
        "Emissions",
        "Extreme Events",
        "Global Heatmap",
        "3D Globe",
        "Future Projections",
        "Carbon Calculator",
        "Compare Regions",
        "Impact Assessment",
        "Export Data",
      ];

      for (const item of expectedItems) {
        const navItem = await page.locator(`.nav-item:has-text("${item}")`);
        await expect(navItem).toBeVisible();
      }
    });

    test("should collapse and expand sidebar on desktop", async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });

      const sidebar = await page.locator("#sidebar");
      const menuToggle = await page.locator("#menuToggle");

      // Initially expanded
      await expect(sidebar).not.toHaveClass(/collapsed/);

      // Click to collapse
      await menuToggle.click();
      await expect(sidebar).toHaveClass(/collapsed/);

      // Labels should be hidden when collapsed
      const navLabel = await page.locator(".nav-label").first();
      await expect(navLabel).toHaveCSS("opacity", "0");

      // Click to expand
      await menuToggle.click();
      await expect(sidebar).not.toHaveClass(/collapsed/);
    });

    test("should show tooltips on hover when sidebar is collapsed", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1200, height: 800 });

      // Collapse sidebar
      await page.locator("#menuToggle").click();

      // Hover over nav item
      const tempItem = await page.locator('.nav-item:has-text("Temperature")');
      await tempItem.hover();

      // Check tooltip appears
      await page.waitForTimeout(200);
      const tooltip = await page.locator(".nav-tooltip");
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveText("Temperature");
    });

    test("should toggle sidebar on mobile", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const sidebar = await page.locator("#sidebar");
      const menuToggle = await page.locator("#menuToggle");

      // Initially hidden on mobile
      await expect(sidebar).not.toHaveClass(/open/);

      // Click to open
      await menuToggle.click();
      await expect(sidebar).toHaveClass(/open/);

      // Click to close
      await menuToggle.click();
      await expect(sidebar).not.toHaveClass(/open/);
    });
  });

  test.describe("Navigation Functionality", () => {
    test("should navigate between sections", async ({ page }) => {
      // Click Temperature nav item
      await page.locator('.nav-item:has-text("Temperature")').click();

      // Check Temperature section is active
      const tempSection = await page.locator("#temperature");
      await expect(tempSection).toHaveClass(/active/);

      // Check nav item is active
      const tempNav = await page.locator('.nav-item:has-text("Temperature")');
      await expect(tempNav).toHaveClass(/active/);

      // Navigate to Sea Level
      await page.locator('.nav-item:has-text("Sea Level")').click();

      // Check Sea Level section is active
      const seaSection = await page.locator("#sea-level");
      await expect(seaSection).toHaveClass(/active/);

      // Temperature should not be active
      await expect(tempSection).not.toHaveClass(/active/);
    });

    test("should update URL hash on navigation", async ({ page }) => {
      // Navigate to Temperature
      await page.locator('.nav-item:has-text("Temperature")').click();
      await expect(page).toHaveURL(/#temperature$/);

      // Navigate to Emissions
      await page.locator('.nav-item:has-text("Emissions")').click();
      await expect(page).toHaveURL(/#emissions$/);
    });

    test("should load section from URL hash", async ({ page }) => {
      // Navigate directly to temperature section
      await page.goto("file://" + __dirname + "/index-modern.html#temperature");
      await page.waitForLoadState("networkidle");

      // Check Temperature section is active
      const tempSection = await page.locator("#temperature");
      await expect(tempSection).toHaveClass(/active/);

      // Check nav item is active
      const tempNav = await page.locator('.nav-item:has-text("Temperature")');
      await expect(tempNav).toHaveClass(/active/);
    });

    test("should close sidebar on mobile after navigation", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open sidebar
      await page.locator("#menuToggle").click();
      await expect(page.locator("#sidebar")).toHaveClass(/open/);

      // Navigate to Temperature
      await page.locator('.nav-item:has-text("Temperature")').click();

      // Sidebar should close
      await expect(page.locator("#sidebar")).not.toHaveClass(/open/);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should navigate with arrow keys", async ({ page }) => {
      const firstItem = await page.locator(".nav-item").first();
      const secondItem = await page.locator(".nav-item").nth(1);

      // Focus first item
      await firstItem.focus();
      await expect(firstItem).toBeFocused();

      // Press arrow down
      await page.keyboard.press("ArrowDown");
      await expect(secondItem).toBeFocused();

      // Press arrow up
      await page.keyboard.press("ArrowUp");
      await expect(firstItem).toBeFocused();
    });

    test("should activate item with Enter key", async ({ page }) => {
      const tempItem = await page.locator('.nav-item:has-text("Temperature")');

      // Focus and press Enter
      await tempItem.focus();
      await page.keyboard.press("Enter");

      // Check section is active
      const tempSection = await page.locator("#temperature");
      await expect(tempSection).toHaveClass(/active/);
    });

    test("should activate item with Space key", async ({ page }) => {
      const seaItem = await page.locator('.nav-item:has-text("Sea Level")');

      // Focus and press Space
      await seaItem.focus();
      await page.keyboard.press(" ");

      // Check section is active
      const seaSection = await page.locator("#sea-level");
      await expect(seaSection).toHaveClass(/active/);
    });

    test("should close mobile sidebar with Escape key", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open sidebar
      await page.locator("#menuToggle").click();
      await expect(page.locator("#sidebar")).toHaveClass(/open/);

      // Focus nav item and press Escape
      await page.locator(".nav-item").first().focus();
      await page.keyboard.press("Escape");

      // Sidebar should close
      await expect(page.locator("#sidebar")).not.toHaveClass(/open/);
    });
  });

  test.describe("Theme Toggle", () => {
    test("should toggle between light and dark themes", async ({ page }) => {
      const themeToggle = await page.locator("#themeToggle");
      const body = await page.locator("body");

      // Initially dark theme
      await expect(body).not.toHaveClass(/light-theme/);

      // Click to switch to light
      await themeToggle.click();
      await expect(body).toHaveClass(/light-theme/);
      await expect(themeToggle).toHaveClass(/active/);

      // Click to switch back to dark
      await themeToggle.click();
      await expect(body).not.toHaveClass(/light-theme/);
      await expect(themeToggle).not.toHaveClass(/active/);
    });

    test("should persist theme preference", async ({ page, context }) => {
      // Set light theme
      await page.locator("#themeToggle").click();
      await expect(page.locator("body")).toHaveClass(/light-theme/);

      // Check localStorage
      const theme = await page.evaluate(() => localStorage.getItem("theme"));
      expect(theme).toBe("light");

      // Reload page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Theme should persist
      await expect(page.locator("body")).toHaveClass(/light-theme/);
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      const sidebar = await page.locator("#sidebar");
      await expect(sidebar).toHaveAttribute("aria-label", "Main navigation");

      const mainContent = await page.locator("#mainContent");
      await expect(mainContent).toHaveAttribute("aria-label", "Main content");

      const menuToggle = await page.locator("#menuToggle");
      await expect(menuToggle).toHaveAttribute("aria-label", "Toggle Menu");
    });

    test("should have skip to content link", async ({ page }) => {
      const skipLink = await page.locator(".skip-link");
      await expect(skipLink).toBeAttached();
      await expect(skipLink).toHaveText("Skip to main content");

      // Focus to make visible
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    });

    test("should announce navigation changes", async ({ page }) => {
      const announcer = await page.locator('[aria-live="polite"]');
      await expect(announcer).toBeAttached();

      // Navigate to trigger announcement
      await page.locator('.nav-item:has-text("Temperature")').click();

      // Check announcement was made
      const announcement = await announcer.textContent();
      expect(announcement).toBeTruthy();
    });

    test("should support tab navigation", async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press("Tab");
      const menuToggle = await page.locator("#menuToggle");
      await expect(menuToggle).toBeFocused();

      await page.keyboard.press("Tab");
      const themeToggle = await page.locator("#themeToggle");
      await expect(themeToggle).toBeFocused();

      // Continue tabbing to nav items
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const firstNavItem = await page.locator(".nav-item").first();
      await expect(firstNavItem).toBeFocused();
    });
  });

  test.describe("Responsive Design", () => {
    test("should adapt layout for tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const sidebar = await page.locator("#sidebar");
      const layout = await page.locator(".modern-layout");

      // Check responsive classes or styles
      await expect(sidebar).toBeVisible();
      await expect(layout).toBeVisible();
    });

    test("should handle orientation change", async ({ page }) => {
      // Portrait
      await page.setViewportSize({ width: 375, height: 667 });
      let sidebar = await page.locator("#sidebar");
      await expect(sidebar).toBeVisible();

      // Landscape
      await page.setViewportSize({ width: 667, height: 375 });
      sidebar = await page.locator("#sidebar");
      await expect(sidebar).toBeVisible();
    });

    test("should maintain state during resize", async ({ page }) => {
      // Start desktop
      await page.setViewportSize({ width: 1200, height: 800 });

      // Collapse sidebar
      await page.locator("#menuToggle").click();
      await expect(page.locator("#sidebar")).toHaveClass(/collapsed/);

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Sidebar should not be collapsed on mobile
      await expect(page.locator("#sidebar")).not.toHaveClass(/collapsed/);

      // Resize back to desktop
      await page.setViewportSize({ width: 1200, height: 800 });

      // Should remember collapsed state
      await expect(page.locator("#sidebar")).toHaveClass(/collapsed/);
    });
  });

  test.describe("Performance", () => {
    test("should load quickly", async ({ page }) => {
      const startTime = Date.now();
      await page.goto("file://" + __dirname + "/index-modern.html");
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // Should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test("should have smooth animations", async ({ page }) => {
      // Check CSS transitions are defined
      const sidebar = await page.locator("#sidebar");
      const transition = await sidebar.evaluate(
        (el) => window.getComputedStyle(el).transition,
      );
      expect(transition).toContain("250ms");
    });

    test("should handle rapid navigation", async ({ page }) => {
      // Rapidly click through nav items
      const navItems = await page.locator(".nav-item").all();

      for (const item of navItems.slice(0, 5)) {
        await item.click();
        await page.waitForTimeout(50);
      }

      // Should end on last clicked item
      const lastItem = navItems[4];
      await expect(lastItem).toHaveClass(/active/);
    });
  });
});

// Export test configuration
module.exports = {
  testDir: ".",
  testMatch: "e2e-navigation.spec.js",
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [
    ["html", { outputFolder: "test-results/navigation" }],
    ["json", { outputFile: "test-results/navigation/results.json" }],
  ],
};
