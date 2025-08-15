# Climate Change Impact Visualizer - Project Instructions

## Project Overview
This is an interactive web application that visualizes climate change impacts using real-time data from NASA, NOAA, and Climate TRACE APIs. The project implements a comprehensive climate data platform with Apple-esque design principles.

## Project Structure
```
Climate Change/
├── index.html              # Main HTML with all visualization sections
├── styles.css              # Apple-esque design system (3000+ lines)
├── app.js                  # Core application logic and navigation
├── climate-api.js          # API integration for NASA, NOAA, Climate TRACE
├── advanced-features.js    # Phase 2-3: Timeline, 3D globe, projections
├── user-tools.js           # Phase 4-6: Carbon calculator, export, comparison
└── README.md              # Complete project documentation
```

## Key Features Implemented
1. **Real-time Climate Data**: NASA GISS, NOAA, Climate TRACE integration
2. **Interactive Visualizations**: Chart.js, D3.js, Three.js, Leaflet.js
3. **3D Globe**: Interactive Earth with climate data layers
4. **Carbon Calculator**: Personal/household/business footprint calculation
5. **Data Export**: PDF reports, CSV, JSON, PNG exports
6. **Regional Comparison**: Side-by-side climate analysis
7. **Impact Assessment**: 4-step guided climate impact wizard
8. **Apple Design**: Glassmorphism, SF Pro Display, iOS color palette

## Development Guidelines

### Code Style
- Use modular JavaScript classes for feature organization
- Maintain Apple-esque design consistency
- Implement proper error handling with fallback data
- Use async/await for API calls
- Cache API responses for 24 hours

### API Integration
- **NASA GISS**: Temperature anomalies (GISTEMP v4)
- **NOAA CDO**: Sea level and extreme weather data
- **Climate TRACE**: Country-level emissions data
- Always implement fallback data for offline/error states

### Design Principles
- **Typography**: SF Pro Display, -apple-system fallbacks
- **Colors**: iOS system colors, dark theme with gradients
- **Effects**: Glassmorphism with backdrop-filter: blur(20px)
- **Animations**: Smooth cubic-bezier transitions
- **Border Radius**: Consistent 12-16px rounded corners

### Testing Approach
1. Test all navigation between sections
2. Verify API data loading with fallbacks
3. Check responsive design on mobile/tablet/desktop
4. Test all calculator inputs and validations
5. Verify export functionality for all formats

## Common Commands

### Local Development
```bash
# Start local server (Python)
python3 -m http.server 8000

# Start local server (Node.js)
npx http-server -p 8000

# Open in browser
open http://localhost:8000
```

### Git Workflow
```bash
# Check status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement Phase 4-6 user tools with carbon calculator"

# View commit history
git log --oneline
```

## Next Development Phases

### Phase 7: PWA Features
- Service worker for offline functionality
- App manifest for installation
- Background sync for data updates
- Push notifications for climate alerts

### Phase 8: Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader optimization
- High contrast mode

### Phase 9: Social Features
- Share climate insights on social media
- Collaborative impact tracking
- Community challenges
- Educational content integration

## Performance Considerations
- Lazy load chart libraries
- Implement virtual scrolling for large datasets
- Use requestAnimationFrame for animations
- Optimize Three.js rendering with LOD
- Minimize API calls with intelligent caching

## Security Notes
- Never commit API keys (use .env files)
- Validate all user inputs
- Sanitize data before display
- Use HTTPS for production deployment
- Implement rate limiting for API calls

## Debugging Tips
- Check browser console for API errors
- Use Network tab to monitor API calls
- Verify CORS headers for external APIs
- Test with throttled network speeds
- Use Chrome DevTools Performance profiler

## Resources
- [NASA Climate Data](https://climate.nasa.gov/vital-signs/)
- [NOAA Climate.gov](https://www.climate.gov/)
- [IPCC Reports](https://www.ipcc.ch/)
- [Chart.js Docs](https://www.chartjs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

## Contact & Support
For questions about this project:
- Review the README.md for feature documentation
- Check browser console for error messages
- Ensure all script files are loaded properly
- Verify API endpoints are accessible

---
*This project demonstrates advanced web development with real climate data integration and professional UI/UX design.*