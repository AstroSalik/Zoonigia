#!/bin/bash

echo "🚀 Starting Zoonigia deployment build process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Copy dist contents to dist/public for server compatibility
    echo "📦 Copying build files to dist/public..."
    mkdir -p dist/public
    cp -r dist/* dist/public/ 2>/dev/null || true
    
    echo "🎉 Deployment build ready!"
    echo "📁 Build output:"
    ls -la dist/
    echo "📁 Public directory:"
    ls -la dist/public/
else
    echo "❌ Build failed!"
    exit 1
fi