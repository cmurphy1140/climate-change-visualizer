#!/bin/bash

# Git Commands to Push Climate Change Project to GitHub
# Run these commands in your terminal

# Navigate to the project directory
cd "/Users/connormurphy/Desktop/Climate Change"

# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "feat: Complete Climate Change Impact Visualizer with Phases 1-6

- Real-time climate data from NASA, NOAA, Climate TRACE APIs
- Interactive visualizations with Chart.js, D3.js, Three.js
- 3D Earth globe with climate data layers
- Carbon footprint calculator (personal/household/business)
- Data export tools (PDF, CSV, JSON, PNG)
- Regional climate comparison tools
- Climate impact assessment wizard
- Apple-esque design with glassmorphism UI
- Comprehensive error handling and data caching

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Add remote repository (use the correct URL)
# Option 1: If your repo is named "new-repo"
git remote add origin https://github.com/cmurphy1140/new-repo.git

# Option 2: If your repo has a different name, replace "new-repo" with the actual name
# git remote add origin https://github.com/cmurphy1140/YOUR_REPO_NAME.git

# Set the main branch
git branch -M main

# Push to remote repository
git push -u origin main

# If you get an error about the repository not existing, you may need to:
# 1. Create the repository on GitHub first at https://github.com/new
# 2. Make sure the repository name matches what you're using in the remote URL

echo "✅ Git push complete!"