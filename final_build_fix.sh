#!/bin/bash

# Final comprehensive build fix
echo "Fixing all remaining @shared/schema imports..."

# Replace all schema imports with types imports
find client/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@shared\/schema/@shared\/types/g'

# Remove problematic TypeScript cache files
rm -f frontend/tsconfig.tsbuildinfo
rm -rf node_modules/.cache
rm -rf frontend/dist
rm -rf frontend/.vite

echo "Building frontend..."
cd frontend && npm run build

echo "Build completed!"