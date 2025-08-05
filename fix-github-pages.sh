#!/bin/bash

# Fix GitHub Pages deployment script
echo "Building project..."
npm run build

echo "Fixing asset paths for GitHub Pages..."
# Replace absolute paths with relative paths
sed -i 's|href="/|href="./|g' dist/public/index.html
sed -i 's|src="/|src="./|g' dist/public/index.html

# Create 404.html for SPA routing (copy from index.html)
cp dist/public/index.html dist/public/404.html

echo "✓ Files ready for GitHub Pages deployment!"
echo ""
echo "Built files in dist/public/:"
ls -la dist/public/

echo ""
echo "Asset files:"
ls -la dist/public/assets/

echo ""
echo "Upload these files to your GitHub repository's root directory:"
echo "- Copy everything from dist/public/ to your repository root"
echo "- Make sure to commit index.html, 404.html, assets/, and favicon.svg"