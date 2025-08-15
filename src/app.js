// Climate Change Visualization App with Real Data Integration
class ClimateViz {
  constructor() {
    this.climateAPI = new ClimateAPI();
    this.charts = {};
    this.loadingStates = new Set();
    this.advancedFeatures = null;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadInitialData();

    // Initialize advanced features after basic setup
    setTimeout(() => {
      this.advancedFeatures = new AdvancedClimateFeatures(this);
      this.userTools = new ClimateUserTools(this);
    }, 100);
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".visualization-section");

    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetSection = button.dataset.section;

        // Update active states
        navButtons.forEach((btn) => btn.classList.remove("active"));
        sections.forEach((section) => section.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(targetSection).classList.add("active");

        // Load section-specific data
        this.loadSectionData(targetSection);
      });
    });
  }

  async loadInitialData() {
    await this.createTemperatureChart();
  }

  async loadSectionData(section) {
    switch (section) {
      case "temperature":
        await this.createTemperatureChart();
        break;
      case "sea-level":
        await this.createSeaLevelChart();
        this.createSeaLevelMap();
        break;
      case "emissions":
        await this.createEmissionsChart();
        break;
      case "extreme-events":
        await this.createExtremeEventsChart();
        break;
      case "heatmap":
        if (this.advancedFeatures) {
          await this.advancedFeatures.createHeatmap();
        }
        break;
      case "globe":
        if (this.advancedFeatures) {
          await this.advancedFeatures.create3DGlobe();
        }
        break;
      case "projections":
        if (this.advancedFeatures) {
          await this.advancedFeatures.createProjections();
        }
        break;
      case "carbon-calculator":
        if (this.userTools) {
          this.userTools.showCarbonCalculator();
        }
        break;
      case "data-export":
        if (this.userTools) {
          this.userTools.showDataExport();
        }
        break;
      case "comparison-tools":
        if (this.userTools) {
          this.userTools.showComparisonTools();
        }
        break;
      case "impact-assessment":
        if (this.userTools) {
          this.userTools.showImpactAssessment();
        }
        break;
    }
  }

  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.loadingStates.add(containerId);
    container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading climate data...</p>
            </div>
        `;
  }

  hideLoading(containerId) {
    this.loadingStates.delete(containerId);
  }

  showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
            <div class="error-state">
                <p>⚠️ ${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
  }

  async createTemperatureChart() {
    const ctx = document.getElementById("temperatureChart");
    if (!ctx) return;

    this.showLoading("temperatureChart");

    try {
      const temperatureData = await this.climateAPI.getTemperatureAnomalies();

      // Apply filters if advanced features are available
      let filteredData = temperatureData.data;
      if (this.advancedFeatures) {
        filteredData = this.advancedFeatures.filterDataByTimeline(
          temperatureData.data,
        );
        const locationMultiplier =
          this.advancedFeatures.locationData[
            this.advancedFeatures.filters.location
          ]?.tempMultiplier || 1;
        filteredData = filteredData.map((d) => ({
          ...d,
          anomaly: d.anomaly * locationMultiplier,
        }));
      }

      // Destroy existing chart
      if (this.charts.temperature) {
        this.charts.temperature.destroy();
      }

      const chartData = {
        labels: filteredData.map((d) => d.year.toString()),
        datasets: [
          {
            label: "Temperature Anomaly (°C)",
            data: filteredData.map((d) => d.anomaly),
            borderColor: "#ff6b6b",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#ff6b6b",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
          },
        ],
      };

      this.charts.temperature = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Global Temperature Anomalies (${temperatureData.source})`,
              color: "#333",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              labels: { color: "#333" },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}°C`;
                },
                afterLabel: function (context) {
                  const year = context.label;
                  if (parseInt(year) >= 2020) {
                    return "Recent warming trend";
                  }
                  return "";
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: "Temperature Anomaly (°C relative to 1951-1980 mean)",
                color: "#333",
              },
              ticks: {
                color: "#333",
                callback: function (value) {
                  return value.toFixed(1) + "°C";
                },
              },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
            x: {
              title: {
                display: true,
                text: "Year",
                color: "#333",
              },
              ticks: { color: "#333" },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });

      this.hideLoading("temperatureChart");

      // Update info panel
      this.updateTemperatureInfo({ ...temperatureData, data: filteredData });
    } catch (error) {
      console.error("Temperature chart error:", error);
      this.showError(
        "temperatureChart",
        "Failed to load temperature data. Using fallback data.",
      );
      // Fallback to sample data
      this.createFallbackTemperatureChart();
    }
  }

  updateTemperatureInfo(temperatureData) {
    const infoPanel = document.querySelector("#temperature .info-panel p");
    if (infoPanel && temperatureData.data.length > 0) {
      const latestData = temperatureData.data[temperatureData.data.length - 1];
      const trend = latestData.anomaly > 0 ? "above" : "below";
      infoPanel.innerHTML = `
                Latest data (${latestData.year}): ${latestData.anomaly.toFixed(2)}°C ${trend} the 1951-1980 average.
                <br><small>Data source: ${temperatureData.source}</small>
            `;
    }
  }

  async createSeaLevelChart() {
    const ctx = document.getElementById("seaLevelChart");
    if (!ctx) return;

    this.showLoading("seaLevelChart");

    try {
      const seaLevelData = await this.climateAPI.getSeaLevelData();

      // Destroy existing chart
      if (this.charts.seaLevel) {
        this.charts.seaLevel.destroy();
      }

      const chartData = {
        labels: seaLevelData.data.map((d) => d.year.toString()),
        datasets: [
          {
            label: "Sea Level Rise (mm)",
            data: seaLevelData.data.map((d) => d.level),
            borderColor: "#4ecdc4",
            backgroundColor: "rgba(78, 205, 196, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#4ecdc4",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
          },
        ],
      };

      this.charts.seaLevel = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Global Mean Sea Level Rise (${seaLevelData.source})`,
              color: "#333",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              labels: { color: "#333" },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} mm`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Sea Level Rise (mm relative to 1993 baseline)",
                color: "#333",
              },
              ticks: {
                color: "#333",
                callback: function (value) {
                  return value + " mm";
                },
              },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
            x: {
              title: {
                display: true,
                text: "Year",
                color: "#333",
              },
              ticks: { color: "#333" },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
          },
        },
      });

      this.hideLoading("seaLevelChart");
    } catch (error) {
      console.error("Sea level chart error:", error);
      this.showError("seaLevelChart", "Failed to load sea level data");
    }
  }

  createSeaLevelMap() {
    const mapContainer = document.getElementById("seaLevelMap");
    if (!mapContainer || mapContainer.children.length > 0) return;

    try {
      const map = L.map("seaLevelMap").setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add markers for vulnerable coastal cities
      const vulnerableCities = [
        {
          name: "Miami, FL",
          lat: 25.7617,
          lng: -80.1918,
          risk: "High",
          projection: "0.6m by 2100",
        },
        {
          name: "Venice, Italy",
          lat: 45.4408,
          lng: 12.3155,
          risk: "Very High",
          projection: "1.2m by 2100",
        },
        {
          name: "Bangkok, Thailand",
          lat: 13.7563,
          lng: 100.5018,
          risk: "High",
          projection: "0.8m by 2100",
        },
        {
          name: "Amsterdam, Netherlands",
          lat: 52.3676,
          lng: 4.9041,
          risk: "Medium",
          projection: "0.4m by 2100",
        },
        {
          name: "New Orleans, LA",
          lat: 29.9511,
          lng: -90.0715,
          risk: "Very High",
          projection: "1.0m by 2100",
        },
        {
          name: "Jakarta, Indonesia",
          lat: -6.2088,
          lng: 106.8456,
          risk: "Very High",
          projection: "2.5m by 2100",
        },
        {
          name: "Mumbai, India",
          lat: 19.076,
          lng: 72.8777,
          risk: "High",
          projection: "0.7m by 2100",
        },
        {
          name: "Alexandria, Egypt",
          lat: 31.2001,
          lng: 29.9187,
          risk: "High",
          projection: "0.9m by 2100",
        },
      ];

      vulnerableCities.forEach((city) => {
        const color =
          city.risk === "Very High"
            ? "#ff4444"
            : city.risk === "High"
              ? "#ff8800"
              : "#ffcc00";

        L.circleMarker([city.lat, city.lng], {
          radius: city.risk === "Very High" ? 10 : city.risk === "High" ? 8 : 6,
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map).bindPopup(`
                    <div class="map-popup">
                        <h4>${city.name}</h4>
                        <p><strong>Risk Level:</strong> ${city.risk}</p>
                        <p><strong>Projected Rise:</strong> ${city.projection}</p>
                    </div>
                  `);
      });

      // Add legend
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "map-legend");
        div.innerHTML = `
                    <h5>Sea Level Risk</h5>
                    <div><span style="background: #ff4444"></span> Very High</div>
                    <div><span style="background: #ff8800"></span> High</div>
                    <div><span style="background: #ffcc00"></span> Medium</div>
                `;
        return div;
      };
      legend.addTo(map);
    } catch (error) {
      console.error("Map creation error:", error);
      mapContainer.innerHTML = "<p>Map unavailable</p>";
    }
  }

  async createEmissionsChart() {
    const container = document.getElementById("emissionsChart");
    if (!container) return;

    this.showLoading("emissionsChart");

    try {
      const emissionsData = await this.climateAPI.getEmissionsData();
      container.innerHTML = "";

      const margin = { top: 20, right: 30, bottom: 100, left: 60 };
      const width = container.clientWidth - margin.left - margin.right;
      const height = 350 - margin.top - margin.bottom;

      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(emissionsData.data.map((d) => d.country));

      const y = d3
        .scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(emissionsData.data, (d) => d.emissions)]);

      // Color scale based on emission levels
      const colorScale = d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(emissionsData.data, (d) => d.emissions)]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")
        .style("fill", "#333");

      g.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#333");

      // Add bars with animation
      g.selectAll(".bar")
        .data(emissionsData.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.country))
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", (d) => colorScale(d.emissions))
        .on("mouseover", function (event, d) {
          d3.select(this).attr("opacity", 0.8);

          // Tooltip
          const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<strong>${d.country}</strong><br/>${d.emissions.toFixed(2)} billion tons CO₂<br/>Year: ${d.year}`,
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function (event, d) {
          d3.select(this).attr("opacity", 1);
          d3.selectAll(".tooltip").remove();
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("y", (d) => y(d.emissions))
        .attr("height", (d) => height - y(d.emissions));

      // Add title
      svg
        .append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(`CO₂ Emissions by Country (${emissionsData.source})`);

      // Add Y-axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 + 20)
        .attr("x", 0 - height / 2)
        .style("text-anchor", "middle")
        .style("fill", "#333")
        .text("Billion Tons CO₂/Year");

      this.hideLoading("emissionsChart");
    } catch (error) {
      console.error("Emissions chart error:", error);
      this.showError("emissionsChart", "Failed to load emissions data");
    }
  }

  async createExtremeEventsChart() {
    const ctx = document.getElementById("eventsChart");
    if (!ctx) return;

    this.showLoading("eventsChart");

    try {
      const eventsData = await this.climateAPI.getExtremeEventsData();

      // Destroy existing chart
      if (this.charts.events) {
        this.charts.events.destroy();
      }

      const chartData = {
        labels: eventsData.data.hurricanes.map((d) => d.year.toString()),
        datasets: [
          {
            label: "Hurricanes",
            data: eventsData.data.hurricanes.map((d) => d.count),
            backgroundColor: "rgba(255, 107, 107, 0.8)",
            borderColor: "#ff6b6b",
            borderWidth: 2,
          },
          {
            label: "Major Floods",
            data: eventsData.data.floods.map((d) => d.count),
            backgroundColor: "rgba(78, 205, 196, 0.8)",
            borderColor: "#4ecdc4",
            borderWidth: 2,
          },
          {
            label: "Severe Droughts",
            data: eventsData.data.droughts.map((d) => d.count),
            backgroundColor: "rgba(255, 193, 7, 0.8)",
            borderColor: "#ffc107",
            borderWidth: 2,
          },
        ],
      };

      this.charts.events = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Extreme Weather Events (${eventsData.source})`,
              color: "#333",
              font: { size: 16, weight: "bold" },
            },
            legend: {
              labels: { color: "#333" },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y} events`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Events",
                color: "#333",
              },
              ticks: { color: "#333" },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
            x: {
              title: {
                display: true,
                text: "Year",
                color: "#333",
              },
              ticks: { color: "#333" },
              grid: { color: "rgba(0,0,0,0.1)" },
            },
          },
        },
      });

      this.hideLoading("eventsChart");
    } catch (error) {
      console.error("Events chart error:", error);
      this.showError("eventsChart", "Failed to load extreme events data");
    }
  }

  createFallbackTemperatureChart() {
    const ctx = document.getElementById("temperatureChart");
    if (!ctx) return;

    const fallbackData = {
      labels: ["1880", "1900", "1920", "1940", "1960", "1980", "2000", "2020"],
      datasets: [
        {
          label: "Temperature Anomaly (°C) - Sample Data",
          data: [-0.2, -0.1, -0.05, 0.1, 0.0, 0.4, 0.6, 1.1],
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    this.charts.temperature = new Chart(ctx, {
      type: "line",
      data: fallbackData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Global Temperature Anomalies (Sample Data)",
            color: "#333",
            font: { size: 16, weight: "bold" },
          },
        },
      },
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ClimateViz();
});
