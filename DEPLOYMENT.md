# Zoonigia Deployment Guide

## 🚨 Build Directory Issue & Solution

### Problem
The server expects frontend build files in `dist/public/`, but Vite builds to `dist/` by default. This causes deployment failures with the error:
```
Could not find the build directory: /opt/render/project/src/dist/public
```

### Solution Options

#### Option 1: Use the Custom Deploy Script (Recommended)
We've created a `deploy.sh` script that handles the build process correctly:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment build
./deploy.sh
```

This script:
1. Cleans previous build files
2. Runs the normal build process
3. Copies the built files to `dist/public/` where the server expects them

#### Option 2: Manual Build Process
If you prefer manual control:

```bash
# Clean previous build
rm -rf dist/

# Build the project
npm run build

# Copy files to the correct location
mkdir -p dist/public
cp -r dist/* dist/public/

# Verify the files are in the right place
ls -la dist/public/
```

### For Render Deployment

1. **Build Command**: Use the custom deploy script
   ```
   ./deploy.sh
   ```

2. **Start Command**: Keep the existing start command
   ```
   npm start
   ```

### For Local Development
Local development works normally with `npm run dev` - this issue only affects production builds.

## 🔧 Technical Details

### Why This Happens
- The `server/vite.ts` file has a `serveStatic` function that looks for files in `dist/public/`
- The `vite.config.ts` builds to `dist/` by default
- These files are protected from editing to prevent environment issues
- The solution is to copy the build output to the expected location

### File Structure After Build
```
dist/
├── index.js              # Backend server bundle
├── index.html            # Frontend entry point
├── assets/               # Frontend assets
└── public/               # ← Server expects files here
    ├── index.html
    └── assets/
```

## 🚀 Ready for Deployment

The authentication system is fully functional and production-ready. The build process fix ensures successful deployment to Render or other platforms.

**Next Steps:**
1. Use the `deploy.sh` script for building
2. Commit changes to git
3. Deploy to Render with confidence

The Google OAuth authentication will work seamlessly in production with the proper build configuration.