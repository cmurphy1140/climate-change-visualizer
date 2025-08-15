# Git Branch Strategy for Climate Change Impact Visualizer

## Branch Structure

### Main Branches
- `main` - Production-ready code (protected)
- `develop` - Integration branch for features
- `staging` - Pre-production testing

### Feature Branches (Agent-Specific)
- `agent/ui-polish` - UI/UX improvements and animations
- `agent/data-integration` - API and data source enhancements
- `agent/performance` - Performance optimization and caching
- `agent/accessibility` - A11y improvements and ARIA support
- `agent/testing` - Test coverage and quality assurance
- `agent/documentation` - Documentation and code comments
- `agent/pwa` - Progressive Web App features
- `agent/analytics` - Analytics and monitoring

### Support Branches
- `hotfix/*` - Emergency production fixes
- `release/*` - Release preparation branches
- `experiment/*` - Experimental features

## Workflow Rules

### Branch Protection
1. **main**
   - Requires PR reviews (2 reviewers)
   - Must pass all CI/CD checks
   - No direct pushes
   - Requires up-to-date branch

2. **develop**
   - Requires PR reviews (1 reviewer)
   - Must pass linting and tests
   - Auto-merge from agent branches

### Naming Conventions
- Feature: `agent/[agent-name]/[feature-description]`
- Hotfix: `hotfix/[issue-number]-[description]`
- Release: `release/[version-number]`

### Commit Message Format
```
type(scope): description

[optional body]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: feat, fix, docs, style, refactor, perf, test, chore

## Agent Responsibilities

### UI Polish Agent (`agent/ui-polish`)
- Enhance animations and transitions
- Improve responsive design
- Optimize glassmorphism effects
- Refine color schemes and gradients

### Data Integration Agent (`agent/data-integration`)
- Add new climate data sources
- Improve API error handling
- Implement data caching strategies
- Add real-time data streaming

### Performance Agent (`agent/performance`)
- Optimize bundle sizes
- Implement code splitting
- Add service workers
- Improve rendering performance

### Accessibility Agent (`agent/accessibility`)
- Add ARIA labels and roles
- Implement keyboard navigation
- Ensure screen reader compatibility
- Add high contrast mode

### Testing Agent (`agent/testing`)
- Increase test coverage
- Add E2E tests
- Implement visual regression tests
- Performance benchmarking

### Documentation Agent (`agent/documentation`)
- Update API documentation
- Add inline code comments
- Create user guides
- Maintain changelog

### PWA Agent (`agent/pwa`)
- Implement service worker
- Add app manifest
- Enable offline functionality
- Push notifications

### Analytics Agent (`agent/analytics`)
- Add user analytics
- Track performance metrics
- Implement error logging
- Create dashboards

## Automation Scripts

### Auto-merge Strategy
Branches merge automatically in this order:
1. Agent branches → `develop` (daily)
2. `develop` → `staging` (weekly)
3. `staging` → `main` (bi-weekly after approval)

### Quality Gates
- Code coverage > 80%
- No console errors
- Lighthouse score > 90
- Bundle size < 500KB
- All tests passing

## Conflict Resolution
1. Agent branches rebase from develop daily
2. Conflicts resolved by agent owner
3. Integration conflicts handled in develop
4. Production hotfixes cherry-picked back