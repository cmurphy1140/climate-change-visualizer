/**
 * User Tools Module for Climate Visualization
 * Phase 4: Carbon Calculator, Data Export, Comparison Tools, Impact Assessment
 */

class ClimateUserTools {
    constructor(climateViz) {
        this.app = climateViz;
        this.carbonData = {
            personal: {},
            household: {},
            business: {}
        };
        this.exportFormats = ['pdf', 'png', 'csv', 'json'];
        this.comparisonData = [];
        this.init();
    }

    init() {
        this.setupCarbonCalculator();
        this.setupDataExport();
        this.setupComparisonTools();
        this.setupImpactAssessment();
        this.loadEmissionFactors();
    }

    setupCarbonCalculator() {
        // Create carbon calculator UI if not exists
        if (!document.getElementById('carbonCalculator')) {
            this.createCarbonCalculatorUI();
        }
        
        this.bindCarbonCalculatorEvents();
    }

    createCarbonCalculatorUI() {
        const calculatorHTML = `
            <!-- Carbon Calculator Section -->
            <section id="carbon-calculator" class="visualization-section">
                <h2>🌱 Personal Carbon Footprint Calculator</h2>
                
                <div class="calculator-tabs">
                    <button class="tab-btn active" data-tab="personal">Personal</button>
                    <button class="tab-btn" data-tab="household">Household</button>
                    <button class="tab-btn" data-tab="business">Business</button>
                </div>

                <div class="calculator-content">
                    <!-- Personal Calculator -->
                    <div id="personal-calc" class="calc-tab active">
                        <div class="calc-grid">
                            <div class="calc-category">
                                <h3>🚗 Transportation</h3>
                                <div class="input-group">
                                    <label>Daily car commute (miles)</label>
                                    <input type="number" id="car-miles" value="0" min="0" max="200">
                                </div>
                                <div class="input-group">
                                    <label>Vehicle type</label>
                                    <select id="vehicle-type">
                                        <option value="gas">Gasoline Car</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="electric">Electric</option>
                                        <option value="diesel">Diesel</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label>Annual flights</label>
                                    <input type="number" id="flights" value="0" min="0" max="50">
                                </div>
                                <div class="input-group">
                                    <label>Public transport (hours/week)</label>
                                    <input type="number" id="public-transport" value="0" min="0" max="40">
                                </div>
                            </div>

                            <div class="calc-category">
                                <h3>🏠 Home Energy</h3>
                                <div class="input-group">
                                    <label>Monthly electricity (kWh)</label>
                                    <input type="number" id="electricity" value="900" min="0" max="5000">
                                </div>
                                <div class="input-group">
                                    <label>Monthly natural gas (therms)</label>
                                    <input type="number" id="natural-gas" value="80" min="0" max="500">
                                </div>
                                <div class="input-group">
                                    <label>Home type</label>
                                    <select id="home-type">
                                        <option value="apartment">Apartment</option>
                                        <option value="house-small">Small House</option>
                                        <option value="house-medium">Medium House</option>
                                        <option value="house-large">Large House</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label>Renewable energy %</label>
                                    <input type="range" id="renewable-percent" value="15" min="0" max="100">
                                    <span id="renewable-display">15%</span>
                                </div>
                            </div>

                            <div class="calc-category">
                                <h3>🍎 Diet & Lifestyle</h3>
                                <div class="input-group">
                                    <label>Diet type</label>
                                    <select id="diet-type">
                                        <option value="meat-heavy">High Meat</option>
                                        <option value="average">Average</option>
                                        <option value="low-meat">Low Meat</option>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label>Shopping frequency</label>
                                    <select id="shopping">
                                        <option value="minimal">Minimal</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="frequent">Frequent</option>
                                        <option value="excessive">Excessive</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label>Waste reduction efforts</label>
                                    <select id="waste-reduction">
                                        <option value="high">High (recycle, compost, reuse)</option>
                                        <option value="medium">Medium (some recycling)</option>
                                        <option value="low">Low (minimal effort)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="calculation-results">
                            <div class="result-summary">
                                <h3>Your Annual Carbon Footprint</h3>
                                <div class="footprint-total">
                                    <span id="total-emissions">12.5</span>
                                    <small>tons CO₂e/year</small>
                                </div>
                                <div class="comparison-bars">
                                    <div class="comparison-item">
                                        <span>You</span>
                                        <div class="bar" style="width: 70%"></div>
                                        <span id="user-total">12.5t</span>
                                    </div>
                                    <div class="comparison-item">
                                        <span>US Average</span>
                                        <div class="bar" style="width: 100%"></div>
                                        <span>16.0t</span>
                                    </div>
                                    <div class="comparison-item">
                                        <span>Global Average</span>
                                        <div class="bar" style="width: 25%"></div>
                                        <span>4.0t</span>
                                    </div>
                                    <div class="comparison-item">
                                        <span>Paris Target</span>
                                        <div class="bar" style="width: 15%"></div>
                                        <span>2.3t</span>
                                    </div>
                                </div>
                            </div>

                            <div class="breakdown-chart">
                                <canvas id="emissionsBreakdownChart"></canvas>
                            </div>
                        </div>

                        <div class="recommendations">
                            <h3>🎯 Personalized Recommendations</h3>
                            <div id="recommendation-list" class="recommendation-grid">
                                <!-- Recommendations will be populated dynamically -->
                            </div>
                        </div>
                    </div>

                    <!-- Household Calculator -->
                    <div id="household-calc" class="calc-tab">
                        <div class="calc-grid">
                            <div class="calc-category">
                                <h3>👨‍👩‍👧‍👦 Household Details</h3>
                                <div class="input-group">
                                    <label>Number of residents</label>
                                    <input type="number" id="household-size" value="3" min="1" max="10">
                                </div>
                                <div class="input-group">
                                    <label>Number of vehicles</label>
                                    <input type="number" id="household-vehicles" value="2" min="0" max="10">
                                </div>
                                <div class="input-group">
                                    <label>Home size (sq ft)</label>
                                    <input type="number" id="home-size" value="2000" min="500" max="10000">
                                </div>
                            </div>
                        </div>
                        <div class="household-results">
                            <div class="result-summary">
                                <h3>Household Carbon Footprint</h3>
                                <div class="footprint-total">
                                    <span id="household-total-emissions">35.2</span>
                                    <small>tons CO₂e/year</small>
                                </div>
                                <div class="per-person">
                                    <span id="per-person-emissions">11.7</span>
                                    <small>tons CO₂e per person</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Business Calculator -->
                    <div id="business-calc" class="calc-tab">
                        <div class="calc-grid">
                            <div class="calc-category">
                                <h3>🏢 Business Operations</h3>
                                <div class="input-group">
                                    <label>Number of employees</label>
                                    <input type="number" id="employees" value="50" min="1" max="10000">
                                </div>
                                <div class="input-group">
                                    <label>Office space (sq ft)</label>
                                    <input type="number" id="office-size" value="5000" min="100" max="100000">
                                </div>
                                <div class="input-group">
                                    <label>Business type</label>
                                    <select id="business-type">
                                        <option value="office">Office/Services</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="tech">Technology</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="business-results">
                            <div class="result-summary">
                                <h3>Business Carbon Footprint</h3>
                                <div class="footprint-total">
                                    <span id="business-total-emissions">285.5</span>
                                    <small>tons CO₂e/year</small>
                                </div>
                                <div class="per-employee">
                                    <span id="per-employee-emissions">5.7</span>
                                    <small>tons CO₂e per employee</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="calculator-actions">
                    <button id="calculate-footprint" class="primary-btn">Calculate Footprint</button>
                    <button id="export-calculation" class="secondary-btn">Export Results</button>
                    <button id="save-calculation" class="secondary-btn">Save & Track</button>
                    <button id="share-results" class="secondary-btn">Share Results</button>
                </div>
            </section>

            <!-- Data Export Section -->
            <section id="data-export" class="visualization-section">
                <h2>📊 Data Export & Reports</h2>
                
                <div class="export-options">
                    <div class="export-category">
                        <h3>Climate Data Export</h3>
                        <div class="export-controls">
                            <label>
                                <input type="checkbox" id="export-temperature" checked>
                                Temperature Anomalies
                            </label>
                            <label>
                                <input type="checkbox" id="export-sealevel" checked>
                                Sea Level Data
                            </label>
                            <label>
                                <input type="checkbox" id="export-emissions" checked>
                                Emissions Data
                            </label>
                            <label>
                                <input type="checkbox" id="export-events" checked>
                                Extreme Events
                            </label>
                        </div>
                        <div class="export-formats">
                            <button class="export-btn" data-format="csv">📄 Export CSV</button>
                            <button class="export-btn" data-format="json">🔧 Export JSON</button>
                            <button class="export-btn" data-format="pdf">📋 Generate Report</button>
                        </div>
                    </div>

                    <div class="export-category">
                        <h3>Chart Export</h3>
                        <div class="chart-export-grid">
                            <button class="chart-export-btn" data-chart="temperature">Temperature Chart</button>
                            <button class="chart-export-btn" data-chart="sea-level">Sea Level Chart</button>
                            <button class="chart-export-btn" data-chart="emissions">Emissions Chart</button>
                            <button class="chart-export-btn" data-chart="heatmap">Heatmap</button>
                            <button class="chart-export-btn" data-chart="globe">3D Globe</button>
                            <button class="chart-export-btn" data-chart="projections">Projections</button>
                        </div>
                    </div>

                    <div class="export-category">
                        <h3>Custom Reports</h3>
                        <div class="report-builder">
                            <div class="input-group">
                                <label>Report Title</label>
                                <input type="text" id="report-title" placeholder="Climate Analysis Report">
                            </div>
                            <div class="input-group">
                                <label>Date Range</label>
                                <select id="report-range">
                                    <option value="all">All Available Data</option>
                                    <option value="recent">Last 10 Years</option>
                                    <option value="century">20th Century</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Include Projections</label>
                                <input type="checkbox" id="include-projections" checked>
                            </div>
                            <button id="generate-custom-report" class="primary-btn">Generate Custom Report</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Comparison Tools Section -->
            <section id="comparison-tools" class="visualization-section">
                <h2>⚖️ Regional Climate Comparison</h2>
                
                <div class="comparison-builder">
                    <div class="region-selector">
                        <h3>Select Regions to Compare</h3>
                        <div class="region-grid">
                            <label class="region-checkbox">
                                <input type="checkbox" value="global" checked>
                                <span>🌍 Global</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="arctic">
                                <span>🧊 Arctic</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="north-america">
                                <span>🍁 North America</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="europe">
                                <span>🏰 Europe</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="asia">
                                <span>🏯 Asia</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="africa">
                                <span>🦁 Africa</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="south-america">
                                <span>🦜 South America</span>
                            </label>
                            <label class="region-checkbox">
                                <input type="checkbox" value="oceania">
                                <span>🏄 Oceania</span>
                            </label>
                        </div>
                    </div>

                    <div class="metric-selector">
                        <h3>Comparison Metrics</h3>
                        <div class="metric-buttons">
                            <button class="metric-btn active" data-metric="temperature">Temperature Change</button>
                            <button class="metric-btn" data-metric="sea-level">Sea Level Rise</button>
                            <button class="metric-btn" data-metric="precipitation">Precipitation</button>
                            <button class="metric-btn" data-metric="extreme-events">Extreme Events</button>
                        </div>
                    </div>

                    <button id="generate-comparison" class="primary-btn">Generate Comparison</button>
                </div>

                <div class="comparison-results">
                    <div class="comparison-charts">
                        <canvas id="comparisonChart"></canvas>
                    </div>
                    <div class="comparison-table">
                        <table id="comparisonTable">
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- Impact Assessment Section -->
            <section id="impact-assessment" class="visualization-section">
                <h2>🎯 Climate Impact Assessment</h2>
                
                <div class="assessment-wizard">
                    <div class="wizard-steps">
                        <div class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-title">Location</span>
                        </div>
                        <div class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-title">Timeframe</span>
                        </div>
                        <div class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-title">Scenarios</span>
                        </div>
                        <div class="step" data-step="4">
                            <span class="step-number">4</span>
                            <span class="step-title">Results</span>
                        </div>
                    </div>

                    <div class="wizard-content">
                        <div class="wizard-step active" data-step="1">
                            <h3>Select Your Location</h3>
                            <div class="location-input">
                                <input type="text" id="assessment-location" placeholder="Enter city, state, or coordinates">
                                <button id="use-current-location">📍 Use Current Location</button>
                            </div>
                            <div class="location-info">
                                <p>We'll analyze climate impacts specific to your area</p>
                            </div>
                        </div>

                        <div class="wizard-step" data-step="2">
                            <h3>Assessment Timeframe</h3>
                            <div class="timeframe-options">
                                <label class="timeframe-option">
                                    <input type="radio" name="timeframe" value="2030">
                                    <span>2030 (Short-term)</span>
                                </label>
                                <label class="timeframe-option">
                                    <input type="radio" name="timeframe" value="2050" checked>
                                    <span>2050 (Medium-term)</span>
                                </label>
                                <label class="timeframe-option">
                                    <input type="radio" name="timeframe" value="2100">
                                    <span>2100 (Long-term)</span>
                                </label>
                            </div>
                        </div>

                        <div class="wizard-step" data-step="3">
                            <h3>Climate Scenarios</h3>
                            <div class="scenario-cards">
                                <div class="scenario-card" data-scenario="rcp26">
                                    <h4>🟢 Paris Agreement (RCP 2.6)</h4>
                                    <p>Strong climate action, 1.5°C warming</p>
                                </div>
                                <div class="scenario-card" data-scenario="rcp45">
                                    <h4>🟡 Moderate Action (RCP 4.5)</h4>
                                    <p>Some climate action, 2-3°C warming</p>
                                </div>
                                <div class="scenario-card" data-scenario="rcp85">
                                    <h4>🔴 Business as Usual (RCP 8.5)</h4>
                                    <p>Limited climate action, 4-5°C warming</p>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-step" data-step="4">
                            <h3>Impact Assessment Results</h3>
                            <div class="assessment-results">
                                <div class="impact-summary">
                                    <div class="impact-meter">
                                        <canvas id="impactMeter"></canvas>
                                        <div class="impact-score">
                                            <span id="impact-score">7.2</span>
                                            <small>Impact Score</small>
                                        </div>
                                    </div>
                                    <div class="impact-details">
                                        <div class="impact-item">
                                            <span class="impact-icon">🌡️</span>
                                            <span class="impact-label">Temperature Rise</span>
                                            <span class="impact-value">+2.4°C</span>
                                        </div>
                                        <div class="impact-item">
                                            <span class="impact-icon">🌊</span>
                                            <span class="impact-label">Sea Level Rise</span>
                                            <span class="impact-value">+45cm</span>
                                        </div>
                                        <div class="impact-item">
                                            <span class="impact-icon">🌧️</span>
                                            <span class="impact-label">Precipitation Change</span>
                                            <span class="impact-value">+15%</span>
                                        </div>
                                        <div class="impact-item">
                                            <span class="impact-icon">⚡</span>
                                            <span class="impact-label">Extreme Events</span>
                                            <span class="impact-value">+60%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="adaptation-recommendations">
                                    <h4>Recommended Adaptations</h4>
                                    <ul id="adaptation-list">
                                        <!-- Populated dynamically -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-navigation">
                        <button id="prev-step" class="secondary-btn" disabled>Previous</button>
                        <button id="next-step" class="primary-btn">Next</button>
                    </div>
                </div>
            </section>
        `;

        // Insert before existing sections
        const mainElement = document.querySelector('main');
        const temperatureSection = document.getElementById('temperature');
        temperatureSection.insertAdjacentHTML('beforebegin', calculatorHTML);
    }

    bindCarbonCalculatorEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchCalculatorTab(tab);
            });
        });

        // Real-time calculation updates
        const inputs = document.querySelectorAll('#personal-calc input, #personal-calc select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculatePersonalFootprint();
            });
        });

        // Renewable energy percentage display
        const renewableSlider = document.getElementById('renewable-percent');
        const renewableDisplay = document.getElementById('renewable-display');
        renewableSlider?.addEventListener('input', (e) => {
            renewableDisplay.textContent = e.target.value + '%';
            this.calculatePersonalFootprint();
        });

        // Calculator actions
        document.getElementById('calculate-footprint')?.addEventListener('click', () => {
            this.calculateActiveFootprint();
        });

        document.getElementById('export-calculation')?.addEventListener('click', () => {
            this.exportCalculation();
        });

        document.getElementById('save-calculation')?.addEventListener('click', () => {
            this.saveCalculation();
        });

        document.getElementById('share-results')?.addEventListener('click', () => {
            this.shareCalculationResults();
        });
    }

    loadEmissionFactors() {
        // Emission factors for various activities (kg CO2e)
        this.emissionFactors = {
            transport: {
                gas: 0.404,          // kg CO2e per mile
                hybrid: 0.256,       // kg CO2e per mile
                electric: 0.124,     // kg CO2e per mile (avg US grid)
                diesel: 0.451,       // kg CO2e per mile
                flight: 0.241,       // kg CO2e per mile
                publicTransport: 0.089 // kg CO2e per mile
            },
            energy: {
                electricity: 0.709,  // kg CO2e per kWh (US average)
                naturalGas: 5.302,   // kg CO2e per therm
                homeTypeMultiplier: {
                    apartment: 0.7,
                    'house-small': 1.0,
                    'house-medium': 1.3,
                    'house-large': 1.8
                }
            },
            diet: {
                'meat-heavy': 3.3,   // tons CO2e per year
                'average': 2.5,
                'low-meat': 1.9,
                'vegetarian': 1.4,
                'vegan': 1.0
            },
            lifestyle: {
                shopping: {
                    'minimal': 0.5,
                    'moderate': 1.2,
                    'frequent': 2.1,
                    'excessive': 3.5
                },
                wasteReduction: {
                    'high': 0.8,      // multiplier
                    'medium': 1.0,
                    'low': 1.3
                }
            }
        };

        this.recommendations = {
            transport: [
                { action: "Switch to electric vehicle", impact: 2.5, cost: "High", difficulty: "Medium" },
                { action: "Use public transportation", impact: 1.8, cost: "Low", difficulty: "Easy" },
                { action: "Work from home 2 days/week", impact: 1.2, cost: "None", difficulty: "Easy" },
                { action: "Combine errands into fewer trips", impact: 0.5, cost: "None", difficulty: "Easy" }
            ],
            energy: [
                { action: "Install solar panels", impact: 3.2, cost: "High", difficulty: "Hard" },
                { action: "Switch to renewable energy plan", impact: 2.8, cost: "Low", difficulty: "Easy" },
                { action: "Improve home insulation", impact: 1.5, cost: "Medium", difficulty: "Medium" },
                { action: "Use LED bulbs throughout home", impact: 0.3, cost: "Low", difficulty: "Easy" }
            ],
            diet: [
                { action: "Reduce meat consumption by 50%", impact: 1.1, cost: "None", difficulty: "Medium" },
                { action: "Buy local, seasonal produce", impact: 0.4, cost: "Low", difficulty: "Easy" },
                { action: "Reduce food waste", impact: 0.8, cost: "None", difficulty: "Easy" },
                { action: "Start a home garden", impact: 0.2, cost: "Low", difficulty: "Medium" }
            ]
        };
    }

    switchCalculatorTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update tab content
        document.querySelectorAll('.calc-tab').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}-calc`);
        });

        // Calculate for the active tab
        this.calculateActiveFootprint();
    }

    calculatePersonalFootprint() {
        const factors = this.emissionFactors;
        
        // Transportation emissions
        const carMiles = parseFloat(document.getElementById('car-miles')?.value || 0);
        const vehicleType = document.getElementById('vehicle-type')?.value || 'gas';
        const flights = parseFloat(document.getElementById('flights')?.value || 0);
        const publicTransport = parseFloat(document.getElementById('public-transport')?.value || 0);

        const transportEmissions = 
            (carMiles * 365 * factors.transport[vehicleType] / 1000) + // Daily car miles to annual tons
            (flights * 2000 * factors.transport.flight / 1000) + // Average flight distance
            (publicTransport * 52 * 30 * factors.transport.publicTransport / 1000); // Weekly hours to annual tons

        // Energy emissions
        const electricity = parseFloat(document.getElementById('electricity')?.value || 900);
        const naturalGas = parseFloat(document.getElementById('natural-gas')?.value || 80);
        const homeType = document.getElementById('home-type')?.value || 'house-medium';
        const renewablePercent = parseFloat(document.getElementById('renewable-percent')?.value || 15);

        const homeMultiplier = factors.energy.homeTypeMultiplier[homeType];
        const energyEmissions = (
            (electricity * 12 * factors.energy.electricity / 1000) * (1 - renewablePercent / 100) +
            (naturalGas * 12 * factors.energy.naturalGas / 1000)
        ) * homeMultiplier;

        // Diet emissions
        const dietType = document.getElementById('diet-type')?.value || 'average';
        const dietEmissions = factors.diet[dietType];

        // Lifestyle emissions
        const shopping = document.getElementById('shopping')?.value || 'moderate';
        const wasteReduction = document.getElementById('waste-reduction')?.value || 'medium';
        
        const lifestyleEmissions = factors.lifestyle.shopping[shopping] * factors.lifestyle.wasteReduction[wasteReduction];

        // Total emissions
        const totalEmissions = transportEmissions + energyEmissions + dietEmissions + lifestyleEmissions;

        // Update UI
        document.getElementById('total-emissions').textContent = totalEmissions.toFixed(1);
        document.getElementById('user-total').textContent = totalEmissions.toFixed(1) + 't';

        // Update comparison bar
        const userBar = document.querySelector('.comparison-item .bar');
        const percentage = Math.min((totalEmissions / 16.0) * 100, 100);
        userBar.style.width = percentage + '%';

        // Store breakdown data
        this.carbonData.personal = {
            transport: transportEmissions,
            energy: energyEmissions,
            diet: dietEmissions,
            lifestyle: lifestyleEmissions,
            total: totalEmissions
        };

        // Update breakdown chart
        this.updateBreakdownChart();
        
        // Generate recommendations
        this.generateRecommendations();

        return totalEmissions;
    }

    calculateActiveFootprint() {
        const activeTab = document.querySelector('.calc-tab.active');
        if (!activeTab) return;

        switch (activeTab.id) {
            case 'personal-calc':
                return this.calculatePersonalFootprint();
            case 'household-calc':
                return this.calculateHouseholdFootprint();
            case 'business-calc':
                return this.calculateBusinessFootprint();
        }
    }

    calculateHouseholdFootprint() {
        const householdSize = parseFloat(document.getElementById('household-size')?.value || 3);
        const vehicles = parseFloat(document.getElementById('household-vehicles')?.value || 2);
        const homeSize = parseFloat(document.getElementById('home-size')?.value || 2000);

        // Simplified household calculation based on personal footprint
        const personalFootprint = this.carbonData.personal.total || 12.5;
        const householdTotal = personalFootprint * householdSize * 1.1; // 10% efficiency factor
        const perPerson = householdTotal / householdSize;

        document.getElementById('household-total-emissions').textContent = householdTotal.toFixed(1);
        document.getElementById('per-person-emissions').textContent = perPerson.toFixed(1);

        this.carbonData.household = {
            total: householdTotal,
            perPerson: perPerson,
            size: householdSize
        };

        return householdTotal;
    }

    calculateBusinessFootprint() {
        const employees = parseFloat(document.getElementById('employees')?.value || 50);
        const officeSize = parseFloat(document.getElementById('office-size')?.value || 5000);
        const businessType = document.getElementById('business-type')?.value || 'office';

        // Business emission factors (tons CO2e per employee per year)
        const businessFactors = {
            office: 5.5,
            retail: 4.2,
            manufacturing: 12.8,
            restaurant: 8.1,
            tech: 4.8
        };

        const baseFactor = businessFactors[businessType];
        const sizeFactor = Math.sqrt(officeSize / 5000); // Office size impact
        const businessTotal = employees * baseFactor * sizeFactor;
        const perEmployee = businessTotal / employees;

        document.getElementById('business-total-emissions').textContent = businessTotal.toFixed(1);
        document.getElementById('per-employee-emissions').textContent = perEmployee.toFixed(1);

        this.carbonData.business = {
            total: businessTotal,
            perEmployee: perEmployee,
            employees: employees,
            type: businessType
        };

        return businessTotal;
    }

    updateBreakdownChart() {
        const ctx = document.getElementById('emissionsBreakdownChart');
        if (!ctx || !this.carbonData.personal.total) return;

        const data = this.carbonData.personal;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Transportation', 'Home Energy', 'Diet', 'Lifestyle'],
                datasets: [{
                    data: [data.transport, data.energy, data.diet, data.lifestyle],
                    backgroundColor: ['#007AFF', '#34C759', '#FF9500', '#AF52DE'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 14 }
                        }
                    }
                }
            }
        });
    }

    generateRecommendations() {
        const data = this.carbonData.personal;
        if (!data.total) return;

        const recommendationList = document.getElementById('recommendation-list');
        if (!recommendationList) return;

        // Determine top emission categories
        const categories = [
            { name: 'transport', value: data.transport },
            { name: 'energy', value: data.energy },
            { name: 'diet', value: data.diet }
        ].sort((a, b) => b.value - a.value);

        let recommendationsHTML = '';
        
        categories.forEach((category, index) => {
            if (index < 2 && category.value > 1) { // Show top 2 categories with significant emissions
                const recs = this.recommendations[category.name];
                const topRec = recs[0]; // Get highest impact recommendation
                
                recommendationsHTML += `
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <h4>${topRec.action}</h4>
                            <span class="impact-badge">-${topRec.impact}t CO₂e</span>
                        </div>
                        <div class="rec-details">
                            <span class="cost ${topRec.cost.toLowerCase()}">${topRec.cost} Cost</span>
                            <span class="difficulty ${topRec.difficulty.toLowerCase()}">${topRec.difficulty}</span>
                        </div>
                        <div class="rec-impact">
                            <div class="impact-bar">
                                <div class="impact-fill" style="width: ${(topRec.impact / data.total) * 100}%"></div>
                            </div>
                            <span>${Math.round((topRec.impact / data.total) * 100)}% reduction</span>
                        </div>
                    </div>
                `;
            }
        });

        recommendationList.innerHTML = recommendationsHTML;
    }

    setupDataExport() {
        // Export format buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.exportClimateData(format);
            });
        });

        // Chart export buttons
        document.querySelectorAll('.chart-export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chart = e.target.dataset.chart;
                this.exportChart(chart);
            });
        });

        // Custom report generation
        document.getElementById('generate-custom-report')?.addEventListener('click', () => {
            this.generateCustomReport();
        });
    }

    async exportClimateData(format) {
        const includeTemp = document.getElementById('export-temperature')?.checked;
        const includeSeaLevel = document.getElementById('export-sealevel')?.checked;
        const includeEmissions = document.getElementById('export-emissions')?.checked;
        const includeEvents = document.getElementById('export-events')?.checked;

        const exportData = {};

        try {
            if (includeTemp) {
                exportData.temperature = await this.app.climateAPI.getTemperatureAnomalies();
            }
            if (includeSeaLevel) {
                exportData.seaLevel = await this.app.climateAPI.getSeaLevelData();
            }
            if (includeEmissions) {
                exportData.emissions = await this.app.climateAPI.getEmissionsData();
            }
            if (includeEvents) {
                exportData.extremeEvents = await this.app.climateAPI.getExtremeEventsData();
            }

            switch (format) {
                case 'csv':
                    this.downloadCSV(exportData);
                    break;
                case 'json':
                    this.downloadJSON(exportData);
                    break;
                case 'pdf':
                    this.generatePDFReport(exportData);
                    break;
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showExportError('Failed to export data');
        }
    }

    downloadCSV(data) {
        let csvContent = '';
        
        Object.keys(data).forEach(key => {
            const dataset = data[key];
            csvContent += `\n${key.toUpperCase()} DATA\n`;
            
            if (dataset.data && Array.isArray(dataset.data)) {
                // Get headers from first object
                const headers = Object.keys(dataset.data[0]);
                csvContent += headers.join(',') + '\n';
                
                // Add data rows
                dataset.data.forEach(row => {
                    csvContent += headers.map(header => row[header]).join(',') + '\n';
                });
            }
        });

        this.downloadFile(csvContent, 'climate-data.csv', 'text/csv');
    }

    downloadJSON(data) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'climate-data.json', 'application/json');
    }

    async generatePDFReport(data) {
        // Create a comprehensive PDF report
        const reportContent = this.createReportHTML(data);
        
        // For demonstration, we'll create a data URL that could be processed
        // In a real implementation, you'd use a library like jsPDF or send to a server
        console.log('PDF Report would be generated with:', reportContent);
        
        // Simulate PDF download
        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'climate-report.html';
        a.click();
        URL.revokeObjectURL(url);
    }

    createReportHTML(data) {
        const reportDate = new Date().toLocaleDateString();
        const title = document.getElementById('report-title')?.value || 'Climate Analysis Report';
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }
                    .header { text-align: center; margin-bottom: 2rem; }
                    .section { margin: 2rem 0; }
                    .data-table { width: 100%; border-collapse: collapse; }
                    .data-table th, .data-table td { padding: 0.5rem; border: 1px solid #ddd; }
                    .summary { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <p>Generated on ${reportDate}</p>
                </div>
                
                <div class="section">
                    <h2>Executive Summary</h2>
                    <div class="summary">
                        <p>This report presents climate data analysis covering temperature anomalies, 
                        sea level changes, emissions data, and extreme weather events.</p>
                    </div>
                </div>

                ${Object.keys(data).map(key => `
                    <div class="section">
                        <h2>${key.charAt(0).toUpperCase() + key.slice(1)} Data</h2>
                        <p>Source: ${data[key].source}</p>
                        <p>Last Updated: ${data[key].lastUpdated}</p>
                        <!-- Data visualization would be embedded here -->
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportChart(chartName) {
        // Get the chart canvas and export as image
        let canvas;
        
        switch (chartName) {
            case 'temperature':
                canvas = document.getElementById('temperatureChart');
                break;
            case 'sea-level':
                canvas = document.getElementById('seaLevelChart');
                break;
            case 'emissions':
                canvas = document.getElementById('emissionsChart');
                break;
            case 'heatmap':
                canvas = document.querySelector('#heatmapChart svg');
                break;
            case 'globe':
                canvas = document.querySelector('#globeContainer canvas');
                break;
            case 'projections':
                canvas = document.getElementById('tempProjectionChart');
                break;
        }

        if (canvas) {
            if (canvas.tagName === 'CANVAS') {
                // For canvas elements
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${chartName}-chart.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                });
            } else {
                // For SVG elements (D3 charts)
                this.exportSVGAsImage(canvas, `${chartName}-chart.png`);
            }
        }
    }

    exportSVGAsImage(svgElement, filename) {
        // Convert SVG to PNG
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            });
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    setupComparisonTools() {
        // Region selection
        document.querySelectorAll('.region-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateComparisonRegions();
            });
        });

        // Metric selection
        document.querySelectorAll('.metric-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.metric-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Generate comparison
        document.getElementById('generate-comparison')?.addEventListener('click', () => {
            this.generateRegionalComparison();
        });
    }

    updateComparisonRegions() {
        const selectedRegions = Array.from(document.querySelectorAll('.region-checkbox input:checked'))
            .map(checkbox => checkbox.value);
        
        this.comparisonData = selectedRegions;
    }

    generateRegionalComparison() {
        const selectedRegions = Array.from(document.querySelectorAll('.region-checkbox input:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedMetric = document.querySelector('.metric-btn.active')?.dataset.metric || 'temperature';
        
        if (selectedRegions.length < 2) {
            alert('Please select at least 2 regions to compare');
            return;
        }

        this.createComparisonChart(selectedRegions, selectedMetric);
        this.createComparisonTable(selectedRegions, selectedMetric);
    }

    createComparisonChart(regions, metric) {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) return;

        // Generate comparison data
        const datasets = regions.map((region, index) => {
            const multiplier = this.app.advancedFeatures?.locationData[region]?.tempMultiplier || 1;
            const baseData = this.generateComparisonData(metric, multiplier);
            
            const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30', '#5856D6', '#00C7BE', '#FFD60A'];
            
            return {
                label: this.getRegionDisplayName(region),
                data: baseData,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                borderWidth: 3,
                fill: false
            };
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateYearLabels(2000, 2023),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Regional ${metric.charAt(0).toUpperCase() + metric.slice(1)} Comparison`,
                        font: { size: 18, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: this.getMetricUnit(metric)
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
    }

    createComparisonTable(regions, metric) {
        const table = document.getElementById('comparisonTable');
        if (!table) return;

        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        
        // Create headers
        thead.innerHTML = `
            <tr>
                <th>Region</th>
                <th>Current Value</th>
                <th>10-Year Change</th>
                <th>Total Change</th>
                <th>Trend</th>
            </tr>
        `;

        // Create data rows
        tbody.innerHTML = regions.map(region => {
            const multiplier = this.app.advancedFeatures?.locationData[region]?.tempMultiplier || 1;
            const currentValue = this.getRegionCurrentValue(region, metric, multiplier);
            const tenYearChange = this.getRegionChange(region, metric, 10, multiplier);
            const totalChange = this.getRegionChange(region, metric, 23, multiplier);
            const trend = totalChange > 0 ? '📈 Increasing' : '📉 Decreasing';
            
            return `
                <tr>
                    <td><strong>${this.getRegionDisplayName(region)}</strong></td>
                    <td>${currentValue}</td>
                    <td>${tenYearChange}</td>
                    <td>${totalChange}</td>
                    <td>${trend}</td>
                </tr>
            `;
        }).join('');
    }

    generateComparisonData(metric, multiplier) {
        const baseValues = {
            temperature: Array.from({length: 24}, (_, i) => (0.5 + i * 0.03) * multiplier),
            'sea-level': Array.from({length: 24}, (_, i) => (20 + i * 3.2) * multiplier),
            precipitation: Array.from({length: 24}, (_, i) => 100 + (Math.sin(i * 0.3) * 10) * multiplier),
            'extreme-events': Array.from({length: 24}, (_, i) => 10 + i * 0.8 * multiplier)
        };
        
        return baseValues[metric] || baseValues.temperature;
    }

    generateYearLabels(start, end) {
        return Array.from({length: end - start + 1}, (_, i) => (start + i).toString());
    }

    getRegionDisplayName(region) {
        const names = {
            global: '🌍 Global',
            arctic: '🧊 Arctic',
            'north-america': '🍁 North America',
            europe: '🏰 Europe',
            asia: '🏯 Asia',
            africa: '🦁 Africa',
            'south-america': '🦜 South America',
            oceania: '🏄 Oceania'
        };
        return names[region] || region;
    }

    getMetricUnit(metric) {
        const units = {
            temperature: 'Temperature Anomaly (°C)',
            'sea-level': 'Sea Level Rise (mm)',
            precipitation: 'Precipitation Change (%)',
            'extreme-events': 'Number of Events'
        };
        return units[metric] || '';
    }

    getRegionCurrentValue(region, metric, multiplier) {
        const baseValues = {
            temperature: 1.1 * multiplier,
            'sea-level': 95 * multiplier,
            precipitation: 105 * multiplier,
            'extreme-events': 25 * multiplier
        };
        
        const value = baseValues[metric] || 0;
        const units = {
            temperature: '°C',
            'sea-level': 'mm',
            precipitation: '%',
            'extreme-events': ' events'
        };
        
        return value.toFixed(1) + units[metric];
    }

    getRegionChange(region, metric, years, multiplier) {
        const changeRates = {
            temperature: 0.03 * years * multiplier,
            'sea-level': 3.2 * years * multiplier,
            precipitation: 2.1 * years * multiplier,
            'extreme-events': 0.8 * years * multiplier
        };
        
        const change = changeRates[metric] || 0;
        const sign = change >= 0 ? '+' : '';
        const units = {
            temperature: '°C',
            'sea-level': 'mm',
            precipitation: '%',
            'extreme-events': ' events'
        };
        
        return sign + change.toFixed(1) + units[metric];
    }

    setupImpactAssessment() {
        // Wizard navigation
        document.getElementById('next-step')?.addEventListener('click', () => {
            this.nextAssessmentStep();
        });

        document.getElementById('prev-step')?.addEventListener('click', () => {
            this.prevAssessmentStep();
        });

        // Location detection
        document.getElementById('use-current-location')?.addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Scenario selection
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        this.assessmentStep = 1;
    }

    nextAssessmentStep() {
        if (this.assessmentStep < 4) {
            this.assessmentStep++;
            this.updateAssessmentStep();
            
            if (this.assessmentStep === 4) {
                this.runImpactAssessment();
            }
        }
    }

    prevAssessmentStep() {
        if (this.assessmentStep > 1) {
            this.assessmentStep--;
            this.updateAssessmentStep();
        }
    }

    updateAssessmentStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.assessmentStep);
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.assessmentStep);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        
        prevBtn.disabled = this.assessmentStep === 1;
        nextBtn.textContent = this.assessmentStep === 4 ? 'Restart Assessment' : 'Next';
        
        if (this.assessmentStep === 4 && nextBtn.textContent === 'Restart Assessment') {
            nextBtn.onclick = () => {
                this.assessmentStep = 1;
                this.updateAssessmentStep();
            };
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    document.getElementById('assessment-location').value = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location. Please enter it manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    runImpactAssessment() {
        const location = document.getElementById('assessment-location')?.value;
        const timeframe = document.querySelector('input[name="timeframe"]:checked')?.value;
        const scenario = document.querySelector('.scenario-card.selected')?.dataset.scenario;

        if (!location || !timeframe || !scenario) {
            alert('Please complete all assessment steps');
            return;
        }

        // Calculate impact score based on inputs
        const impactScore = this.calculateImpactScore(location, timeframe, scenario);
        
        // Update results display
        this.displayImpactResults(impactScore, timeframe, scenario);
    }

    calculateImpactScore(location, timeframe, scenario) {
        // Simplified impact calculation
        const timeframeFactor = {
            '2030': 0.3,
            '2050': 0.7,
            '2100': 1.0
        };

        const scenarioFactor = {
            'rcp26': 0.4,
            'rcp45': 0.7,
            'rcp85': 1.0
        };

        const baseFactor = timeframeFactor[timeframe] * scenarioFactor[scenario];
        const locationFactor = this.getLocationImpactFactor(location);
        
        return Math.min(baseFactor * locationFactor * 10, 10);
    }

    getLocationImpactFactor(location) {
        // Simplified location-based impact factors
        if (location.includes('Florida') || location.includes('Miami')) return 1.5;
        if (location.includes('California') || location.includes('Los Angeles')) return 1.3;
        if (location.includes('New York')) return 1.2;
        if (location.includes('Arctic') || location.includes('Alaska')) return 2.0;
        return 1.0; // Default
    }

    displayImpactResults(score, timeframe, scenario) {
        document.getElementById('impact-score').textContent = score.toFixed(1);
        
        // Update impact details based on scenario
        const impacts = this.calculateSpecificImpacts(score, timeframe, scenario);
        
        document.querySelector('.impact-item:nth-child(1) .impact-value').textContent = `+${impacts.temperature}°C`;
        document.querySelector('.impact-item:nth-child(2) .impact-value').textContent = `+${impacts.seaLevel}cm`;
        document.querySelector('.impact-item:nth-child(3) .impact-value').textContent = `+${impacts.precipitation}%`;
        document.querySelector('.impact-item:nth-child(4) .impact-value').textContent = `+${impacts.extremeEvents}%`;

        // Generate adaptation recommendations
        this.generateAdaptationRecommendations(score, impacts);
        
        // Create impact meter visualization
        this.createImpactMeter(score);
    }

    calculateSpecificImpacts(score, timeframe, scenario) {
        const baseFactor = score / 10;
        
        return {
            temperature: (baseFactor * 4.5).toFixed(1),
            seaLevel: Math.round(baseFactor * 80),
            precipitation: Math.round(baseFactor * 25),
            extremeEvents: Math.round(baseFactor * 75)
        };
    }

    generateAdaptationRecommendations(score, impacts) {
        const adaptationList = document.getElementById('adaptation-list');
        if (!adaptationList) return;

        const recommendations = [];
        
        if (parseFloat(impacts.temperature) > 2) {
            recommendations.push('Install efficient cooling systems and improve building insulation');
        }
        
        if (parseInt(impacts.seaLevel) > 30) {
            recommendations.push('Consider flood barriers and elevated infrastructure');
        }
        
        if (parseInt(impacts.precipitation) > 15) {
            recommendations.push('Implement water management and drought-resistant landscaping');
        }
        
        if (parseInt(impacts.extremeEvents) > 50) {
            recommendations.push('Develop emergency preparedness plans and resilient infrastructure');
        }

        if (score > 7) {
            recommendations.push('Consider relocation to less vulnerable areas');
            recommendations.push('Invest in renewable energy and sustainable transportation');
        }

        adaptationList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
    }

    createImpactMeter(score) {
        const canvas = document.getElementById('impactMeter');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;

        const centerX = 100;
        const centerY = 100;
        const radius = 80;

        // Clear canvas
        ctx.clearRect(0, 0, 200, 200);

        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 20;
        ctx.stroke();

        // Draw score arc
        const scoreAngle = (score / 10) * 2 * Math.PI;
        const color = score < 3 ? '#34C759' : score < 7 ? '#FF9500' : '#FF3B30';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    exportCalculation() {
        const activeTab = document.querySelector('.calc-tab.active');
        if (!activeTab) return;

        const data = {
            type: activeTab.id.replace('-calc', ''),
            timestamp: new Date().toISOString(),
            data: this.carbonData
        };

        this.downloadJSON(data);
    }

    saveCalculation() {
        const activeTab = document.querySelector('.calc-tab.active');
        if (!activeTab) return;

        // Save to localStorage
        const calculations = JSON.parse(localStorage.getItem('climateCalculations') || '[]');
        calculations.push({
            id: Date.now(),
            type: activeTab.id.replace('-calc', ''),
            timestamp: new Date().toISOString(),
            data: this.carbonData
        });

        localStorage.setItem('climateCalculations', JSON.stringify(calculations));
        
        // Show success message
        this.showSaveSuccess();
    }

    shareCalculationResults() {
        const data = this.carbonData.personal;
        if (!data.total) return;

        const text = `I just calculated my carbon footprint: ${data.total.toFixed(1)} tons CO₂e/year. Check out this climate visualization tool!`;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'My Carbon Footprint',
                text: text,
                url: url
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    showSaveSuccess() {
        // Create a temporary success message
        const message = document.createElement('div');
        message.textContent = '✅ Calculation saved successfully!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #34C759;
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    showExportError(errorMessage) {
        const message = document.createElement('div');
        message.textContent = `❌ ${errorMessage}`;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FF3B30;
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 1000;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }

    destroy() {
        // Cleanup event listeners and stored data
        this.carbonData = { personal: {}, household: {}, business: {} };
        this.comparisonData = [];
    }
}

// Export for use in main app
window.ClimateUserTools = ClimateUserTools;