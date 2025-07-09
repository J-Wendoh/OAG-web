#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting OAG Web System Build for Vercel...');

// Function to run commands with proper error handling
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📋 Running: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('website/dist')) {
  fs.rmSync('website/dist', { recursive: true, force: true });
}
if (fs.existsSync('admin/dist')) {
  fs.rmSync('admin/dist', { recursive: true, force: true });
}
if (fs.existsSync('dist-combined')) {
  fs.rmSync('dist-combined', { recursive: true, force: true });
}

// Build website
console.log('🌐 Building main website...');
runCommand('npm ci --production=false', 'website');
runCommand('npm run build', 'website');

if (!fs.existsSync('website/dist')) {
  console.error('❌ Website build failed - dist directory not found');
  process.exit(1);
}
console.log('✅ Website build completed');

// Build admin panel
console.log('🔐 Building admin panel...');
runCommand('npm ci --production=false', 'admin');
runCommand('npm run build', 'admin');

if (!fs.existsSync('admin/dist')) {
  console.error('❌ Admin panel build failed - dist directory not found');
  process.exit(1);
}
console.log('✅ Admin panel build completed');

// Create combined distribution
console.log('📦 Creating combined distribution...');
fs.mkdirSync('dist-combined', { recursive: true });

// Copy website files to root
console.log('📁 Copying website files...');
execSync('cp -r website/dist/* dist-combined/', { stdio: 'inherit' });

// Copy admin files to /admin subdirectory
console.log('📁 Copying admin files...');
fs.mkdirSync('dist-combined/admin', { recursive: true });
execSync('cp -r admin/dist/* dist-combined/admin/', { stdio: 'inherit' });

// Verify structure
if (!fs.existsSync('dist-combined/index.html')) {
  console.error('❌ Main website index.html not found in combined build');
  process.exit(1);
}

if (!fs.existsSync('dist-combined/admin/index.html')) {
  console.error('❌ Admin panel index.html not found in combined build');
  process.exit(1);
}

// Create deployment info
const deploymentInfo = {
  buildDate: new Date().toISOString(),
  version: new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-'),
  structure: {
    website: {
      path: '/',
      files: fs.readdirSync('dist-combined').filter(f => f !== 'admin').length
    },
    admin: {
      path: '/admin',
      files: fs.readdirSync('dist-combined/admin').length
    }
  },
  routing: {
    website: 'Path-based routing under /',
    admin: 'Path-based routing under /admin'
  }
};

fs.writeFileSync('dist-combined/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

console.log('✅ Combined build completed successfully!');
console.log('📊 Build Statistics:');
console.log(`   🌐 Website files: ${deploymentInfo.structure.website.files}`);
console.log(`   🔐 Admin files: ${deploymentInfo.structure.admin.files}`);
console.log('🎉 Ready for Vercel deployment!');
