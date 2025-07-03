#!/bin/bash

# Simple FTP test script for GoDaddy
FTP_USER="vivekanandc@drvikramjainrheumatologist.in"
FTP_PASS="1Oolalalaleo"

echo "Testing FTP connection to GoDaddy..."

# Try different FTP servers
FTP_SERVERS=(
    "ftp.secureserver.net"
    "ftp.godaddy.com"
    "secureserver.net"
)

for server in "${FTP_SERVERS[@]}"; do
    echo "Trying $server..."
    
    TEMP_FILE=$(mktemp)
    cat > "$TEMP_FILE" << EOF
open ftp://$FTP_USER:$FTP_PASS@$server:21
set ssl:verify-certificate no
set ftp:ssl-allow yes
set cmd:fail-exit true
set net:timeout 10
pwd
ls
quit
EOF
    
    if lftp -f "$TEMP_FILE" 2>&1; then
        echo "✅ SUCCESS: Connected to $server"
        rm "$TEMP_FILE"
        exit 0
    else
        echo "❌ FAILED: $server"
    fi
    
    rm "$TEMP_FILE"
done

echo "All FTP servers failed. Please check credentials."
