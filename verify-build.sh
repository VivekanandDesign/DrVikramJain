#!/bin/bash

# Production Build Verification Script
# This script checks if the production build is ready for deployment

echo "🔍 Verifying Dr. Vikram Jain Website Production Build..."
echo "=================================================="

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found. Run './build.sh' first."
    exit 1
fi

echo "✅ Build directory exists"

# Check essential files
essential_files=(
    "build/index.html"
    "build/server.js"
    "build/404.html"
    "build/src/css/styles.css"
    "build/src/js/simple-video.js"
    "build/src/js/simple-navigation.js"
    "build/pages/about.html"
    "build/pages/contact.html"
    "build/pages/services.html"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check if videos exist
video_files=(
    "build/src/images/DrVikaramrajJainsir01.mp4"
    "build/src/images/DrVikaramrajJainsirfinalreel01.mp4"
    "build/src/images/DrVikramrajJainSirReel02.mp4"
)

for video in "${video_files[@]}"; do
    if [ -f "$video" ]; then
        echo "✅ $video exists"
    else
        echo "⚠️  $video missing (optional)"
    fi
done

# Check if components exist
component_files=(
    "build/src/components/navbar.html"
    "build/src/components/footer.html"
)

for component in "${component_files[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component exists"
    else
        echo "❌ $component missing"
        exit 1
    fi
done

# Check file sizes
echo ""
echo "📊 Build Statistics:"
echo "=================="
echo "Total build size: $(du -sh build | cut -f1)"
echo "HTML files: $(find build -name "*.html" | wc -l | xargs)"
echo "CSS files: $(find build -name "*.css" | wc -l | xargs)"
echo "JS files: $(find build -name "*.js" | wc -l | xargs)"
echo "Images: $(find build -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" | wc -l | xargs)"
echo "Videos: $(find build -name "*.mp4" | wc -l | xargs)"

# Check if archives exist
echo ""
echo "📦 Deployment Archives:"
echo "======================"
if [ -f "dr-vikram-jain-production.tar.gz" ]; then
    echo "✅ TAR.GZ archive: $(ls -lh dr-vikram-jain-production.tar.gz | awk '{print $5}')"
else
    echo "❌ TAR.GZ archive not found"
fi

if [ -f "dr-vikram-jain-production.zip" ]; then
    echo "✅ ZIP archive: $(ls -lh dr-vikram-jain-production.zip | awk '{print $5}')"
else
    echo "❌ ZIP archive not found"
fi

echo ""
echo "🚀 Production Build Verification Complete!"
echo "✅ Build is ready for deployment"
echo ""
echo "Next steps:"
echo "1. Upload the 'build' directory to your web server"
echo "2. Or use the archive files for deployment"
echo "3. Run 'node server.js' in the build directory"
echo "4. Your website will be available at http://localhost:3000"
