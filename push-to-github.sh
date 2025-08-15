#!/bin/bash

echo "🚀 Pushing Climate Change Visualizer to GitHub Global-Warming repository..."
echo "================================================"

# Navigate to project directory
cd "/Users/connormurphy/Desktop/Climate Change"

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Configure git (optional - update with your info)
# git config user.name "Connor Murphy"
# git config user.email "your-email@example.com"

# Add all files to staging
echo "📝 Adding all files to git..."
git add .

# Check status
echo "📊 Git status:"
git status --short

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: Complete Climate Change Impact Visualizer with Phases 1-6

Implements comprehensive climate data visualization platform with real-time data integration

Features:
- Real-time climate data from NASA GISS, NOAA CDO, and Climate TRACE APIs
- Interactive visualizations using Chart.js, D3.js, Three.js, and Leaflet.js
- 3D Earth globe with multiple climate data layers and orbit controls
- Carbon footprint calculator with personal, household, and business modes
- Data export functionality (PDF reports, CSV, JSON, PNG formats)
- Regional climate comparison tools with side-by-side analysis
- 4-step climate impact assessment wizard with personalized recommendations
- Apple-inspired design with glassmorphism UI and SF Pro Display typography
- Responsive design optimized for mobile, tablet, and desktop
- 24-hour API response caching for improved performance
- Comprehensive error handling with fallback data systems

Technical Implementation:
- Modular JavaScript architecture with separate feature modules
- 6000+ lines of production-ready code
- CSS Grid and Flexbox for responsive layouts
- Advanced animations with cubic-bezier transitions
- Rate-limited API calls with intelligent caching
- Location-based climate projections with regional multipliers

Phases Completed:
✅ Phase 1: Real data integration with NASA, NOAA, Climate TRACE
✅ Phase 2-3: Interactive timeline, 3D globe, heatmaps, projections
✅ Phase 4-6: User tools, carbon calculator, data export, comparisons

Files:
- index.html: Main application structure with all sections
- styles.css: Complete Apple-esque design system (3000+ lines)
- app.js: Core application logic and navigation
- climate-api.js: API integration module with caching
- advanced-features.js: Timeline, 3D globe, projections (2000+ lines)
- user-tools.js: Carbon calculator, export, comparison tools (2000+ lines)
- README.md: Comprehensive project documentation
- CLAUDE.md: Local development instructions
- .gitignore: Git configuration

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Check if remote already exists
echo "🔗 Checking for existing remotes..."
if git remote | grep -q 'origin'; then
    echo "   Removing existing origin remote..."
    git remote remove origin
fi

# Add GitHub remote repository
echo "🌐 Adding GitHub remote repository..."
git remote add origin https://github.com/cmurphy1140/Global-Warming.git

# Verify remote was added
echo "   Remote URL: $(git remote get-url origin)"

# Set main branch
echo "🌳 Setting main branch..."
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo "   This may ask for your GitHub credentials or Personal Access Token"
git push -u origin main

# Check result
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your Climate Change Visualizer has been pushed to GitHub!"
    echo "🔗 View your repository at: https://github.com/cmurphy1140/Global-Warming"
    echo ""
    echo "Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Consider adding a GitHub Pages deployment for live demo"
    echo "3. Add a LICENSE file if needed"
    echo "4. Set up GitHub Actions for automated testing"
else
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo "1. Make sure the repository exists on GitHub"
    echo "2. Check your GitHub authentication:"
    echo "   - Use a Personal Access Token (PAT) instead of password"
    echo "   - Create PAT at: https://github.com/settings/tokens"
    echo "3. Try GitHub CLI authentication: gh auth login"
    echo "4. Check if you have push permissions to the repository"
fi