/**
 * Advanced Features Module for Climate Visualization
 * Phase 2-3 Features: Interactive Controls, 3D Globe, Heatmaps, Projections
 */

class AdvancedClimateFeatures {
  constructor(climateViz) {
    this.app = climateViz;
    this.settings = {
      showDataPoints: true,
      smoothLines: true,
      showProjections: true,
      colorScheme: "default",
      animationDuration: 1000,
    };
    this.filters = {
      yearStart: 1880,
      yearEnd: 2023,
      location: "global",
    };
    this.animations = {
      heatmap: null,
      globe: null,
    };
    this.globe = null;
    this.heatmapData = null;

    this.init();
  }

  init() {
    this.setupInteractiveControls();
    this.setupSettingsModal();
    this.loadLocationData();
  }

  setupInteractiveControls() {
    // Timeline sliders
    const yearStartSlider = document.getElementById("yearStart");
    const yearEndSlider = document.getElementById("yearEnd");
    const yearStartLabel = document.getElementById("yearStartLabel");
    const yearEndLabel = document.getElementById("yearEndLabel");

    yearStartSlider?.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      this.filters.yearStart = value;
      yearStartLabel.textContent = value;

      // Ensure start is always less than end
      if (value >= this.filters.yearEnd) {
        this.filters.yearEnd = Math.min(value + 10, 2023);
        yearEndSlider.value = this.filters.yearEnd;
        yearEndLabel.textContent = this.filters.yearEnd;
      }

      this.applyTimelineFilter();
    });

    yearEndSlider?.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      this.filters.yearEnd = value;
      yearEndLabel.textContent = value;

      // Ensure end is always greater than start
      if (value <= this.filters.yearStart) {
        this.filters.yearStart = Math.max(value - 10, 1880);
        yearStartSlider.value = this.filters.yearStart;
        yearStartLabel.textContent = this.filters.yearStart;
      }

      this.applyTimelineFilter();
    });

    // Location selector
    const locationSelect = document.getElementById("locationSelect");
    locationSelect?.addEventListener("change", (e) => {
      this.filters.location = e.target.value;
      this.applyLocationFilter();
    });

    // Heatmap controls
    const playBtn = document.getElementById("playBtn");
    const animationSpeed = document.getElementById("animationSpeed");

    playBtn?.addEventListener("click", () => {
      this.toggleHeatmapAnimation();
    });

    animationSpeed?.addEventListener("input", (e) => {
      this.updateAnimationSpeed(e.target.value);
    });

    // Globe controls
    const globeControls = document.querySelectorAll(
      ".globe-controls .control-btn",
    );
    globeControls.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        globeControls.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.updateGlobeLayer(e.target.dataset.layer);
      });
    });

    // Projection controls
    const scenarioSelect = document.getElementById("scenarioSelect");
    const projectionYear = document.getElementById("projectionYear");

    scenarioSelect?.addEventListener("change", () => {
      this.updateProjections();
    });

    projectionYear?.addEventListener("change", () => {
      this.updateProjections();
    });
  }

  setupSettingsModal() {
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsModal = document.getElementById("settingsModal");
    const closeBtn = settingsModal?.querySelector(".close");

    settingsBtn?.addEventListener("click", () => {
      settingsModal.style.display = "block";
    });

    closeBtn?.addEventListener("click", () => {
      settingsModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = "none";
      }
    });

    // Settings controls
    const showDataPoints = document.getElementById("showDataPoints");
    const smoothLines = document.getElementById("smoothLines");
    const showProjections = document.getElementById("showProjections");
    const colorScheme = document.getElementById("colorScheme");
    const animationDuration = document.getElementById("animationDuration");
    const durationValue = document.getElementById("durationValue");
    const resetSettings = document.getElementById("resetSettings");

    showDataPoints?.addEventListener("change", (e) => {
      this.settings.showDataPoints = e.target.checked;
      this.applySettings();
    });

    smoothLines?.addEventListener("change", (e) => {
      this.settings.smoothLines = e.target.checked;
      this.applySettings();
    });

    showProjections?.addEventListener("change", (e) => {
      this.settings.showProjections = e.target.checked;
      this.applySettings();
    });

    colorScheme?.addEventListener("change", (e) => {
      this.settings.colorScheme = e.target.value;
      this.applyColorScheme();
    });

    animationDuration?.addEventListener("input", (e) => {
      this.settings.animationDuration = parseInt(e.target.value);
      durationValue.textContent = e.target.value + "ms";
    });

    resetSettings?.addEventListener("click", () => {
      this.resetToDefaults();
    });
  }

  async loadLocationData() {
    // Regional climate data for location-based filtering
    this.locationData = {
      global: {
        name: "Global",
        tempMultiplier: 1.0,
        seaLevelMultiplier: 1.0,
      },
      arctic: {
        name: "Arctic",
        tempMultiplier: 2.5,
        seaLevelMultiplier: 0.8,
      },
      "north-america": {
        name: "North America",
        tempMultiplier: 1.2,
        seaLevelMultiplier: 1.1,
      },
      europe: {
        name: "Europe",
        tempMultiplier: 1.3,
        seaLevelMultiplier: 0.9,
      },
      asia: {
        name: "Asia",
        tempMultiplier: 1.1,
        seaLevelMultiplier: 1.2,
      },
      africa: {
        name: "Africa",
        tempMultiplier: 1.4,
        seaLevelMultiplier: 0.7,
      },
      "south-america": {
        name: "South America",
        tempMultiplier: 1.1,
        seaLevelMultiplier: 1.0,
      },
      oceania: {
        name: "Oceania",
        tempMultiplier: 0.9,
        seaLevelMultiplier: 1.5,
      },
    };
  }

  applyTimelineFilter() {
    // Re-render active charts with filtered date range
    const activeSection = document.querySelector(
      ".visualization-section.active",
    );
    if (activeSection) {
      const sectionId = activeSection.id;
      this.app.loadSectionData(sectionId);
    }
  }

  applyLocationFilter() {
    // Apply regional climate data adjustments
    const locationData = this.locationData[this.filters.location];
    // Applying filter for locationData.name

    // Re-render charts with location-specific data
    this.applyTimelineFilter();
  }

  async createHeatmap() {
    const container = document.getElementById("heatmapChart");
    if (!container) return;

    this.app.showLoading("heatmapChart");

    try {
      // Generate heatmap data (months x years)
      const temperatureData =
        await this.app.climateAPI.getTemperatureAnomalies();
      const filteredData = this.filterDataByTimeline(temperatureData.data);

      const heatmapData = this.generateHeatmapMatrix(filteredData);

      container.innerHTML = "";

      const margin = { top: 50, right: 100, bottom: 100, left: 80 };
      const width = container.clientWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create scales
      const years = heatmapData.map((d) => d.year);
      const months = [
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
      ];

      const xScale = d3
        .scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.01);

      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([height, 0])
        .padding(0.01);

      const colorScale = d3
        .scaleSequential(d3.interpolateRdYlBu)
        .domain([2, -2]);

      // Create heatmap cells
      const cells = g.selectAll(".cell").data(
        heatmapData.flatMap((d) =>
          months.map((month, i) => ({
            year: d.year,
            month: month,
            value: d.anomaly + (Math.random() - 0.5) * 0.5, // Add variation
            monthIndex: i,
          })),
        ),
      );

      cells
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", (d) => colorScale(d.value))
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("stroke", "#ffffff").attr("stroke-width", 2);

          const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<strong>${d.month} ${d.year}</strong><br/>
                                 Anomaly: ${d.value.toFixed(2)}°C`,
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", null);
          d3.selectAll(".tooltip").remove();
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 2)
        .attr("opacity", 0.8);

      // Add axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3.axisBottom(xScale).tickValues(years.filter((d, i) => i % 5 === 0)),
        )
        .selectAll("text")
        .style("fill", "#333")
        .style("font-size", "12px");

      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("fill", "#333")
        .style("font-size", "12px");

      // Add title
      svg
        .append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text("Global Temperature Anomalies Heatmap");

      // Add color legend
      this.addColorLegend(
        svg,
        colorScale,
        width + margin.left + margin.right - 80,
        100,
      );

      this.app.hideLoading("heatmapChart");
      this.heatmapData = heatmapData;
    } catch (error) {
      console.error("Heatmap creation error:", error);
      this.app.showError(
        "heatmapChart",
        "Failed to create heatmap visualization",
      );
    }
  }

  async create3DGlobe() {
    const container = document.getElementById("globeContainer");
    if (!container || this.globe) return;

    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Create Earth sphere
      const geometry = new THREE.SphereGeometry(2, 64, 64);

      // Load Earth texture
      const loader = new THREE.TextureLoader();
      const earthTexture = this.createEarthTexture();

      const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpScale: 0.05,
        transparent: true,
      });

      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      // Add atmosphere
      const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: this.getAtmosphereVertexShader(),
        fragmentShader: this.getAtmosphereFragmentShader(),
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Position camera
      camera.position.z = 5;

      // Add controls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.minDistance = 3;
      controls.maxDistance = 10;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        earth.rotation.y += 0.002;
        atmosphere.rotation.y += 0.001;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener("resize", handleResize);

      this.globe = {
        scene,
        camera,
        renderer,
        earth,
        atmosphere,
        controls,
        handleResize,
      };

      // Add climate data visualization
      this.addClimateDataToGlobe("temperature");
    } catch (error) {
      console.error("3D Globe creation error:", error);
      container.innerHTML =
        '<p style="color: #f2f2f7; text-align: center; padding: 2rem;">3D Globe visualization unavailable</p>';
    }
  }

  async createProjections() {
    const tempCtx = document.getElementById("tempProjectionChart");
    const seaCtx = document.getElementById("seaLevelProjectionChart");

    if (!tempCtx || !seaCtx) return;

    const scenario =
      document.getElementById("scenarioSelect")?.value || "rcp45";
    const targetYear =
      document.getElementById("projectionYear")?.value || "2050";

    // Temperature projections
    const tempProjections = this.generateProjectionData(
      "temperature",
      scenario,
      targetYear,
    );

    new Chart(tempCtx, {
      type: "line",
      data: {
        labels: tempProjections.labels,
        datasets: [
          {
            label: "Historical",
            data: tempProjections.historical,
            borderColor: "#007AFF",
            backgroundColor: "rgba(0, 122, 255, 0.1)",
            borderWidth: 3,
            fill: false,
          },
          {
            label: `Projection (${scenario.toUpperCase()})`,
            data: tempProjections.projected,
            borderColor: "#FF3B30",
            backgroundColor: "rgba(255, 59, 48, 0.1)",
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Temperature Projections to ${targetYear}`,
            color: "#333",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Temperature Anomaly (°C)",
              color: "#333",
            },
          },
        },
      },
    });

    // Sea level projections
    const seaProjections = this.generateProjectionData(
      "sea-level",
      scenario,
      targetYear,
    );

    new Chart(seaCtx, {
      type: "line",
      data: {
        labels: seaProjections.labels,
        datasets: [
          {
            label: "Historical",
            data: seaProjections.historical,
            borderColor: "#34C759",
            backgroundColor: "rgba(52, 199, 89, 0.1)",
            borderWidth: 3,
            fill: false,
          },
          {
            label: `Projection (${scenario.toUpperCase()})`,
            data: seaProjections.projected,
            borderColor: "#FF9500",
            backgroundColor: "rgba(255, 149, 0, 0.1)",
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Sea Level Rise Projections to ${targetYear}`,
            color: "#333",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Sea Level Rise (cm)",
              color: "#333",
            },
          },
        },
      },
    });
  }

  // Helper methods
  filterDataByTimeline(data) {
    return data.filter(
      (d) => d.year >= this.filters.yearStart && d.year <= this.filters.yearEnd,
    );
  }

  generateHeatmapMatrix(data) {
    return data.map((d) => ({
      year: d.year,
      anomaly:
        d.anomaly *
        (this.locationData[this.filters.location]?.tempMultiplier || 1),
    }));
  }

  generateProjectionData(type, scenario, targetYear) {
    const scenarios = {
      rcp26: { multiplier: 1.5, name: "Paris Agreement" },
      rcp45: { multiplier: 2.5, name: "Moderate" },
      rcp60: { multiplier: 3.5, name: "High" },
      rcp85: { multiplier: 4.5, name: "Business as Usual" },
    };

    const currentYear = 2023;
    const years = [];
    const historical = [];
    const projected = [];

    // Generate years from 2000 to target year
    for (let year = 2000; year <= parseInt(targetYear); year++) {
      years.push(year.toString());

      if (year <= currentYear) {
        // Historical data
        if (type === "temperature") {
          historical.push(0.6 + (year - 2000) * 0.02 + Math.random() * 0.1);
          projected.push(null);
        } else {
          historical.push((year - 2000) * 3.2 + Math.random() * 5);
          projected.push(null);
        }
      } else {
        // Projected data
        historical.push(null);
        const baseValue = type === "temperature" ? 1.1 : 100;
        const projectionFactor = scenarios[scenario].multiplier;
        const yearDiff = year - currentYear;

        if (type === "temperature") {
          projected.push(baseValue + yearDiff * 0.03 * projectionFactor);
        } else {
          projected.push(baseValue + yearDiff * 5 * projectionFactor);
        }
      }
    }

    return { labels: years, historical, projected };
  }

  createEarthTexture() {
    // Create a simple procedural Earth texture
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Ocean blue
    ctx.fillStyle = "#1e40af";
    ctx.fillRect(0, 0, 1024, 512);

    // Simple landmasses (approximate)
    ctx.fillStyle = "#22c55e";

    // North America
    ctx.fillRect(150, 100, 200, 150);

    // South America
    ctx.fillRect(200, 280, 100, 200);

    // Europe/Asia
    ctx.fillRect(450, 80, 400, 180);

    // Africa
    ctx.fillRect(480, 200, 120, 200);

    // Australia
    ctx.fillRect(750, 350, 100, 80);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  getAtmosphereVertexShader() {
    return `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
  }

  getAtmosphereFragmentShader() {
    return `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `;
  }

  addColorLegend(svg, colorScale, x, y) {
    const legendData = d3.range(-2, 2.1, 0.2);

    const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);

    legend
      .selectAll(".legend-rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("class", "legend-rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 15)
      .attr("width", 20)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d));

    legend
      .selectAll(".legend-text")
      .data(legendData.filter((d, i) => i % 5 === 0))
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 25)
      .attr("y", (d, i) => i * 75 + 12)
      .style("font-size", "12px")
      .style("fill", "#333")
      .text((d) => d.toFixed(1) + "°C");
  }

  toggleHeatmapAnimation() {
    const playBtn = document.getElementById("playBtn");
    if (this.animations.heatmap) {
      clearInterval(this.animations.heatmap);
      this.animations.heatmap = null;
      playBtn.textContent = "▶️ Play Animation";
    } else {
      this.startHeatmapAnimation();
      playBtn.textContent = "⏸️ Pause Animation";
    }
  }

  startHeatmapAnimation() {
    if (!this.heatmapData) return;

    let currentIndex = 0;
    const speed = document.getElementById("animationSpeed")?.value || 5;
    const interval = 1100 - speed * 100; // Convert to milliseconds

    this.animations.heatmap = setInterval(() => {
      // Highlight current year in heatmap
      const cells = d3.selectAll(".cell");
      cells.attr("opacity", 0.3);

      const currentYear = this.heatmapData[currentIndex]?.year;
      cells
        .filter((d) => d.year === currentYear)
        .attr("opacity", 1)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2);

      currentIndex = (currentIndex + 1) % this.heatmapData.length;
    }, interval);
  }

  updateAnimationSpeed(speed) {
    if (this.animations.heatmap) {
      this.toggleHeatmapAnimation();
      this.toggleHeatmapAnimation();
    }
  }

  updateGlobeLayer(layer) {
    if (!this.globe) return;

    // Update globe visualization based on selected layer
    // Updating globe layer
    this.addClimateDataToGlobe(layer);
  }

  addClimateDataToGlobe(layer) {
    if (!this.globe) return;

    // Remove existing climate data points
    const existingPoints = this.globe.scene.children.filter(
      (child) => child.userData.isClimateData,
    );
    existingPoints.forEach((point) => this.globe.scene.remove(point));

    // Add new climate data points based on layer
    const dataPoints = this.generateGlobeDataPoints(layer);
    dataPoints.forEach((point) => {
      const geometry = new THREE.SphereGeometry(0.02, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: point.color });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(point.x, point.y, point.z);
      sphere.userData.isClimateData = true;
      sphere.userData.info = point.info;

      this.globe.scene.add(sphere);
    });
  }

  generateGlobeDataPoints(layer) {
    const points = [];
    const radius = 2.05;

    // Generate sample data points around the globe
    for (let i = 0; i < 50; i++) {
      const lat = (Math.random() - 0.5) * Math.PI;
      const lon = (Math.random() - 0.5) * 2 * Math.PI;

      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);

      let color, value;
      switch (layer) {
        case "temperature":
          value = Math.random() * 4 - 2; // -2 to 2°C
          color = value > 0 ? 0xff4444 : 0x4444ff;
          break;
        case "precipitation":
          value = Math.random() * 100; // 0 to 100mm
          color = 0x44ff44;
          break;
        case "sea-level":
          value = Math.random() * 50; // 0 to 50cm
          color = 0x44ffff;
          break;
        case "emissions":
          value = Math.random() * 10; // 0 to 10 tons
          color = 0xff8844;
          break;
        default:
          color = 0xffffff;
          value = 0;
      }

      points.push({
        x,
        y,
        z,
        color,
        info: `${layer}: ${value.toFixed(2)}`,
      });
    }

    return points;
  }

  updateProjections() {
    this.createProjections();
  }

  applySettings() {
    // Apply settings to all charts
    Object.values(this.app.charts).forEach((chart) => {
      if (chart && chart.options) {
        chart.options.animation = {
          duration: this.settings.animationDuration,
        };

        chart.data.datasets.forEach((dataset) => {
          if (this.settings.showDataPoints) {
            dataset.pointRadius = 4;
            dataset.pointHoverRadius = 6;
          } else {
            dataset.pointRadius = 0;
            dataset.pointHoverRadius = 0;
          }

          dataset.tension = this.settings.smoothLines ? 0.4 : 0;
        });

        chart.update();
      }
    });
  }

  applyColorScheme() {
    const body = document.body;
    body.className = body.className.replace(
      /colorblind-friendly|high-contrast/g,
      "",
    );

    if (this.settings.colorScheme !== "default") {
      body.classList.add(this.settings.colorScheme);
    }
  }

  resetToDefaults() {
    this.settings = {
      showDataPoints: true,
      smoothLines: true,
      showProjections: true,
      colorScheme: "default",
      animationDuration: 1000,
    };

    // Update UI
    document.getElementById("showDataPoints").checked = true;
    document.getElementById("smoothLines").checked = true;
    document.getElementById("showProjections").checked = true;
    document.getElementById("colorScheme").value = "default";
    document.getElementById("animationDuration").value = 1000;
    document.getElementById("durationValue").textContent = "1000ms";

    this.applySettings();
    this.applyColorScheme();
  }

  destroy() {
    // Cleanup animations
    if (this.animations.heatmap) {
      clearInterval(this.animations.heatmap);
    }

    // Cleanup 3D globe
    if (this.globe) {
      window.removeEventListener("resize", this.globe.handleResize);
      this.globe.renderer.dispose();
    }
  }
}

// Export for use in main app
window.AdvancedClimateFeatures = AdvancedClimateFeatures;
