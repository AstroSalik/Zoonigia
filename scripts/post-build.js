#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy dist contents to dist/public for server compatibility
async function copyDistToPublic() {
  const distPath = path.resolve(__dirname, '..', 'dist');
  const publicPath = path.resolve(__dirname, '..', 'dist', 'public');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Build directory not found. Run vite build first.');
    process.exit(1);
  }
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  
  // Copy all files from dist to dist/public
  const files = fs.readdirSync(distPath);
  for (const file of files) {
    const srcFile = path.join(distPath, file);
    const destFile = path.join(publicPath, file);
    
    if (fs.statSync(srcFile).isDirectory() && file !== 'public') {
      // Copy directory recursively
      fs.cpSync(srcFile, destFile, { recursive: true });
    } else if (fs.statSync(srcFile).isFile()) {
      // Copy file
      fs.copyFileSync(srcFile, destFile);
    }
  }
  
  console.log('✅ Successfully copied build files to dist/public');
}

copyDistToPublic().catch(console.error);