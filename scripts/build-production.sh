#!/bin/bash

# =====================================================
# OAG WEB SYSTEM - PRODUCTION BUILD SCRIPT
# =====================================================
# This script builds the OAG Web System for production deployment

set -e  # Exit on any error

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
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting OAG Web System production build..."

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if required environment files exist
if [ ! -f "website/.env.production" ]; then
    print_warning "website/.env.production not found. Using .env.production.example as template."
    if [ -f "website/.env.production.example" ]; then
        cp website/.env.production.example website/.env.production
        print_warning "Please update website/.env.production with your actual values before deploying."
    fi
fi

if [ ! -f "admin/.env.production" ]; then
    print_warning "admin/.env.production not found. Using .env.production.example as template."
    if [ -f "admin/.env.production.example" ]; then
        cp admin/.env.production.example admin/.env.production
        print_warning "Please update admin/.env.production with your actual values before deploying."
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Install website dependencies
print_status "Installing website dependencies..."
cd website
npm install
cd ..

# Install admin dependencies
print_status "Installing admin dependencies..."
cd admin
npm install
cd ..

# Run security audit
print_status "Running security audit..."
npm audit --audit-level=high || print_warning "Security vulnerabilities found. Please review and fix."

# Run tests (if available)
if [ -f "website/package.json" ] && grep -q '"test"' website/package.json; then
    print_status "Running website tests..."
    cd website
    npm test -- --watchAll=false || print_warning "Some tests failed."
    cd ..
fi

# Build website
print_status "Building website for production..."
cd website
NODE_ENV=production npm run build

# Check build output
if [ ! -d "dist" ]; then
    print_error "Website build failed - dist directory not found."
    exit 1
fi

print_success "Website build completed successfully."

# Analyze bundle size
if command -v du &> /dev/null; then
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    print_status "Website bundle size: $BUNDLE_SIZE"
fi

cd ..

# Build admin panel
print_status "Building admin panel for production..."
cd admin
NODE_ENV=production npm run build

# Check build output
if [ ! -d "dist" ]; then
    print_error "Admin panel build failed - dist directory not found."
    exit 1
fi

print_success "Admin panel build completed successfully."

# Analyze bundle size
if command -v du &> /dev/null; then
    ADMIN_BUNDLE_SIZE=$(du -sh dist | cut -f1)
    print_status "Admin panel bundle size: $ADMIN_BUNDLE_SIZE"
fi

cd ..

# Create deployment package
print_status "Creating deployment package..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="oag-web-system-${TIMESTAMP}.tar.gz"

tar -czf "$PACKAGE_NAME" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env' \
    --exclude='.env.local' \
    website/dist \
    admin/dist \
    scripts/ \
    PRODUCTION_SUPABASE_SETUP.sql \
    ADMIN_USERS_SETUP.sql \
    website/.env.production.example \
    admin/.env.production.example \
    website/public/_headers \
    README.md \
    SECURITY_AUDIT_REPORT.md \
    TESTING_VALIDATION_REPORT.md \
    IMPLEMENTATION_COMPLETE.md

print_success "Deployment package created: $PACKAGE_NAME"

# Generate deployment checklist
print_status "Generating deployment checklist..."
cat > DEPLOYMENT_CHECKLIST.md << EOF
# OAG Web System - Production Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Production Supabase project created
- [ ] Database schema applied (PRODUCTION_SUPABASE_SETUP.sql)
- [ ] Admin users created (ADMIN_USERS_SETUP.sql)
- [ ] Environment variables configured (.env.production files)
- [ ] SSL certificates obtained and configured
- [ ] Domain DNS configured

### Security
- [ ] Security headers configured (_headers file)
- [ ] HTTPS enforced
- [ ] Content Security Policy tested
- [ ] Rate limiting configured
- [ ] Input validation tested
- [ ] File upload restrictions verified

### Performance
- [ ] CDN configured
- [ ] Image optimization enabled
- [ ] Caching headers set
- [ ] Service worker registered
- [ ] Bundle size optimized

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Uptime monitoring set up
- [ ] Performance monitoring enabled
- [ ] Log aggregation configured

### Testing
- [ ] All functionality tested in staging
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Performance testing passed
- [ ] Security testing completed
- [ ] Load testing passed

## Deployment Steps

1. Upload deployment package to server
2. Extract files to web directory
3. Configure web server (Nginx/Apache)
4. Set up SSL certificates
5. Configure environment variables
6. Test all functionality
7. Enable monitoring
8. Update DNS if needed

## Post-Deployment Verification

- [ ] Website loads correctly (https://ag.go.ke)
- [ ] Admin panel accessible (https://admin.ag.go.ke)
- [ ] All forms working
- [ ] Database connections working
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Search functionality working
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Security headers present
- [ ] SSL certificate valid

## Rollback Plan

1. Keep previous version backup
2. Document rollback procedure
3. Test rollback in staging
4. Monitor for issues post-deployment

---
Generated: $(date)
Package: $PACKAGE_NAME
EOF

print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"

# Performance analysis
print_status "Analyzing build performance..."
echo "=== BUILD SUMMARY ===" > BUILD_REPORT.txt
echo "Build Date: $(date)" >> BUILD_REPORT.txt
echo "Node Version: $NODE_VERSION" >> BUILD_REPORT.txt
echo "Website Bundle Size: ${BUNDLE_SIZE:-'Unknown'}" >> BUILD_REPORT.txt
echo "Admin Bundle Size: ${ADMIN_BUNDLE_SIZE:-'Unknown'}" >> BUILD_REPORT.txt
echo "Package Name: $PACKAGE_NAME" >> BUILD_REPORT.txt
echo "" >> BUILD_REPORT.txt

# List all files in website dist
echo "=== WEBSITE BUILD FILES ===" >> BUILD_REPORT.txt
if [ -d "website/dist" ]; then
    find website/dist -type f -exec ls -lh {} \; | sort -k5 -hr >> BUILD_REPORT.txt
fi
echo "" >> BUILD_REPORT.txt

# List all files in admin dist
echo "=== ADMIN BUILD FILES ===" >> BUILD_REPORT.txt
if [ -d "admin/dist" ]; then
    find admin/dist -type f -exec ls -lh {} \; | sort -k5 -hr >> BUILD_REPORT.txt
fi

print_success "Build report created: BUILD_REPORT.txt"

# Final summary
echo ""
echo "=========================================="
print_success "PRODUCTION BUILD COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
print_status "Next steps:"
echo "1. Review and update .env.production files with actual values"
echo "2. Set up production Supabase project using PRODUCTION_SUPABASE_SETUP.sql"
echo "3. Create admin users using ADMIN_USERS_SETUP.sql"
echo "4. Deploy using the deployment package: $PACKAGE_NAME"
echo "5. Follow the deployment checklist: DEPLOYMENT_CHECKLIST.md"
echo ""
print_warning "Remember to test everything in a staging environment first!"
echo ""
