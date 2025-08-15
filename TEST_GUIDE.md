# E2E Test Suite Guide

## Quick Start

### Browser Tests
1. Open `test-runner.html` in browser
2. Click "Run All Tests" to execute suite
3. View results in real-time

### Command Line Tests
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with UI
npm run test:headed

# Debug mode
npm run test:debug
```

## Test Coverage

### Core Features (20 tests)
- **Navigation** (NAV-01, NAV-02): Tab switching, active states
- **Data Loading** (DATA-01, DATA-02): API calls, fallback handling
- **Time Controls** (TIME-01, TIME-02): Year range, location filters
- **3D Globe** (GLOBE-01, GLOBE-02): Rendering, controls
- **Calculator** (CALC-01, CALC-02): Carbon calculations, validation
- **Export** (EXPORT-01, EXPORT-02): CSV/PNG downloads
- **Comparison** (COMPARE-01): Region comparisons
- **Mobile** (MOBILE-01, MOBILE-02): Responsive, touch
- **Performance** (PERF-01, PERF-02): Load time, transitions
- **Accessibility** (A11Y-01, A11Y-02): Keyboard, screen readers
- **Errors** (ERROR-01, ERROR-02): Network, data handling

## Test Execution

### Manual Testing
1. Start server: `python3 -m http.server 8000`
2. Open http://localhost:8000
3. Follow test steps in `e2e-tests.js`

### Automated Testing
1. Playwright runs real browser instances
2. Tests execute in parallel
3. Screenshots on failure
4. HTML report generated

## Success Criteria
- All navigation paths work
- Data loads within 3 seconds
- No console errors
- Mobile responsive
- Keyboard accessible

## Test Files
- `e2e-tests.js` - Test definitions
- `playwright.spec.js` - Automated tests
- `test-runner.html` - Visual runner
- `playwright.config.js` - Test config