#!/bin/bash

# Script to deploy the website to Netlify

echo "Building and deploying Dr. Vikram Jain's website to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing it now..."
    npm install -g netlify-cli
fi

# Deploy the site to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "Deployment complete!"
