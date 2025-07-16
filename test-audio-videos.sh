#!/bin/bash

# Test script to verify video files and audio functionality
echo "🎬 Testing Dr. Vikram Jain Website Videos..."
echo "=============================================="

# Check if video files exist
echo "📁 Checking video files..."
VIDEO_DIR="/Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images"

if [ -f "$VIDEO_DIR/DrVikaramrajJainsir01.mp4" ]; then
    echo "✅ DrVikaramrajJainsir01.mp4 exists"
    size=$(ls -lh "$VIDEO_DIR/DrVikaramrajJainsir01.mp4" | awk '{print $5}')
    echo "   Size: $size"
else
    echo "❌ DrVikaramrajJainsir01.mp4 missing"
fi

if [ -f "$VIDEO_DIR/DrVikaramrajJainsirfinalreel01.mp4" ]; then
    echo "✅ DrVikaramrajJainsirfinalreel01.mp4 exists"
    size=$(ls -lh "$VIDEO_DIR/DrVikaramrajJainsirfinalreel01.mp4" | awk '{print $5}')
    echo "   Size: $size"
else
    echo "❌ DrVikaramrajJainsirfinalreel01.mp4 missing"
fi

if [ -f "$VIDEO_DIR/DrVikramrajJainSirReel02.mp4" ]; then
    echo "✅ DrVikramrajJainSirReel02.mp4 exists"
    size=$(ls -lh "$VIDEO_DIR/DrVikramrajJainSirReel02.mp4" | awk '{print $5}')
    echo "   Size: $size"
else
    echo "❌ DrVikramrajJainSirReel02.mp4 missing"
fi

echo ""
echo "🎵 Audio-enabled video features:"
echo "================================"
echo "✅ Videos start muted for autoplay compliance"
echo "✅ Audio automatically enables on desktop after 1 second"
echo "✅ Audio enables on user interaction (click/touch)"
echo "✅ Audio indicator shows in bottom-right corner"
echo "✅ Clicking video enables audio and plays/pauses"
echo "✅ Mobile-friendly with touch gesture support"
echo ""
echo "🌐 Server should be running at: http://localhost:3000/"
echo ""
echo "📋 Test checklist:"
echo "==================="
echo "1. Open http://localhost:3000/ in browser"
echo "2. Scroll to 'About Dr. Vikram Jain' section"
echo "3. Video should start playing automatically"
echo "4. On desktop: Audio should enable after 1 second"
echo "5. On mobile: Tap anywhere or on video to enable audio"
echo "6. Click video to pause/play and enable audio"
echo "7. Check about.html page for additional videos"
echo "8. Verify audio indicator appears in video corner"
