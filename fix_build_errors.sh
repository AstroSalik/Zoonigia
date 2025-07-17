#!/bin/bash

# Script to fix all build errors systematically

cd frontend

echo "Installing dependencies..."
npm install

echo "Running build to check errors..."
npm run build 2>&1 | head -50

echo "Build test completed."