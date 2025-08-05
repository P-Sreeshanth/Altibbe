#!/bin/bash

echo "🚀 Building Altibbe for GitHub Pages..."

# Clean and build
rm -rf docs
npm run build

# Create docs directory (GitHub Pages source)
mkdir -p docs/assets

# Copy built files to docs
cp dist/public/index.html docs/
cp dist/public/404.html docs/
cp dist/public/favicon.svg docs/
cp dist/public/assets/* docs/assets/

# Fix asset paths for GitHub Pages
sed -i 's|href="/|href="./|g' docs/index.html
sed -i 's|src="/|src="./|g' docs/index.html
sed -i 's|href="/|href="./|g' docs/404.html
sed -i 's|src="/|src="./|g' docs/404.html

echo "✅ GitHub Pages files ready in docs/ folder"
echo ""
echo "📁 Structure:"
echo "docs/"
echo "├── index.html"
echo "├── 404.html" 
echo "├── favicon.svg"
echo "└── assets/"
echo "    ├── $(ls docs/assets/ | grep .css)"
echo "    └── $(ls docs/assets/ | grep .js)"
echo ""
echo "🔧 To deploy:"
echo "1. Commit and push the docs/ folder"
echo "2. Go to GitHub Settings > Pages"
echo "3. Set source to 'Deploy from branch'"
echo "4. Select 'main' branch and '/docs' folder"
echo "5. Save"
echo ""
echo "🌐 Your site will be live at: https://yourusername.github.io/repositoryname/"