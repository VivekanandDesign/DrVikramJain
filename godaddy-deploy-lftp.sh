#!/bin/bash

# Script to deploy the website to GoDaddy hosting
# Usage: ./godaddy-deploy-lftp.sh [username] [password]

# If credentials are not provided as arguments, prompt for them
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "GoDaddy credentials not provided as arguments."
  read -p "Enter GoDaddy username: " FTP_USER
  read -s -p "Enter GoDaddy password: " FTP_PASS
  echo ""
else
  FTP_USER=$1
  FTP_PASS=$2
fi

# GoDaddy cPanel FTP details for drvikramjainrheumatologist.in
FTP_HOST="ftp.secureserver.net"  # Alternative GoDaddy FTP hostname
REMOTE_DIR="/home/tbd6q9k87sn3/public_html/drvikramjainrheumatologist.in/vivekanandc" # Full path to user directory
FTP_PORT="21" # Standard FTP port

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "lftp is not installed. Please install it first with:"
    echo "brew install lftp"
    exit 1
fi

echo "Deploying to GoDaddy cPanel hosting at drvikramjainrheumatologist.in..."

# Create a temporary script for lftp
TEMP_FILE=$(mktemp)

cat > "$TEMP_FILE" << EOF
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST:$FTP_PORT
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-force true
set net:timeout 30
set net:max-retries 3
# Use mirror without --delete first time to avoid accidentally removing important files
mirror -R --verbose ./ $REMOTE_DIR
bye
EOF

# Execute the LFTP commands
lftp -f "$TEMP_FILE"

# Remove the temporary file
rm "$TEMP_FILE"

echo "Deployment complete!"
