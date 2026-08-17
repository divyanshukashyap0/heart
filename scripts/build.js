import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building Vite project...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Copying static proposal and assests directories to dist...');
if (fs.existsSync('proposal')) {
  fs.cpSync('proposal', 'dist/proposal', { recursive: true });
}
if (fs.existsSync('assests')) {
  fs.cpSync('assests', 'dist/assests', { recursive: true });
}

console.log('Build completed successfully!');
