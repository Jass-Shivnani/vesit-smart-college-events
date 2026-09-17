// One-command local runner for VESIT Smart College Event Management System
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[36m%s\x1b[0m', ' 🚀 Starting Smart College Event System (Local Dev)  ');
console.log('\x1b[36m%s\x1b[0m', ' Group 11 • D17A (VESIT ACC DevOps Mini-Project)     ');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

// 1. Start Backend
console.log('\x1b[33m%s\x1b[0m', '[System] Starting Backend Service on port 5000...');
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const backendProcess = spawn(npmCmd, ['start'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend
console.log('\x1b[33m%s\x1b[0m', '[System] Starting Frontend Vite Server on port 3000...');
const frontendProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n\x1b[31m%s\x1b[0m', '[System] Shutting down services gracefully...');
  if (isWindows) {
    if (backendProcess.pid) spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
    if (frontendProcess.pid) spawn('taskkill', ['/pid', frontendProcess.pid, '/f', '/t']);
  } else {
    backendProcess.kill();
    frontendProcess.kill();
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
