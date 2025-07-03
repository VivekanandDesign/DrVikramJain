# Deployment Guide for Dr. Vikram Jain's Website

## GoDaddy Deployment Instructions

### Prerequisites

1. **Install lftp** (for the advanced script)
   ```bash
   brew install lftp  # For macOS
   ```
   or 
   ```bash
   sudo apt-get install lftp  # For Linux (Ubuntu/Debian)
   ```

2. **Ensure you have your GoDaddy credentials ready**
   - Username
   - Password
   - FTP hostname (typically ftp.yourdomain.com)

### Option 1: Using the Basic Script (ftp)

The basic script uses the standard `ftp` command available on most systems:

```bash
./godaddy-deploy.sh
```

When prompted, enter your GoDaddy username and password.

### Option 2: Using the Advanced Script (lftp - recommended)

The advanced script uses `lftp` which provides better reliability and features like recursive directory upload:

```bash
./godaddy-deploy-lftp.sh
```

When prompted, enter your GoDaddy username and password.

### Option 3: Passing Credentials as Arguments (Not Recommended for Regular Use)

For automated deployments, you can pass credentials as arguments:

```bash
./godaddy-deploy.sh username password
```

or

```bash
./godaddy-deploy-lftp.sh username password
```

⚠️ **Security Warning:** This method will save your credentials in your command history. Use only for testing or ensure you clear your history afterward.

## Troubleshooting

### Common Issues

1. **Connection Failures**:
   - Verify that your credentials are correct
   - Check that the FTP hostname is correct
   - Ensure your GoDaddy hosting plan has FTP access enabled

2. **Permission Denied Errors**:
   - Make sure your GoDaddy user has write permissions to the target directory

3. **SSL/TLS Errors**:
   - The script is configured to work with GoDaddy's SSL settings, but if issues persist, 
     you may need to adjust the SSL settings in the scripts

### Getting Help

If you encounter any issues with deployment:
1. Check the GoDaddy help center for FTP access instructions
2. Contact GoDaddy support with any specific hosting-related questions
3. Review the error messages in the terminal for specific troubleshooting clues

## Important Security Notes

- **Never commit credentials to version control**
- **Clear your command history if you used credentials in the command line** (`history -c`)
- Consider setting up SSH key authentication if available with your hosting plan
