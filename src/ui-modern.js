// Modern UI JavaScript - Phase 1: Navigation Implementation

class ModernUI {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.menuToggle = document.getElementById("menuToggle");
    this.themeToggle = document.getElementById("themeToggle");
    this.navItems = document.querySelectorAll(".nav-item");
    this.sections = document.querySelectorAll(".visualization-section");
    this.mainContent = document.getElementById("mainContent");
    this.currentSection = "dashboard";
    this.isSidebarOpen = true;
    this.theme = localStorage.getItem("theme") || "dark";

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.applyTheme();
    this.initializeDashboard();
    this.setupResponsive();
    this.addAccessibilityFeatures();
  }

  setupEventListeners() {
    // Menu toggle
    this.menuToggle?.addEventListener("click", () => this.toggleSidebar());

    // Theme toggle
    this.themeToggle?.addEventListener("click", () => this.toggleTheme());

    // Navigation items
    this.navItems.forEach((item) => {
      item.addEventListener("click", (e) => this.handleNavigation(e));

      // Add tooltip on hover for collapsed sidebar
      item.addEventListener("mouseenter", (e) => this.showTooltip(e));
      item.addEventListener("mouseleave", (e) => this.hideTooltip(e));
    });

    // Floating Action Button
    const fabButton = document.getElementById("fabButton");
    fabButton?.addEventListener("click", () => this.showQuickActions());

    // Refresh data button
    const refreshBtn = document.getElementById("refreshData");
    refreshBtn?.addEventListener("click", () => this.refreshDashboardData());

    // Time range selector
    const timeRange = document.getElementById("timeRange");
    timeRange?.addEventListener("change", (e) =>
      this.updateTimeRange(e.target.value),
    );

    // Chart type buttons
    document.querySelectorAll("[data-chart]").forEach((btn) => {
      btn.addEventListener("click", (e) => this.switchChartType(e));
    });
  }

  setupKeyboardNavigation() {
    // Allow keyboard navigation through nav items
    let currentIndex = 0;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && e.shiftKey) return; // Let natural tab work

      const activeElement = document.activeElement;
      const isNavItem = activeElement?.classList.contains("nav-item");

      if (!isNavItem) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, this.navItems.length - 1);
          this.navItems[currentIndex].focus();
          break;

        case "ArrowUp":
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, 0);
          this.navItems[currentIndex].focus();
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          activeElement.click();
          break;

        case "Escape":
          if (window.innerWidth <= 768) {
            this.closeSidebar();
          }
          break;
      }
    });

    // Update current index when clicking
    this.navItems.forEach((item, index) => {
      item.addEventListener("focus", () => {
        currentIndex = index;
      });
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (window.innerWidth > 768) {
      // Desktop: collapse/expand
      this.sidebar.classList.toggle("collapsed");
      localStorage.setItem(
        "sidebarCollapsed",
        this.sidebar.classList.contains("collapsed"),
      );
    } else {
      // Mobile: slide in/out
      this.sidebar.classList.toggle("open");
    }

    // Animate menu icon
    this.animateMenuIcon();

    // Announce state change for screen readers
    this.announceChange(
      `Navigation ${this.isSidebarOpen ? "opened" : "closed"}`,
    );
  }

  closeSidebar() {
    if (window.innerWidth <= 768) {
      this.sidebar.classList.remove("open");
      this.isSidebarOpen = false;
    }
  }

  animateMenuIcon() {
    const icon = this.menuToggle.querySelector("svg");
    icon.style.transform = this.isSidebarOpen
      ? "rotate(0deg)"
      : "rotate(180deg)";
    icon.style.transition = "transform 0.3s ease";
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme();
    localStorage.setItem("theme", this.theme);

    // Animate theme toggle
    this.themeToggle.classList.toggle("active");

    // Announce theme change
    this.announceChange(`${this.theme} theme activated`);
  }

  applyTheme() {
    document.body.classList.toggle("light-theme", this.theme === "light");
    this.themeToggle?.classList.toggle("active", this.theme === "light");
  }

  handleNavigation(e) {
    const button = e.currentTarget;
    const section = button.dataset.section;

    if (!section) return;

    // Update active states
    this.navItems.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    // Show loading state
    this.showLoading();

    // Update sections
    setTimeout(() => {
      this.sections.forEach((sec) => {
        sec.classList.remove("active");
        if (sec.id === section) {
          sec.classList.add("active", "fade-in");
        }
      });

      // Load section content if needed
      this.loadSectionContent(section);

      // Hide loading
      this.hideLoading();

      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        this.closeSidebar();
      }

      // Update URL without reload
      history.pushState({ section }, "", `#${section}`);

      // Announce navigation
      this.announceChange(
        `Navigated to ${button.querySelector(".nav-label")?.textContent || section}`,
      );
    }, 300);

    this.currentSection = section;
  }

  loadSectionContent(section) {
    // Dynamically load content for sections not in initial HTML
    const dynamicSections = document.getElementById("dynamicSections");

    // Check if section exists
    if (!document.getElementById(section)) {
      // Create section dynamically
      const newSection = document.createElement("section");
      newSection.id = section;
      newSection.className = "visualization-section active fade-in";
      newSection.innerHTML = this.getSectionTemplate(section);

      // Clear dynamic sections and add new one
      dynamicSections.innerHTML = "";
      dynamicSections.appendChild(newSection);

      // Initialize section-specific features
      this.initializeSectionFeatures(section);
    }
  }

  getSectionTemplate(section) {
    const templates = {
      emissions: `
                <div class="visualization-container">
                    <h2 class="visualization-title">Global Emissions Data</h2>
                    <div class="card-chart" style="height: 400px;">
                        <canvas id="emissionsChart"></canvas>
                    </div>
                </div>`,
      "extreme-events": `
                <div class="visualization-container">
                    <h2 class="visualization-title">Extreme Weather Events</h2>
                    <div class="card-chart" style="height: 400px;">
                        <canvas id="extremeEventsChart"></canvas>
                    </div>
                </div>`,
      heatmap: `
                <div class="visualization-container">
                    <h2 class="visualization-title">Global Temperature Heatmap</h2>
                    <div id="globalHeatmap" style="height: 600px;"></div>
                </div>`,
      globe: `
                <div class="visualization-container">
                    <h2 class="visualization-title">3D Climate Globe</h2>
                    <div id="globeContainer" style="height: 600px;"></div>
                </div>`,
      projections: `
                <div class="visualization-container">
                    <h2 class="visualization-title">Future Climate Projections</h2>
                    <div class="card-chart" style="height: 400px;">
                        <canvas id="projectionsChart"></canvas>
                    </div>
                </div>`,
      "carbon-calculator": `
                <div class="visualization-container">
                    <h2 class="visualization-title">Carbon Footprint Calculator</h2>
                    <div id="carbonCalculator"></div>
                </div>`,
      "comparison-tools": `
                <div class="visualization-container">
                    <h2 class="visualization-title">Regional Comparison</h2>
                    <div id="comparisonTools"></div>
                </div>`,
      "impact-assessment": `
                <div class="visualization-container">
                    <h2 class="visualization-title">Climate Impact Assessment</h2>
                    <div id="impactAssessment"></div>
                </div>`,
      "data-export": `
                <div class="visualization-container">
                    <h2 class="visualization-title">Export Climate Data</h2>
                    <div id="dataExport"></div>
                </div>`,
    };

    return (
      templates[section] ||
      '<div class="visualization-container"><h2>Content loading...</h2></div>'
    );
  }

  initializeSectionFeatures(section) {
    // Initialize features based on section
    switch (section) {
      case "globe":
        if (typeof window.ClimateGlobe !== "undefined") {
          window.ClimateGlobe.init();
        }
        break;
      case "heatmap":
        if (typeof window.initializeHeatmap !== "undefined") {
          window.initializeHeatmap();
        }
        break;
      case "carbon-calculator":
        if (typeof window.CarbonCalculator !== "undefined") {
          window.CarbonCalculator.init();
        }
        break;
    }
  }

  showTooltip(e) {
    if (!this.sidebar.classList.contains("collapsed")) return;

    const item = e.currentTarget;
    const label = item.querySelector(".nav-label")?.textContent;

    if (!label) return;

    // Create tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "nav-tooltip";
    tooltip.textContent = label;
    tooltip.style.cssText = `
            position: absolute;
            left: calc(var(--sidebar-collapsed) + 10px);
            background: var(--surface-elevated);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

    // Position tooltip
    const rect = item.getBoundingClientRect();
    tooltip.style.top = `${rect.top + rect.height / 2 - 16}px`;

    document.body.appendChild(tooltip);

    // Animate in
    requestAnimationFrame(() => {
      tooltip.style.opacity = "1";
    });

    item._tooltip = tooltip;
  }

  hideTooltip(e) {
    const tooltip = e.currentTarget._tooltip;
    if (!tooltip) return;

    tooltip.style.opacity = "0";
    setTimeout(() => tooltip.remove(), 200);
    delete e.currentTarget._tooltip;
  }

  initializeDashboard() {
    // Initialize mini charts in dashboard cards
    this.initializeMiniCharts();

    // Initialize main dashboard chart
    this.initializeMainChart();

    // Start real-time updates
    this.startRealTimeUpdates();
  }

  initializeMiniCharts() {
    // Temperature mini chart
    this.createSparkline("tempMiniChart", {
      data: [1.0, 1.1, 1.05, 1.15, 1.2, 1.18, 1.22, 1.2],
      color: "#FF3B30",
    });

    // Sea level mini chart
    this.createSparkline("seaMiniChart", {
      data: [80, 82, 85, 88, 90, 93, 96, 98],
      color: "#007AFF",
    });

    // CO2 mini chart
    this.createSparkline("co2MiniChart", {
      data: [400, 405, 410, 412, 415, 418, 420, 421],
      color: "#FF9500",
    });

    // Arctic ice mini chart
    this.createSparkline("iceMiniChart", {
      data: [100, 95, 92, 90, 88, 87, 86, 87],
      color: "#5AC8FA",
    });

    // Events mini chart
    this.createSparkline("eventsMiniChart", {
      data: [250, 265, 280, 290, 305, 310, 320, 327],
      color: "#FF3B30",
      type: "bar",
    });

    // Emissions mini chart
    this.createSparkline("emissionsMiniChart", {
      data: [35.0, 35.5, 36.0, 36.2, 36.5, 36.6, 36.7, 36.8],
      color: "#8E8E93",
    });
  }

  createSparkline(elementId, options) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = document.createElement("canvas");
    element.appendChild(canvas);

    new Chart(canvas, {
      type: options.type || "line",
      data: {
        labels: options.data.map((_, i) => i),
        datasets: [
          {
            data: options.data,
            borderColor: options.color,
            backgroundColor:
              options.type === "bar" ? options.color + "40" : "transparent",
            borderWidth: 2,
            fill: options.type !== "bar",
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });
  }

  initializeMainChart() {
    const ctx = document.getElementById("mainDashboardChart");
    if (!ctx) return;

    this.mainChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Temperature Anomaly",
            data: [
              1.1, 1.15, 1.2, 1.18, 1.22, 1.25, 1.28, 1.3, 1.27, 1.24, 1.21,
              1.2,
            ],
            borderColor: "#FF3B30",
            backgroundColor: "#FF3B3020",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: "rgba(255, 255, 255, 0.8)" },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "rgba(255, 255, 255, 0.6)" },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "rgba(255, 255, 255, 0.6)" },
          },
        },
      },
    });
  }

  switchChartType(e) {
    const button = e.currentTarget;
    const chartType = button.dataset.chart;

    // Update active state
    document.querySelectorAll("[data-chart]").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // Update chart data
    this.updateMainChart(chartType);
  }

  updateMainChart(type) {
    if (!this.mainChart) return;

    const datasets = {
      temperature: {
        label: "Temperature Anomaly",
        data: [
          1.1, 1.15, 1.2, 1.18, 1.22, 1.25, 1.28, 1.3, 1.27, 1.24, 1.21, 1.2,
        ],
        borderColor: "#FF3B30",
        backgroundColor: "#FF3B3020",
      },
      precipitation: {
        label: "Precipitation Change",
        data: [-5, -3, -2, 0, 2, 3, 1, -1, -3, -4, -5, -6],
        borderColor: "#007AFF",
        backgroundColor: "#007AFF20",
      },
      disasters: {
        label: "Natural Disasters",
        data: [12, 15, 18, 22, 28, 35, 42, 38, 30, 25, 20, 16],
        borderColor: "#FF9500",
        backgroundColor: "#FF950020",
      },
    };

    this.mainChart.data.datasets[0] = {
      ...datasets[type],
      fill: true,
      tension: 0.4,
    };
    this.mainChart.update();
  }

  refreshDashboardData() {
    this.showLoading();

    // Simulate data refresh
    setTimeout(() => {
      // Update card values with animation
      this.animateValue("tempMetric", 1.2, 1.25, "°C");
      this.animateValue("co2Metric", 421, 422, " ppm");

      // Re-initialize charts with new data
      this.initializeMiniCharts();

      this.hideLoading();
      this.showNotification("Data refreshed successfully");
    }, 1000);
  }

  animateValue(elementId, start, end, suffix = "") {
    const element = document.querySelector(".card-metric");
    if (!element) return;

    const duration = 1000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * progress;

      element.textContent = `+${value.toFixed(1)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  updateTimeRange(range) {
    this.showLoading();

    // Update data based on time range
    setTimeout(() => {
      this.hideLoading();
      this.showNotification(`Data updated for ${range}`);
    }, 500);
  }

  startRealTimeUpdates() {
    // Update live badges every 30 seconds
    setInterval(() => {
      document.querySelectorAll(".pulse").forEach((badge) => {
        badge.style.animation = "none";
        setTimeout(() => {
          badge.style.animation =
            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
        }, 10);
      });
    }, 30000);
  }

  showQuickActions() {
    // Create quick actions menu
    const menu = document.createElement("div");
    menu.className = "quick-actions-menu";
    menu.innerHTML = `
            <button class="quick-action">📊 Generate Report</button>
            <button class="quick-action">📤 Share Dashboard</button>
            <button class="quick-action">⚙️ Customize View</button>
            <button class="quick-action">🔔 Set Alert</button>
        `;

    // Add styles
    menu.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 32px;
            background: var(--surface-elevated);
            border-radius: 12px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            box-shadow: 0 8px 32px var(--shadow-color);
            z-index: 999;
            animation: slideUp 0.3s ease;
        `;

    document.body.appendChild(menu);

    // Remove on click outside
    setTimeout(() => {
      document.addEventListener("click", () => menu.remove(), { once: true });
    }, 100);
  }

  setupResponsive() {
    // Check sidebar state on resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          this.sidebar.classList.remove("open");
          // Restore collapsed state from localStorage
          if (localStorage.getItem("sidebarCollapsed") === "true") {
            this.sidebar.classList.add("collapsed");
          }
        } else {
          this.sidebar.classList.remove("collapsed");
        }
      }, 250);
    });

    // Handle initial state
    if (window.innerWidth <= 768) {
      this.sidebar.classList.remove("collapsed");
    } else if (localStorage.getItem("sidebarCollapsed") === "true") {
      this.sidebar.classList.add("collapsed");
    }
  }

  addAccessibilityFeatures() {
    // Add ARIA labels
    this.sidebar.setAttribute("aria-label", "Main navigation");
    this.mainContent.setAttribute("aria-label", "Main content");

    // Add skip to content link
    const skipLink = document.createElement("a");
    skipLink.href = "#mainContent";
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            z-index: 999;
        `;
    skipLink.addEventListener("focus", () => {
      skipLink.style.left = "50%";
      skipLink.style.transform = "translateX(-50%)";
    });
    skipLink.addEventListener("blur", () => {
      skipLink.style.left = "-9999px";
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Announce dynamic content changes
    this.announcer = document.createElement("div");
    this.announcer.setAttribute("aria-live", "polite");
    this.announcer.setAttribute("aria-atomic", "true");
    this.announcer.className = "sr-only";
    this.announcer.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    document.body.appendChild(this.announcer);
  }

  announceChange(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
      setTimeout(() => {
        this.announcer.textContent = "";
      }, 1000);
    }
  }

  showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = "flex";
    }
  }

  hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 32px;
            background: ${type === "success" ? "var(--success)" : "var(--danger)"};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.modernUI = new ModernUI();

  // Handle browser back/forward
  window.addEventListener("popstate", (e) => {
    if (e.state?.section) {
      const navItem = document.querySelector(
        `[data-section="${e.state.section}"]`,
      );
      if (navItem) {
        navItem.click();
      }
    }
  });

  // Load initial section from URL
  const hash = window.location.hash.slice(1);
  if (hash) {
    const navItem = document.querySelector(`[data-section="${hash}"]`);
    if (navItem) {
      navItem.click();
    }
  }
});

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
