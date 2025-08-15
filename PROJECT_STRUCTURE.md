# Climate Change Impact Visualizer - Project Structure

## Directory Layout

```
Climate Change/
│
├── src/                        # Source code
│   ├── css/                    # Stylesheets
│   │   ├── styles.css          # Main application styles
│   │   └── ui-modern.css       # Modern UI redesign styles
│   │
│   └── js/                     # JavaScript modules
│       ├── app.js              # Main application logic
│       ├── climate-api.js      # API integrations (NASA, NOAA, Climate TRACE)
│       ├── advanced-features.js # 3D globe, projections, timeline
│       ├── user-tools.js       # Carbon calculator, export, comparison
│       └── ui-modern.js        # Modern UI controller
│
├── docs/                       # Documentation
│   ├── GIT-WORKFLOW-README.md  # Git workflow documentation
│   └── TEST_GUIDE.md           # Testing documentation
│
├── scripts/                    # Build and automation scripts
│   ├── agent-workflow.sh       # Multi-agent development workflow
│   ├── git-push-commands.sh   # Git automation
│   └── push-to-github.sh      # GitHub deployment
│
├── tests/                      # Test files
│   ├── e2e-navigation.spec.js # Navigation E2E tests
│   ├── e2e-tests.js           # End-to-end tests
│   ├── playwright.config.js   # Playwright configuration
│   ├── playwright.spec.js     # Playwright test specs
│   ├── test-handlers.js       # Test utilities
│   └── test-runner.html       # Browser test runner
│
├── .github/                    # GitHub configuration
│   └── workflows/              # GitHub Actions
│       ├── agent-automation.yml
│       ├── ci-cd.yml
│       └── quality-gates.yml
│
├── .git-workflow/              # Git workflow files
│   ├── agent-scripts/          # Agent automation scripts
│   └── branch-strategy.md     # Branch strategy documentation
│
├── index.html                  # Main application (classic UI)
├── index-modern.html           # Modern UI version
├── package.json                # Node.js dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## File Organization Guidelines

### Source Code (`src/`)
- **css/**: All stylesheets organized by feature
- **js/**: JavaScript modules with clear separation of concerns

### Documentation (`docs/`)
- Technical documentation and guides
- Keep user-facing docs in README.md

### Scripts (`scripts/`)
- Automation and build scripts
- Deployment utilities

### Tests (`tests/`)
- All test files grouped together
- Separate E2E, unit, and integration tests

## Color Contrast Standards

### Dark Theme (Default)
- Background: `#000000` to `#1E2126`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255, 255, 255, 0.6)`
- Ensures WCAG AAA compliance

### Light Theme
- Background: `#FFFFFF`
- Text Primary: `#000000`
- Text Secondary: `rgba(0, 0, 0, 0.6)`
- Proper contrast for readability

## Key Features
- ✅ Clean, organized file structure
- ✅ Proper separation of concerns
- ✅ Consistent naming conventions
- ✅ Accessible color contrast
- ✅ Modular architecture