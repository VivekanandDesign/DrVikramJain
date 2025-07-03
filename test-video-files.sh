#!/bin/bash

echo "Checking video files in src/images directory..."
ls -la /Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images/*.mp4
echo ""

echo "Testing file access for the first video..."
if [ -f "/Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images/Who is a Rheumatologist _ When to See a Joint & Autoimmune Specialist _ Dr. Vikramraj K Jain.mp4" ]; then
    echo "✅ First video file is accessible"
    # Check file size
    size=$(ls -lh "/Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images/Who is a Rheumatologist _ When to See a Joint & Autoimmune Specialist _ Dr. Vikramraj K Jain.mp4" | awk '{print $5}')
    echo "   File size: $size"
else
    echo "❌ First video file not found"
fi
echo ""

echo "Testing file access for the second video..."
if [ -f "/Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images/Protect Your Joints With Early Diagnosis _ Dr. Vikramraj K Jain.mp4" ]; then
    echo "✅ Second video file is accessible"
    # Check file size
    size=$(ls -lh "/Users/vivekanandchoudhari/Desktop/DrVikramJain/src/images/Protect Your Joints With Early Diagnosis _ Dr. Vikramraj K Jain.mp4" | awk '{print $5}')
    echo "   File size: $size"
else
    echo "❌ Second video file not found"
fi
