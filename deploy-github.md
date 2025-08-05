# GitHub Pages Deployment Guide

## Quick Fix for Current Deployment

Your CSS and JavaScript files aren't loading because they use absolute paths (`/assets/`) instead of relative paths (`./assets/`). 

### Option 1: Manual Fix (Immediate)
1. Download your `dist/public/index.html` file
2. Edit it to change:
   - `href="/assets/` to `href="./assets/`
   - `src="/assets/` to `src="./assets/`
   - `href="/favicon.svg"` to `href="./favicon.svg"`
3. Re-upload the fixed file

### Option 2: Automated Deployment (Recommended)
I've created a GitHub Actions workflow that will:
1. Build your project automatically
2. Fix the asset paths 
3. Deploy to GitHub Pages

To use this:
1. Copy the `.github/workflows/deploy.yml` file to your repository
2. Push to your main branch
3. Enable GitHub Pages in your repository settings
4. Set source to "GitHub Actions"

## Current Build Files
Your built application is in the `dist/public/` folder with these files:
- `index.html` (now fixed with relative paths + SPA routing)
- `404.html` (handles client-side routing for GitHub Pages)
- `assets/index-DFqie_9T.css` (your styles)
- `assets/index-DP6YX9vQ.js` (your app)
- `favicon.svg` (your icon)

## GitHub Pages SPA Routing Fix
I've added proper Single Page Application (SPA) routing support:
- Created a `404.html` file that redirects to the main app
- Added redirect handling script to `index.html`
- This ensures all routes (like `/product-form`, `/report/123`) work properly on GitHub Pages

## GitHub Pages Settings
1. Go to Settings > Pages in your GitHub repository
2. Set Source to "GitHub Actions" (not "Deploy from a branch")
3. The workflow will automatically deploy when you push to main

## Troubleshooting Current Error
The deployment is failing due to permissions. To fix:

1. Go to Settings > Actions > General in your repository
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

Then re-run the failed workflow or push a new commit.

Your site will be available at: `https://yourusername.github.io/repositoryname/`