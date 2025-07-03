#!/bin/bash

# Test script to try different GoDaddy FTP configurations
FTP_USER="vivekanandc@drvikramjainrheumatologist.in"
FTP_PASS="1Oolalalaleo"
REMOTE_DIR="/public_html"

# Array of possible FTP hosts for GoDaddy
FTP_HOSTS=(
    "ftp.godaddy.com"
    "ftp.secureserver.net"
    "waws-prod-sn1-005.ftp.azurewebsites.windows.net"
    "p3plcpnl0999.prod.phx3.secureserver.net"
)

echo "Testing different FTP configurations for GoDaddy cPanel..."

for FTP_HOST in "${FTP_HOSTS[@]}"; do
    echo "Testing FTP host: $FTP_HOST"
    
    # Create a temporary script for lftp
    TEMP_FILE=$(mktemp)
    
    cat > "$TEMP_FILE" << EOF
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST:21
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-force true
set cmd:fail-exit true
pwd
ls
quit
EOF
    
    # Execute the LFTP commands
    if lftp -f "$TEMP_FILE" 2>/dev/null; then
        echo "✅ SUCCESS: Connected to $FTP_HOST"
        echo "This is your correct FTP host!"
        rm "$TEMP_FILE"
        exit 0
    else
        echo "❌ FAILED: Could not connect to $FTP_HOST"
    fi
    
    # Remove the temporary file
    rm "$TEMP_FILE"
    echo ""
done

echo "❌ None of the FTP hosts worked. Please check your credentials or contact GoDaddy support."
