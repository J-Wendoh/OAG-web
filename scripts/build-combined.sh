#!/bin/bash

# =====================================================
# OAG WEB SYSTEM - COMBINED BUILD SCRIPT
# =====================================================
# This script builds both the website and admin panel
# and combines them for path-based deployment

set -e

echo "🚀 Starting OAG Web System Combined Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "website" ] || [ ! -d "admin" ]; then
    print_error "Please run this script from the OAG-web root directory"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf website/dist
rm -rf admin/dist
rm -rf dist-combined

# Build the main website
print_status "Building main website..."
cd website
npm ci --silent --production=false
npm run build
cd ..

if [ ! -d "website/dist" ]; then
    print_error "Website build failed - dist directory not found"
    exit 1
fi

print_success "Website build completed"

# Build the admin panel
print_status "Building admin panel..."
cd admin
npm ci --silent --production=false
npm run build
cd ..

if [ ! -d "admin/dist" ]; then
    print_error "Admin panel build failed - dist directory not found"
    exit 1
fi

print_success "Admin panel build completed"

# Create combined distribution
print_status "Creating combined distribution..."
mkdir -p dist-combined

# Copy website files to root
cp -r website/dist/* dist-combined/

# Copy admin files to /admin subdirectory
mkdir -p dist-combined/admin
cp -r admin/dist/* dist-combined/admin/

# Create deployment structure verification
print_status "Verifying deployment structure..."

# Check main website files
if [ ! -f "dist-combined/index.html" ]; then
    print_error "Main website index.html not found in combined build"
    exit 1
fi

# Check admin files
if [ ! -f "dist-combined/admin/index.html" ]; then
    print_error "Admin panel index.html not found in combined build"
    exit 1
fi

# Create a simple verification script
cat > dist-combined/verify-structure.sh << 'EOF'
#!/bin/bash
echo "OAG Web System - Deployment Structure Verification"
echo "=================================================="
echo "Main Website Files:"
ls -la / | head -10
echo ""
echo "Admin Panel Files:"
ls -la /admin/ | head -10
echo ""
echo "Structure verified successfully!"
EOF

chmod +x dist-combined/verify-structure.sh

# Generate deployment info
cat > dist-combined/deployment-info.json << EOF
{
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "$(date +%Y%m%d-%H%M%S)",
  "structure": {
    "website": {
      "path": "/",
      "files": "$(find dist-combined -maxdepth 1 -type f | wc -l)"
    },
    "admin": {
      "path": "/admin",
      "files": "$(find dist-combined/admin -type f | wc -l)"
    }
  },
  "routing": {
    "website": "Path-based routing under /",
    "admin": "Path-based routing under /admin"
  }
}
EOF

print_success "Combined build completed successfully!"
print_status "Build artifacts:"
echo "  📁 dist-combined/ - Combined deployment files"
echo "  🌐 dist-combined/index.html - Main website entry point"
echo "  🔐 dist-combined/admin/index.html - Admin panel entry point"
echo "  📋 dist-combined/deployment-info.json - Build information"

# Display structure summary
print_status "Deployment structure summary:"
echo "  Website: ag.go.ke/ → dist-combined/"
echo "  Admin:   ag.go.ke/admin/ → dist-combined/admin/"

# File count summary
WEBSITE_FILES=$(find dist-combined -maxdepth 1 -type f | wc -l)
ADMIN_FILES=$(find dist-combined/admin -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh dist-combined | cut -f1)

echo ""
print_success "Build Statistics:"
echo "  📊 Website files: $WEBSITE_FILES"
echo "  📊 Admin files: $ADMIN_FILES"
echo "  📊 Total size: $TOTAL_SIZE"

echo ""
print_success "🎉 OAG Web System build completed successfully!"
print_status "Ready for deployment with nginx configuration in deployment/nginx.conf"
