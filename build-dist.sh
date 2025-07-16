#!/bin/bash

# Script to build the website for distribution (dist)

echo "Building Dr. Vikram Jain's website for distribution..."

# Remove existing dist directory if it exists
rm -rf dist

# Create dist directory
mkdir -p dist

# Copy HTML files
echo "Copying HTML files..."
cp *.html dist/
cp -r pages dist/

# Copy CSS files - can be minified in a production environment
echo "Processing CSS files..."
mkdir -p dist/src/css
cp -r src/css dist/src/

# Copy JS files - can be minified in a production environment
echo "Processing JavaScript files..."
mkdir -p dist/src/js
cp -r src/js dist/src/

# Copy images and other assets
echo "Copying images and assets..."
mkdir -p dist/src/images
cp -r src/images dist/src/

# Copy components
echo "Copying components..."
mkdir -p dist/src/components
cp -r src/components dist/src/

# Copy other necessary files
echo "Copying additional files..."
cp robots.txt dist/ 2>/dev/null || :
cp manifest.json dist/ 2>/dev/null || :
cp sitemap.xml dist/ 2>/dev/null || :
cp service-worker.js dist/ 2>/dev/null || :
cp server.js dist/ 2>/dev/null || :
cp 404.html dist/ 2>/dev/null || :
cp package.json dist/ 2>/dev/null || :

# Remove unnecessary files from dist
echo "Cleaning up dist directory..."
find dist -name "*.bak" -delete 2>/dev/null || :
find dist -name ".DS_Store" -delete 2>/dev/null || :
find dist -name "*.tmp" -delete 2>/dev/null || :

# Create package.json for dist if it doesn't exist
if [ ! -f "dist/package.json" ]; then
    echo "Creating package.json for dist..."
    cat > dist/package.json << 'EOF'
{
  "name": "dr-vikram-jain-website",
  "version": "1.0.0",
  "description": "Dr. Vikram Jain's medical practice website - Production Distribution",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "serve": "node server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "keywords": ["medical", "rheumatology", "website", "healthcare"],
  "author": "Dr. Vikram Jain",
  "license": "ISC"
}
EOF
fi

# Display dist directory size
echo ""
echo "Distribution build complete!"
echo "================================"
echo "Dist directory size: $(du -sh dist | cut -f1)"
echo "Files created: $(find dist -type f | wc -l | xargs)"
echo ""
echo "To run the distribution:"
echo "1. cd dist/"
echo "2. npm install"
echo "3. npm start"
echo ""
echo "Or run directly:"
echo "node dist/server.js"
