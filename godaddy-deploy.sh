#!/bin/bash

# Script to deploy the website to GoDaddy hosting
# Usage: ./godaddy-deploy.sh [username] [password]

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

# GoDaddy FTP server details
FTP_HOST="ftp.drvikramrajjainrheumatologist.in"
REMOTE_DIR="/" # The remote directory to upload to (adjust if needed)

echo "Deploying to GoDaddy hosting..."

# Create a temporary file for the FTP commands
TEMP_FILE=$(mktemp)

cat > "$TEMP_FILE" << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
prompt
mput *.html
mkdir -p src
cd src
mput src/*.js
mput src/*.css
mkdir -p components
cd components
mput src/components/*.html
cd ..
mkdir -p css
cd css
mput src/css/*.css
cd ..
mkdir -p js
cd js
mput src/js/*.js
cd ..
mkdir -p images
cd images
mput src/images/*.jpg src/images/*.jpeg src/images/*.png src/images/*.svg src/images/*.mp4
quit
EOF

# Execute the FTP commands
ftp -n < "$TEMP_FILE"

# Remove the temporary file
rm "$TEMP_FILE"

echo "Deployment complete!"
