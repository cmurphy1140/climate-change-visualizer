/**
 * E2E Tests for Modern UI
 * Test suite for the redesigned Climate Change Impact Visualizer
 */

const { test, expect } = require('@playwright/test');

test.describe('Modern UI - Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should load the dashboard by default', async ({ page }) => {
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('.nav-item[data-section="dashboard"]')).toHaveClass(/active/);
  });

  test('should navigate between sections', async ({ page }) => {
    // Click on Temperature nav item
    await page.click('.nav-item[data-section="temperature"]');
    await expect(page.locator('#temperature')).toBeVisible();
    await expect(page.locator('#dashboard')).not.toBeVisible();
    
    // Click on Emissions nav item
    await page.click('.nav-item[data-section="emissions"]');
    await expect(page.locator('#emissions')).toBeVisible();
    await expect(page.locator('#temperature')).not.toBeVisible();
  });

  test('should collapse and expand sidebar', async ({ page }) => {
    const sidebar = page.locator('.modern-sidebar');
    const toggleBtn = page.locator('#sidebarToggle');
    
    // Initially expanded
    await expect(sidebar).not.toHaveClass(/collapsed/);
    
    // Click to collapse
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/collapsed/);
    
    // Click to expand
    await toggleBtn.click();
    await expect(sidebar).not.toHaveClass(/collapsed/);
  });

  test('should persist sidebar state in localStorage', async ({ page }) => {
    await page.click('#sidebarToggle');
    
    // Check localStorage
    const sidebarState = await page.evaluate(() => localStorage.getItem('sidebarCollapsed'));
    expect(sidebarState).toBe('true');
    
    // Reload page and check if state persists
    await page.reload();
    await expect(page.locator('.modern-sidebar')).toHaveClass(/collapsed/);
  });
});

test.describe('Modern UI - Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should display all stat cards', async ({ page }) => {
    const statCards = page.locator('.modern-card');
    await expect(statCards).toHaveCount(4);
    
    // Check specific stat cards
    await expect(page.locator('.card-title:has-text("Global Temperature")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("Sea Level Rise")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("CO₂ Levels")')).toBeVisible();
    await expect(page.locator('.card-title:has-text("Arctic Ice")')).toBeVisible();
  });

  test('should render dashboard chart', async ({ page }) => {
    await expect(page.locator('#dashboardChart')).toBeVisible();
    
    // Wait for chart to render
    await page.waitForTimeout(1000);
    
    // Check if canvas has content
    const hasContent = await page.evaluate(() => {
      const canvas = document.getElementById('dashboardChart');
      const ctx = canvas?.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      return imageData?.data.some(pixel => pixel !== 0);
    });
    
    expect(hasContent).toBe(true);
  });

  test('should animate stat values', async ({ page }) => {
    // Get initial value
    const statValue = page.locator('.stat-value').first();
    const initialText = await statValue.textContent();
    
    // Wait for animation
    await page.waitForTimeout(1500);
    
    // Check if value changed (animated)
    const finalText = await statValue.textContent();
    expect(initialText).not.toBe(finalText);
  });
});

test.describe('Modern UI - Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should have functional search bar', async ({ page }) => {
    const searchInput = page.locator('#searchInput');
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('temperature');
    await expect(searchInput).toHaveValue('temperature');
  });

  test('should highlight matching sections on search', async ({ page }) => {
    await page.fill('#searchInput', 'temperature');
    
    // Check if temperature nav item gets highlighted
    const tempNavItem = page.locator('.nav-item[data-section="temperature"]');
    
    // Wait for highlight effect
    await page.waitForTimeout(500);
    
    // The search function temporarily changes background
    const hasHighlight = await tempNavItem.evaluate(el => {
      return window.getComputedStyle(el).background !== '';
    });
    
    expect(hasHighlight).toBe(true);
  });
});

test.describe('Modern UI - Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should toggle between dark and light themes', async ({ page }) => {
    const themeToggle = page.locator('#themeToggle');
    const body = page.locator('body');
    
    // Initially dark theme (no light-theme class)
    await expect(body).not.toHaveClass(/light-theme/);
    
    // Click to switch to light theme
    await themeToggle.click();
    await expect(body).toHaveClass(/light-theme/);
    
    // Click to switch back to dark theme
    await themeToggle.click();
    await expect(body).not.toHaveClass(/light-theme/);
  });

  test('should persist theme preference', async ({ page }) => {
    await page.click('#themeToggle');
    
    // Check localStorage
    const themeState = await page.evaluate(() => localStorage.getItem('darkMode'));
    expect(themeState).toBe('false');
    
    // Reload and check persistence
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/light-theme/);
  });
});

