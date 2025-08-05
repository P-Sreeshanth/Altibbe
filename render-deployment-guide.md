# Render Deployment Configuration Guide

## Problem Fixed
The Render deployment was failing because it was configured to look for a `./build` directory, but this application builds to `./dist`.

## Solution 1: Using render.yaml (Recommended)

This repository now includes a `render.yaml` file that automatically configures Render with the correct settings:

- **Service Type**: Web Service (not Static Site)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Build Output**: Uses `./dist` directory (no publishDir needed for web services)

To deploy using this configuration:
1. Connect your repository to Render
2. Render will automatically detect and use the `render.yaml` file
3. Your app will be deployed as a web service with the correct build configuration

## Solution 2: Manual Dashboard Configuration

If you prefer to configure manually through the Render dashboard:

### Service Settings:
- **Service Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+ (automatic detection)

### Important Notes:
- **DO NOT** set a "Publish Directory" - this is only for static sites
- This is a **Web Service**, not a Static Site, because it includes a Node.js backend
- The build creates both client files (`dist/public/`) and server file (`dist/index.js`)
- The Express server serves the static files from `dist/public/` automatically

## Build Output Structure

After running `npm run build`, the application creates:
```
dist/
├── index.js              # Express server bundle
└── public/              # Client application files
    ├── index.html       # Main HTML file
    ├── favicon.svg      # Favicon
    └── assets/          # CSS and JS bundles
        ├── index-[hash].css
        └── index-[hash].js
```

## Environment Variables

The application expects:
- `NODE_ENV=production` (automatically set by Render)
- `PORT` (automatically provided by Render)

## Troubleshooting

If you're still getting "Publish directory ./build does not exist!" error:
1. Make sure you're creating a **Web Service**, not a **Static Site**
2. Remove any "Publish Directory" setting from your dashboard
3. Ensure Build Command is set to `npm install && npm run build`
4. Ensure Start Command is set to `npm start`

The application will be accessible at your Render service URL once deployed successfully.