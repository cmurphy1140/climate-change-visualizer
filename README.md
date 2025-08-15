# Climate Change Impact Visualizer

An interactive web application that visualizes the impacts of climate change through real-time data from NASA, NOAA, and Climate TRACE APIs.

## Phase 1: Data Integration ✅

### Features Implemented
- **Real Climate Data Integration**: Fetches data from NASA GISS, NOAA, and Climate TRACE
- **Interactive Temperature Charts**: Global temperature anomalies with NASA GISS data
- **Sea Level Visualization**: Rise projections with vulnerable coastal cities map
- **Emissions Tracking**: CO₂ emissions by country with animated D3.js charts
- **Extreme Weather Events**: Hurricane, flood, and drought trend analysis
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Loading States**: Professional loading animations during data fetch
- **Data Caching**: 24-hour cache system for improved performance
- **Responsive Design**: Mobile-friendly with glassmorphism UI

### Technical Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Visualization**: Chart.js, D3.js, Leaflet.js
- **Data Sources**: NASA GISS GISTEMP, NOAA CDO API, Climate TRACE
- **Styling**: CSS Grid, Flexbox, CSS animations

### File Structure
```
Climate Change/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js             # Main application logic
├── climate-api.js     # API integration module
└── README.md          # Project documentation
```

### API Integration
- **NASA GISS**: Temperature anomaly data (GISTEMP v4)
- **NOAA**: Climate data and sea level measurements
- **Climate TRACE**: Real-time emissions data by country
- **Fallback System**: Sample data when APIs are unavailable

### Performance Features
- **Rate Limiting**: 200ms delays between API requests
- **Caching**: 24-hour data cache with timestamps
- **Error Recovery**: Automatic fallback to sample data
- **Lazy Loading**: Charts load only when sections are active

## Usage
1. Open `index.html` in a web browser
2. Navigate between sections using the top navigation
3. Interact with charts and maps for detailed climate data
4. View real-time data sources and timestamps

## Data Sources
- **NASA GISS**: Global temperature anomalies relative to 1951-1980 mean
- **NOAA**: Sea level rise and extreme weather event data
- **Climate TRACE**: Country-level CO₂ emissions tracking
- **OpenStreetMap**: Base map tiles for geographic visualization

## Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## Phase 2-3: Interactive Features & Advanced Visualizations ✅

### New Features Implemented
- **Interactive Timeline Controls**: Dual-range sliders for filtering historical data (1880-2023)
- **Location-Based Projections**: Regional climate data with 8 geographic regions
- **3D Globe Visualization**: Interactive Earth with climate data layers using Three.js
- **Animated Temperature Heatmap**: Year-by-year temperature anomaly visualization
- **Future Climate Projections**: IPCC scenario modeling (RCP 2.6, 4.5, 6.0, 8.5)
- **Advanced Settings Panel**: User preferences with Apple-esque design
- **Regional Climate Multipliers**: Location-specific temperature and sea level adjustments
- **Chart Filtering**: Timeline and location filters applied to all visualizations

### Apple-esque Design System
- **Typography**: SF Pro Display font family with precise letter spacing
- **Color Palette**: iOS-inspired gradients and system colors
- **Glassmorphism**: Backdrop blur effects with translucent panels
- **Smooth Animations**: Cubic-bezier transitions and micro-interactions
- **Rounded Corners**: Consistent 12-16px border radius
- **Interactive Elements**: Hover states with elevation and glow effects

### Technical Enhancements
- **Three.js Integration**: 3D Earth globe with orbit controls and atmospheric effects
- **D3.js Heatmaps**: Interactive temperature matrix visualization
- **Chart.js Extensions**: Timeline adapters and advanced chart interactions
- **Modular Architecture**: Separated advanced features into dedicated module
- **Real-time Filtering**: Dynamic data processing with location multipliers

### File Structure
```
Climate Change/
├── index.html              # Enhanced with new sections and controls
├── styles.css              # Apple-esque design system
├── app.js                  # Core application with advanced integration
├── climate-api.js          # API integration module
├── advanced-features.js    # Phase 2-3 interactive features
└── README.md              # Updated documentation
```

## Phase 4-6: User Tools & Engagement Features ✅

### New Features Implemented
- **🌱 Carbon Footprint Calculator**: Personal, household, and business carbon calculations with recommendations
- **📊 Data Export Tools**: PDF reports, CSV downloads, chart images, and JSON data exports
- **⚖️ Regional Comparison**: Side-by-side climate analysis with interactive charts
- **🎯 Impact Assessment Wizard**: 4-step guided climate impact evaluation
- **Advanced Calculations**: Comprehensive emission factors database for accurate footprint calculations
- **Dynamic Recommendations**: Personalized suggestions based on user input and regional data
- **Professional Reporting**: Branded PDF exports with charts, insights, and action plans

### Technical Implementation
- **Modular Architecture**: Dedicated `ClimateUserTools` class with 2000+ lines of functionality
- **Real-time Calculations**: Dynamic carbon footprint computation with emission factors
- **Chart Integration**: Chart.js integration for comparison visualizations
- **PDF Generation**: Client-side PDF creation with jsPDF library
- **Data Processing**: Advanced filtering and aggregation for regional comparisons
- **User Experience**: Apple-esque design consistency across all new tools

### File Structure
```
Climate Change/
├── index.html              # Enhanced with Phase 4-6 sections
├── styles.css              # Complete Apple design system
├── app.js                  # Core application with full integration
├── climate-api.js          # API integration module
├── advanced-features.js    # Phase 2-3 interactive features
├── user-tools.js           # Phase 4-6 user tools and engagement
└── README.md              # Complete documentation
```

## Next Phases
- **Phase 7**: PWA features and offline capabilities
- **Phase 8**: Accessibility enhancements and ARIA support
- **Phase 9**: Social sharing and educational content

---
*Built with Claude Code for climate awareness and education*