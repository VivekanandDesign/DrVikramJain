#!/bin/bash

# Script to build the website for production

echo "Building Dr. Vikram Jain's website for production..."

# Create build directory
mkdir -p build

# Copy HTML files
echo "Copying HTML files..."
cp *.html build/
cp -r pages build/

# Copy CSS files - can be minified in a production environment
echo "Processing CSS files..."
mkdir -p build/src/css
cp -r src/css build/src/

# Copy JS files - can be minified in a production environment
echo "Processing JavaScript files..."
mkdir -p build/src/js
cp -r src/js build/src/

# Copy images and other assets
echo "Copying images and assets..."
mkdir -p build/src/images
cp -r src/images build/src/

# Copy components
echo "Copying components..."
mkdir -p build/src/components
cp -r src/components build/src/

# Copy other necessary files
echo "Copying additional files..."
cp robots.txt build/ 2>/dev/null || :
cp manifest.json build/ 2>/dev/null || :
cp sitemap.xml build/ 2>/dev/null || :
cp service-worker.js build/ 2>/dev/null || :
cp server.js build/ 2>/dev/null || :
cp 404.html build/ 2>/dev/null || :

echo "Build complete! Files are in the 'build' directory."
echo "To preview the production build, run: node build/server.js"
