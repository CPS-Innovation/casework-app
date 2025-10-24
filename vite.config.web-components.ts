/// <reference types="vitest" />
// @ts-ignore
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// Dynamically read directories starting with 'POC_' in 'src/packages'
const packageDir = path.resolve(__dirname, 'src/packages');
const packageDirs = fs
  .readdirSync(packageDir)
  .filter((dir) => dir.startsWith('POC_'));

// Build input for each of these directories
const inputEntries: Record<string, string> = {};
packageDirs.forEach((dir) => {
  const filePath = path.join(packageDir, dir, `${dir}.tsx`); // Each directory should have a .tsx file named after the directory
  if (fs.existsSync(filePath)) {
    inputEntries[dir] = filePath;
  }
});

// Vite configuration for web components
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // General output folder (the web components will go in 'build/web-components')
    target: 'esnext', // Use modern JavaScript
    rollupOptions: {
      input: inputEntries, // Use dynamic input entries for each 'POC_' directory
      output: {
        dir: path.resolve(__dirname, 'build/web-components'), // Output to './build/web-components'
        format: 'es', // Output as ES modules
        entryFileNames: (chunkInfo) => {
          // Use the directory name as the file name
          const dirName = chunkInfo.name.split('/').pop(); // Get directory name from input
          return `${dirName}.js`; // Output file name will be the directory name
        },
        // Ensure that assets (like images or styles) don't go into an "assets" folder
        assetFileNames: '[name][extname]' // Output assets with their original name in the build folder
      }
    }
  }
});
