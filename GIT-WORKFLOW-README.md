# 🚀 Climate Change Visualizer - Automated Git Workflow

## Overview
This project uses an automated multi-agent Git workflow where different specialized agents handle specific aspects of development in parallel. Each agent works on its own branch and changes are automatically integrated through a sophisticated merge strategy.

## 🤖 Agent System

### Available Agents

| Agent | Branch | Responsibility | Schedule |
|-------|--------|---------------|----------|
| **UI Polish** | `agent/ui-polish` | Animations, glassmorphism, responsive design | Every 4 hours |
| **Data Integration** | `agent/data-integration` | API connections, data sources, caching | Every 4 hours |
| **Performance** | `agent/performance` | Bundle optimization, lazy loading, caching | Every 4 hours |
| **Accessibility** | `agent/accessibility` | ARIA labels, keyboard nav, screen readers | Every 4 hours |
| **Testing** | `agent/testing` | Test coverage, E2E tests, unit tests | Every 4 hours |
| **Documentation** | `agent/documentation` | API docs, code comments, guides | Every 4 hours |
| **PWA** | `agent/pwa` | Service worker, offline mode, installable | Every 4 hours |
| **Analytics** | `agent/analytics` | Usage tracking, performance metrics | Every 4 hours |

## 📊 Branch Strategy

```
main (production)
  ├── staging (pre-production)
  │     └── develop (integration)
  │           ├── agent/ui-polish
  │           ├── agent/data-integration
  │           ├── agent/performance
  │           ├── agent/accessibility
  │           ├── agent/testing
  │           ├── agent/documentation
  │           ├── agent/pwa
  │           └── agent/analytics
```

### Merge Flow
1. **Agent → Develop**: Daily at 2 AM (automated)
2. **Develop → Staging**: Weekly on Mondays (requires approval)
3. **Staging → Main**: Bi-weekly (requires 2 reviewers)

## 🛠️ Quick Start

### Run the Interactive Workflow
```bash
./agent-workflow.sh
```

This provides a menu-driven interface to:
- Run all agents
- Run specific agents
- Merge to develop
- Run quality checks
- Promote to staging
- View status
- Clean up branches

### Run All Agents in Parallel
```bash
./.git-workflow/agent-scripts/run-all-agents.sh
```

### Manual Agent Execution
```bash
# Switch to agent branch
git checkout agent/ui-polish

# Make improvements
# ... edit files ...

# Commit changes
git add .
git commit -m "feat(ui): improved animations"
git push origin agent/ui-polish
```

## 🔄 Automation Features

### Git Hooks
- **Pre-commit**: Validates code quality, checks for console.logs, API keys
- **Post-merge**: Triggers next workflow steps, generates release notes

### GitHub Actions
- **CI/CD Pipeline**: Runs on all pushes and PRs
- **Agent Automation**: Scheduled agent runs every 4 hours
- **Quality Gates**: Enforces code standards before merge

### Quality Gates
✅ Required for merge:
- No ESLint errors
- Bundle size < 500KB
- No exposed API keys
- No console.log statements
- Tests passing
- Lighthouse score > 85

## 📈 Workflow Status

### Check Branch Status
```bash
git branch -a
```

### View Recent Activity
```bash
git log --all --oneline --graph -20
```

### Check Merge Status
```bash
git log develop..agent/ui-polish --oneline
```

## 🚦 Quality Metrics

### Performance Budget
- JavaScript: < 1MB total
- CSS: < 512KB total
- Images: Optimized and lazy-loaded
- Initial load: < 3 seconds

### Test Coverage Requirements
- Agent branches: 70%
- Develop: 80%
- Staging: 85%
- Main: 90%

## 🔐 Branch Protection

### Main Branch
- Requires 2 PR reviews
- Must pass all CI/CD checks
- No direct pushes
- No force pushes
- Automated security scanning

### Develop Branch
- Requires 1 PR review
- Must pass quality checks
- Auto-merge from agents enabled

## 📝 Commit Message Format

```
type(scope): description

[optional body]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## 🎯 Common Tasks

### Emergency Hotfix
```bash
git checkout -b hotfix/critical-fix main
# Make fixes
git commit -m "fix: critical issue resolved"
git push origin hotfix/critical-fix
# Create PR to main
```

### Feature Development
```bash
git checkout agent/ui-polish
# Make changes
git commit -m "feat(ui): new feature"
git push origin agent/ui-polish
# Wait for auto-merge to develop
```

### Conflict Resolution
```bash
git checkout develop
git merge origin/agent/ui-polish
# Resolve conflicts
git add .
git commit -m "merge: resolved conflicts from ui-polish"
git push origin develop
```

## 📊 Monitoring

### View Metrics
```bash
cat .git/metrics.json
```

### Check Logs
```bash
tail -f .git-workflow/agent-log.txt
```

### Review Release Notes
```bash
cat .git/release-notes-draft.md
```

## 🚀 Deployment

### Deploy to Staging
```bash
git checkout staging
git merge develop --no-ff
git push origin staging
```

### Deploy to Production
```bash
git checkout main
git merge staging --no-ff
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

## 🔧 Troubleshooting

### Reset Agent Branch
```bash
git checkout agent/ui-polish
git reset --hard origin/main
git push --force origin agent/ui-polish
```

### Fix Merge Conflicts
```bash
git checkout develop
git pull origin develop
git merge origin/agent/ui-polish --strategy-option=theirs
```

### Clean Up Old Branches
```bash
git branch --merged | grep -v "\*\|main\|develop\|staging" | xargs -n 1 git branch -d
```

## 📚 Additional Resources

- [Branch Strategy Documentation](.git-workflow/branch-strategy.md)
- [GitHub Actions Workflows](.github/workflows/)
- [Git Hooks](.git/hooks/)
- [Agent Scripts](.git-workflow/agent-scripts/)

## 🤝 Contributing

1. Choose an agent branch based on your contribution type
2. Make changes and test locally
3. Push to the agent branch
4. Changes will be automatically integrated

## 📞 Support

For issues with the workflow:
1. Check the agent logs: `.git-workflow/agent-log.txt`
2. Review GitHub Actions runs
3. Verify branch protection settings
4. Check quality gate status

---

*This automated workflow ensures consistent code quality, parallel development, and smooth integration of features into the Climate Change Impact Visualizer.*