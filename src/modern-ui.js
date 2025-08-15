/**
 * Modern UI JavaScript - Enhanced Climate Change Visualizer
 * Implements modern navigation, animations, and interactive features
 */

class ModernUI {
  constructor() {
    this.currentSection = 'dashboard';
    this.sidebarCollapsed = false;
    this.darkMode = true;
    this.charts = {};
    this.init();
  }

  init() {
    this.setupSidebar();
    this.setupNavigation();
    this.setupSearch();
    this.setupThemeToggle();
    this.initDashboard();
    this.setupInteractiveTooltips();
    this.setupAnimations();
  }

  /**
   * Sidebar functionality
   */
  setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        sidebar.classList.toggle('collapsed');
        
        // Save preference
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
      });
    }
    
    // Restore preference
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      this.sidebarCollapsed = true;
      sidebar?.classList.add('collapsed');
    }
  }

  /**
   * Navigation between sections
   */
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetSection = item.dataset.section;
        
        // Update active states
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => {
          section.style.display = 'none';
          section.classList.remove('active');
        });
        
        // Show target section
        const target = document.getElementById(targetSection);
        if (target) {
          target.style.display = 'block';
          target.classList.add('active');
          this.currentSection = targetSection;
          
          // Initialize section-specific features
          this.initializeSection(targetSection);
        }
      });
    });
  }

  /**
   * Search functionality
   */
  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.performSearch(query);
      });
    }
  }

  performSearch(query) {
    if (!query) return;
    
    // Search through sections and highlight matching content
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const content = section.textContent.toLowerCase();
      if (content.includes(query)) {
        // Highlight matching section in navigation
        const navItem = document.querySelector(`[data-section="${section.id}"]`);
        if (navItem) {
          navItem.style.background = 'rgba(37, 99, 235, 0.2)';
          setTimeout(() => {
            navItem.style.background = '';
          }, 2000);
        }
      }
    });
  }

  /**
   * Theme toggle functionality
   */
  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('light-theme');
        
        // Update charts theme
        this.updateChartsTheme();
        
        // Save preference
        localStorage.setItem('darkMode', this.darkMode);
      });
    }
    
    // Restore preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'false') {
      this.darkMode = false;
      document.body.classList.add('light-theme');
    }
  }

  /**
   * Initialize Dashboard
   */
  initDashboard() {
    this.createDashboardChart();
    this.animateStats();
    this.startLiveUpdates();
  }

  createDashboardChart() {
    const ctx = document.getElementById('dashboardChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (this.charts.dashboard) {
      this.charts.dashboard.destroy();
    }
    
    this.charts.dashboard = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Temperature Anomaly (°C)',
          data: [0.74, 0.90, 1.02, 0.92, 0.85, 0.98, 1.02, 0.85, 0.89, 1.17],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'CO₂ Levels (ppm/10)',
          data: [39.8, 40.0, 40.4, 40.7, 40.9, 41.2, 41.4, 41.6, 41.8, 42.1],
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#9ca3af',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f9fafb',
            bodyColor: '#9ca3af',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: (tooltipItems) => `Year ${tooltipItems[0].label}`,
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y.toFixed(2);
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af'
            }
          }
        }
      }
    });
  }

  /**
   * Animate statistics on dashboard
   */
  animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
      const value = stat.textContent;
      const isNumber = /^[0-9+\-.]/.test(value);
      
      if (isNumber) {
        const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
        const prefix = value.match(/^[+\-]/)?.[0] || '';
        const suffix = value.match(/[^0-9.\s]+$/)?.[0] || '';
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          stat.textContent = prefix + current.toFixed(2) + suffix;
        }, 20);
      }
    });
  }

  /**
   * Start live updates for dashboard
   */
  startLiveUpdates() {
    // Simulate live data updates
    setInterval(() => {
      // Update temperature value
      const tempValue = document.querySelector('.modern-card:first-child .stat-value');
      if (tempValue) {
        const current = parseFloat(tempValue.textContent);
        const change = (Math.random() - 0.5) * 0.01;
        tempValue.textContent = `+${(current + change).toFixed(2)}°C`;
      }
      
      // Update CO2 levels
      const co2Value = document.querySelector('.modern-card:nth-child(3) .stat-value');
      if (co2Value) {
        const current = parseFloat(co2Value.textContent);
        const change = (Math.random() - 0.3) * 0.1;
        co2Value.textContent = `${(current + change).toFixed(0)} ppm`;
      }
    }, 5000);
  }

  /**
   * Initialize section-specific features
   */
  initializeSection(section) {
    switch(section) {
      case 'temperature':
        this.initTemperatureChart();
        break;
      case 'sea-level':
        this.initSeaLevelChart();
        break;
      case 'emissions':
        this.initEmissionsChart();
        break;
      case 'extreme-events':
        this.initExtremeEventsChart();
        break;
      case 'heatmap':
        this.initHeatmap();
        break;
      case 'globe':
        this.init3DGlobe();
        break;
      case 'projections':
        this.initProjections();
        break;
      case 'carbon-calculator':
        this.setupCarbonCalculator();
        break;
      case 'comparison-tools':
        this.setupComparisonTools();
        break;
      case 'impact-assessment':
        this.setupImpactWizard();
        break;
      case 'data-export':
        this.setupDataExport();
        break;
    }
  }

  /**
   * Temperature Chart
   */
  initTemperatureChart() {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;
    
    if (this.charts.temperature) {
      this.charts.temperature.destroy();
    }
    
    // Generate temperature data
    const years = [];
    const temps = [];
    for (let year = 1880; year <= 2023; year++) {
      years.push(year);
      // Simulate increasing temperature trend
      const baseTemp = -0.2 + (year - 1880) * 0.008;
      const variation = (Math.random() - 0.5) * 0.3;
      temps.push(baseTemp + variation);
    }
    
    this.charts.temperature = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Temperature Anomaly',
          data: temps,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af',
              maxTicksLimit: 10
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af',
              callback: (value) => value + '°C'
            }
          }
        }
      }
    });
    
    // Add period filters
    document.querySelectorAll('#temperature .viz-control-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const period = e.target.dataset.period;
        this.filterTemperatureData(period);
        
        // Update active state
        document.querySelectorAll('#temperature .viz-control-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }

  filterTemperatureData(period) {
    if (!this.charts.temperature) return;
    
    const currentYear = 2023;
    let startYear = 1880;
    
    switch(period) {
      case '10':
        startYear = currentYear - 10;
        break;
      case '20':
        startYear = currentYear - 20;
        break;
      case '50':
        startYear = currentYear - 50;
        break;
    }
    
    const chart = this.charts.temperature;
    const fullData = chart.data.datasets[0].data;
    const fullLabels = chart.data.labels;
    
    const startIndex = fullLabels.indexOf(startYear);
    if (startIndex !== -1) {
      chart.data.labels = fullLabels.slice(startIndex);
      chart.data.datasets[0].data = fullData.slice(startIndex);
      chart.update('none');
    }
  }

  /**
   * Interactive Tooltips
   */
  setupInteractiveTooltips() {
    const tooltip = document.getElementById('tooltip');
    
    // Add hover effects to cards
    document.querySelectorAll('.modern-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const title = card.querySelector('.card-title')?.textContent || '';
        const value = card.querySelector('.stat-value')?.textContent || '';
        
        if (tooltip && title) {
          tooltip.querySelector('.tooltip-title').textContent = title;
          tooltip.querySelector('.tooltip-value').textContent = value;
          tooltip.style.left = rect.left + 'px';
          tooltip.style.top = rect.bottom + 10 + 'px';
          tooltip.classList.add('visible');
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.classList.remove('visible');
        }
      });
    });
  }

  /**
   * Setup Animations
   */
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Observe all cards and viz-cards
    document.querySelectorAll('.modern-card, .viz-card').forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * Update charts theme when toggling dark/light mode
   */
  updateChartsTheme() {
    const textColor = this.darkMode ? '#9ca3af' : '#4b5563';
    const gridColor = this.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.options) {
        // Update scales
        if (chart.options.scales) {
          Object.values(chart.options.scales).forEach(scale => {
            if (scale.grid) scale.grid.color = gridColor;
            if (scale.ticks) scale.ticks.color = textColor;
          });
        }
        
        // Update legend
        if (chart.options.plugins?.legend?.labels) {
          chart.options.plugins.legend.labels.color = textColor;
        }
        
        chart.update('none');
      }
    });
  }

  /**
   * Setup Carbon Calculator
   */
  setupCarbonCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        const transport = parseFloat(document.getElementById('transportInput')?.value || 0);
        const electricity = parseFloat(document.getElementById('electricityInput')?.value || 0);
        const diet = document.getElementById('dietInput')?.value || 'meat';
        
        // Simple carbon calculation
        let carbonFootprint = 0;
        carbonFootprint += transport * 0.00021; // kg CO2 per km
        carbonFootprint += electricity * 12 * 0.0004; // kg CO2 per kWh annually
        
        // Diet impact
        const dietFactors = {
          meat: 2.5,
          vegetarian: 1.7,
          vegan: 1.5
        };
        carbonFootprint += dietFactors[diet] || 2.5;
        
        // Display result
        const resultDiv = document.getElementById('calculatorResult');
        const resultValue = resultDiv?.querySelector('.result-value');
        if (resultDiv && resultValue) {
          resultValue.textContent = `${carbonFootprint.toFixed(2)} tons CO₂/year`;
          resultDiv.style.display = 'block';
          
          // Add color based on value
          if (carbonFootprint < 4) {
            resultValue.style.color = '#10b981';
          } else if (carbonFootprint < 8) {
            resultValue.style.color = '#f59e0b';
          } else {
            resultValue.style.color = '#ef4444';
          }
        }
      });
    }
  }

  /**
   * Setup Comparison Tools
   */
  setupComparisonTools() {
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        const region1 = document.getElementById('region1Select')?.value;
        const region2 = document.getElementById('region2Select')?.value;
        
        // Create comparison charts
        this.createComparisonCharts(region1, region2);
      });
    }
  }

  createComparisonCharts(region1, region2) {
    // Implementation would create side-by-side charts
    // This is a placeholder for the actual implementation
  }

  /**
   * Setup Impact Assessment Wizard
   */
  setupImpactWizard() {
    let currentStep = 1;
    const totalSteps = 4;
    
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          this.updateWizardStep(currentStep);
        }
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          this.updateWizardStep(currentStep);
        }
      });
    }
  }

  updateWizardStep(step) {
    // Update step indicators
    document.querySelectorAll('.wizard-steps .step').forEach((stepEl, index) => {
      if (index < step) {
        stepEl.classList.add('completed');
      } else if (index === step - 1) {
        stepEl.classList.add('active');
        stepEl.classList.remove('completed');
      } else {
        stepEl.classList.remove('active', 'completed');
      }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = step === 1;
    if (nextBtn) nextBtn.textContent = step === 4 ? 'Finish' : 'Next';
  }

  /**
   * Setup Data Export
   */
  setupDataExport() {
    document.querySelectorAll('.export-format button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = e.target.dataset.format;
        this.exportData(format);
      });
    });
  }

  exportData(format) {
    const selectedData = {
      temperature: document.getElementById('exportTemp')?.checked,
      seaLevel: document.getElementById('exportSea')?.checked,
      emissions: document.getElementById('exportEmissions')?.checked
    };
    
    // Placeholder for export functionality
    // In production, this would generate actual files
    alert(`Exporting data in ${format.toUpperCase()} format...`);
  }

  /**
   * Initialize other chart types
   */
  initSeaLevelChart() {
    // Implementation for sea level chart
  }

  initEmissionsChart() {
    // Implementation for emissions chart
  }

  initExtremeEventsChart() {
    // Implementation for extreme events chart
  }

  initHeatmap() {
    // Implementation for heatmap
  }

  init3DGlobe() {
    // Implementation for 3D globe
  }

  initProjections() {
    // Implementation for projections chart
  }
}

// Initialize Modern UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.modernUI = new ModernUI();
});