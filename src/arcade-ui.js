/**
 * Arcade UI JavaScript - Climate Change Visualizer
 * Inspired by Artificial Arcade design patterns
 */

class ClimateArcade {
  constructor() {
    this.isDarkMode = false;
    this.charts = {};
    this.currentView = 'temperature';
    this.isLoaded = false;
    this.init();
  }

  init() {
    // Initialize theme
    this.initTheme();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Add animations on load
    this.animateOnLoad();
    
    // Initialize charts
    this.initMainChart();
    this.initSecondaryCharts();
    
    // Setup interactions
    this.setupCardAnimations();
    this.setupScrollAnimations();
    
    // Start live updates
    this.startLiveUpdates();
  }

  /**
   * Theme Management
   */
  initTheme() {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      if (document.getElementById('themeIcon')) {
        document.getElementById('themeIcon').textContent = '☀️';
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (document.getElementById('themeIcon')) {
        document.getElementById('themeIcon').textContent = '🌙';
      }
    }
  }

  /**
   * Animations
   */
  animateOnLoad() {
    this.isLoaded = true;
    
    // Animate hero section
    const hero = document.querySelector('.arcade-hero');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 100);
    }
    
    // Animate cards with stagger
    const cards = document.querySelectorAll('.arcade-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 + (index * 100));
    });
  }

  setupCardAnimations() {
    const cards = document.querySelectorAll('.arcade-card');
    
    cards.forEach(card => {
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', () => {
        this.playHoverSound();
      });
      
      // Add click animation
      card.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Charts
   */
  initMainChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    
    // Generate sample data
    const years = [];
    const temps = [];
    const emissions = [];
    
    for (let year = 1990; year <= 2023; year++) {
      years.push(year);
      temps.push(0.3 + (year - 1990) * 0.025 + Math.random() * 0.2);
      emissions.push(30 + (year - 1990) * 0.5 + Math.random() * 2);
    }
    
    this.charts.main = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Temperature Anomaly (°C)',
          data: temps,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6
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
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                family: '-apple-system, BlinkMacSystemFont, "SF Pro Display"'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            },
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxTicksLimit: 10,
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  }

  initSecondaryCharts() {
    // Regional Chart
    const regionalCtx = document.getElementById('regionalChart');
    if (regionalCtx) {
      this.charts.regional = new Chart(regionalCtx, {
        type: 'bar',
        data: {
          labels: ['N. America', 'Europe', 'Asia', 'Africa', 'S. America', 'Oceania'],
          datasets: [{
            label: 'Temperature Change',
            data: [1.2, 1.1, 1.3, 0.9, 0.8, 1.0],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(99, 102, 241, 0.8)'
            ],
            borderRadius: 8
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
                display: false
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });
    }
    
    // Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
      this.charts.trend = new Chart(trendCtx, {
        type: 'doughnut',
        data: {
          labels: ['Energy', 'Transport', 'Industry', 'Agriculture', 'Other'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 146, 60, 0.8)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 10,
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });
    }
  }

  /**
   * Live Updates
   */
  startLiveUpdates() {
    // Update stats every 5 seconds
    setInterval(() => {
      this.updateRandomStat();
    }, 5000);
    
    // Pulse effect on critical indicators
    document.querySelectorAll('.indicator-critical').forEach(indicator => {
      indicator.classList.add('animate-pulse-glow');
    });
  }

  updateRandomStat() {
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length > 0) {
      const randomStat = stats[Math.floor(Math.random() * stats.length)];
      const currentValue = randomStat.textContent;
      
      // Add update animation
      randomStat.style.transition = 'transform 0.3s ease';
      randomStat.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        randomStat.style.transform = 'scale(1)';
      }, 300);
      
      // Update temperature value slightly
      if (currentValue.includes('°C')) {
        const value = parseFloat(currentValue);
        const newValue = (value + (Math.random() - 0.5) * 0.01).toFixed(2);
        randomStat.textContent = `+${newValue}°C`;
      }
    }
  }

  /**
   * Sound Effects (Optional)
   */
  playHoverSound() {
    // Could add subtle hover sound
    // const audio = new Audio('hover.mp3');
    // audio.volume = 0.1;
    // audio.play();
  }

  /**
   * Utility Functions
   */
  changeView(view) {
    this.currentView = view;
    
    // Update chart based on view
    if (this.charts.main) {
      const chart = this.charts.main;
      
      switch(view) {
        case 'temperature':
          chart.data.datasets[0].label = 'Temperature Anomaly (°C)';
          chart.data.datasets[0].borderColor = 'rgb(239, 68, 68)';
          break;
        case 'emissions':
          chart.data.datasets[0].label = 'CO₂ Emissions (Gt)';
          chart.data.datasets[0].borderColor = 'rgb(139, 92, 246)';
          break;
        case 'combined':
          // Add second dataset
          if (chart.data.datasets.length === 1) {
            chart.data.datasets.push({
              label: 'CO₂ Emissions (Gt)',
              data: chart.data.datasets[0].data.map(v => v * 30),
              borderColor: 'rgb(139, 92, 246)',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              pointRadius: 0,
              yAxisID: 'y1'
            });
            
            chart.options.scales.y1 = {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false
              }
            };
          }
          break;
      }
      
      chart.update();
    }
  }

  showVisualization(type) {
    // Smooth scroll to visualizations section
    const section = document.getElementById('visualizations');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update chart based on type
    this.changeView(type);
  }

  calculateCarbon() {
    const transport = parseFloat(document.getElementById('transportInput')?.value || 0);
    const electricity = parseFloat(document.getElementById('electricityInput')?.value || 0);
    
    // Simple calculation
    const transportEmissions = transport * 0.00021; // tons CO2 per km
    const electricityEmissions = electricity * 12 * 0.0004; // tons CO2 per kWh annually
    const total = transportEmissions + electricityEmissions + 2.5; // baseline
    
    // Display result
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
      resultDiv.style.display = 'block';
      const valueEl = resultDiv.querySelector('.stat-value');
      if (valueEl) {
        valueEl.textContent = `${total.toFixed(2)} tons CO₂`;
        
        // Add color based on value
        if (total < 4) {
          valueEl.style.color = '#10b981';
        } else if (total < 8) {
          valueEl.style.color = '#f59e0b';
        } else {
          valueEl.style.color = '#ef4444';
        }
      }
    }
  }

  exportData(format) {
    // Simulate export
    const notification = document.createElement('div');
    notification.className = 'feature-pill glass';
    notification.style.position = 'fixed';
    notification.style.bottom = '2rem';
    notification.style.right = '2rem';
    notification.style.zIndex = '1000';
    notification.innerHTML = `<span>✅</span><span>Exporting data as ${format.toUpperCase()}...</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transition = 'opacity 0.5s ease';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Global functions for HTML onclick handlers
function toggleTheme() {
  if (window.climateArcade) {
    window.climateArcade.isDarkMode = !window.climateArcade.isDarkMode;
    window.climateArcade.applyTheme();
    localStorage.setItem('theme', window.climateArcade.isDarkMode ? 'dark' : 'light');
  }
}

function showVisualization(type) {
  if (window.climateArcade) {
    window.climateArcade.showVisualization(type);
  }
}

function changeView(view) {
  if (window.climateArcade) {
    window.climateArcade.changeView(view);
  }
}

function calculateCarbon() {
  if (window.climateArcade) {
    window.climateArcade.calculateCarbon();
  }
}

function exportData(format) {
  if (window.climateArcade) {
    window.climateArcade.exportData(format);
  }
}

function scrollToSection(sectionId) {
  if (window.climateArcade) {
    window.climateArcade.scrollToSection(sectionId);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.climateArcade = new ClimateArcade();
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);