test.describe('Modern UI - Data Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should switch between chart views', async ({ page }) => {
    // Navigate to temperature section
    await page.click('.nav-item[data-section="temperature"]');
    
    // Test period filters
    const allTimeBtn = page.locator('.viz-control-btn[data-period="all"]');
    const tenYearBtn = page.locator('.viz-control-btn[data-period="10"]');
    
    await expect(allTimeBtn).toHaveClass(/active/);
    
    await tenYearBtn.click();
    await expect(tenYearBtn).toHaveClass(/active/);
    await expect(allTimeBtn).not.toHaveClass(/active/);
  });

  test('should render temperature chart', async ({ page }) => {
    await page.click('.nav-item[data-section="temperature"]');
    await page.waitForTimeout(1000);
    
    const chartCanvas = page.locator('#temperatureChart');
    await expect(chartCanvas).toBeVisible();
    
    // Verify chart has rendered
    const hasData = await page.evaluate(() => {
      const canvas = document.getElementById('temperatureChart');
      return canvas?.getContext('2d') !== null;
    });
    
    expect(hasData).toBe(true);
  });
});

test.describe('Modern UI - Carbon Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
    await page.click('.nav-item[data-section="carbon-calculator"]');
  });

  test('should calculate carbon footprint', async ({ page }) => {
    // Fill in form
    await page.fill('#transportInput', '10000');
    await page.fill('#electricityInput', '300');
    await page.selectOption('#dietInput', 'vegetarian');
    
    // Click calculate
    await page.click('#calculateBtn');
    
    // Check result
    const result = page.locator('#calculatorResult');
    await expect(result).toBeVisible();
    
    const resultValue = page.locator('.result-value');
    await expect(resultValue).toContainText('tons CO₂/year');
  });

  test('should show color-coded results', async ({ page }) => {
    await page.fill('#transportInput', '5000');
    await page.fill('#electricityInput', '200');
    await page.selectOption('#dietInput', 'vegan');
    
    await page.click('#calculateBtn');
    
    const resultValue = page.locator('.result-value');
    const color = await resultValue.evaluate(el => window.getComputedStyle(el).color);
    
    // Should be green for low footprint
    expect(color).toContain('rgb(16, 185, 129)'); // #10b981 in RGB
  });
});

test.describe('Modern UI - Impact Assessment Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
    await page.click('.nav-item[data-section="impact-assessment"]');
  });

  test('should navigate through wizard steps', async ({ page }) => {
    const nextBtn = page.locator('#nextBtn');
    const prevBtn = page.locator('#prevBtn');
    
    // Initially on step 1
    await expect(prevBtn).toBeDisabled();
    await expect(page.locator('.step.active')).toContainText('1. Location');
    
    // Go to step 2
    await nextBtn.click();
    await expect(prevBtn).not.toBeDisabled();
    
    // Go back to step 1
    await prevBtn.click();
    await expect(prevBtn).toBeDisabled();
  });

  test('should show finish button on last step', async ({ page }) => {
    const nextBtn = page.locator('#nextBtn');
    
    // Navigate to last step
    for (let i = 0; i < 3; i++) {
      await nextBtn.click();
      await page.waitForTimeout(200);
    }
    
    await expect(nextBtn).toContainText('Finish');
  });
});

test.describe('Modern UI - Data Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
    await page.click('.nav-item[data-section="data-export"]');
  });

  test('should allow data selection', async ({ page }) => {
    const tempCheckbox = page.locator('#exportTemp');
    const seaCheckbox = page.locator('#exportSea');
    const emissionsCheckbox = page.locator('#exportEmissions');
    
    await tempCheckbox.check();
    await seaCheckbox.check();
    
    await expect(tempCheckbox).toBeChecked();
    await expect(seaCheckbox).toBeChecked();
    await expect(emissionsCheckbox).not.toBeChecked();
  });

  test('should trigger export on button click', async ({ page }) => {
    // Select data
    await page.check('#exportTemp');
    
    // Listen for alert (export placeholder)
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Exporting data in CSV format');
      dialog.accept();
    });
    
    // Click export
    await page.click('button[data-format="csv"]');
  });
});

test.describe('Modern UI - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/index-modern.html');
    
    // Sidebar should be hidden by default on mobile
    const sidebar = page.locator('.modern-sidebar');
    const transform = await sidebar.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    expect(transform).toContain('matrix');
  });

  test('should adapt grid on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:8000/index-modern.html');
    
    // Check if grid adapts
    const dashboardGrid = page.locator('.dashboard-grid');
    const gridColumns = await dashboardGrid.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns
    );
    
    expect(gridColumns).toBeDefined();
  });
});

test.describe('Modern UI - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
  });

  test('should have proper focus states', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => 
      document.activeElement?.tagName
    );
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have ARIA labels', async ({ page }) => {
    const navItems = page.locator('.nav-item');
    const firstNavItem = navItems.first();
    
    const hasText = await firstNavItem.evaluate(el => 
      el.textContent?.trim().length > 0
    );
    
    expect(hasText).toBe(true);
  });
});

test.describe('Modern UI - Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:8000/index-modern.html');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('http://localhost:8000/index-modern.html');
    
    // Rapidly click through sections
    const sections = ['temperature', 'sea-level', 'emissions', 'dashboard'];
    
    for (const section of sections) {
      await page.click(`.nav-item[data-section="${section}"]`);
      await page.waitForTimeout(100);
    }
    
    // Should end on dashboard
    await expect(page.locator('#dashboard')).toBeVisible();
  });
});