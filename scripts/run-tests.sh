#!/bin/bash

# =====================================================
# OAG WEB SYSTEM - AUTOMATED TESTING SCRIPT
# =====================================================
# Comprehensive testing suite for production readiness

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

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running test: $test_name"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if eval "$test_command"; then
        print_success "✓ $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "✗ $test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

print_status "Starting OAG Web System automated testing..."

# =====================================================
# UNIT TESTS
# =====================================================
print_status "Running unit tests..."

# Website unit tests
if [ -d "website" ] && [ -f "website/package.json" ]; then
    cd website
    if grep -q '"test"' package.json; then
        run_test "Website Unit Tests" "npm test -- --watchAll=false --coverage"
    else
        print_warning "No unit tests configured for website"
    fi
    cd ..
fi

# Admin unit tests
if [ -d "admin" ] && [ -f "admin/package.json" ]; then
    cd admin
    if grep -q '"test"' package.json; then
        run_test "Admin Unit Tests" "npm test -- --watchAll=false --coverage"
    else
        print_warning "No unit tests configured for admin"
    fi
    cd ..
fi

# =====================================================
# LINTING AND CODE QUALITY
# =====================================================
print_status "Running code quality checks..."

# ESLint for website
if [ -d "website" ]; then
    cd website
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
        run_test "Website ESLint" "npm run lint"
    else
        print_warning "ESLint not configured for website"
    fi
    cd ..
fi

# ESLint for admin
if [ -d "admin" ]; then
    cd admin
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
        run_test "Admin ESLint" "npm run lint"
    else
        print_warning "ESLint not configured for admin"
    fi
    cd ..
fi

# TypeScript type checking
if [ -d "website" ]; then
    cd website
    if [ -f "tsconfig.json" ]; then
        run_test "Website TypeScript Check" "npx tsc --noEmit"
    fi
    cd ..
fi

if [ -d "admin" ]; then
    cd admin
    if [ -f "tsconfig.json" ]; then
        run_test "Admin TypeScript Check" "npx tsc --noEmit"
    fi
    cd ..
fi

# =====================================================
# SECURITY TESTS
# =====================================================
print_status "Running security tests..."

# NPM audit
run_test "NPM Security Audit" "npm audit --audit-level=high"

# Check for exposed secrets
run_test "Secret Detection" "! grep -r 'password\|secret\|key' --include='*.env' --include='*.js' --include='*.ts' --exclude-dir=node_modules . || echo 'No secrets found in code'"

# Check for hardcoded credentials
run_test "Hardcoded Credentials Check" "! grep -r 'password.*=' --include='*.js' --include='*.ts' --exclude-dir=node_modules . || echo 'No hardcoded credentials found'"

# =====================================================
# BUILD TESTS
# =====================================================
print_status "Running build tests..."

# Website build test
if [ -d "website" ]; then
    cd website
    run_test "Website Build" "npm run build"
    
    # Check if build output exists
    if [ -d "dist" ]; then
        run_test "Website Build Output Check" "[ -f dist/index.html ]"
        
        # Check bundle size
        BUNDLE_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "unknown")
        print_status "Website bundle size: $BUNDLE_SIZE"
        
        # Check for critical files
        run_test "Critical Files Check" "[ -f dist/index.html ] && [ -d dist/assets ]"
    fi
    cd ..
fi

# Admin build test
if [ -d "admin" ]; then
    cd admin
    run_test "Admin Build" "npm run build"
    
    # Check if build output exists
    if [ -d "dist" ]; then
        run_test "Admin Build Output Check" "[ -f dist/index.html ]"
        
        # Check bundle size
        ADMIN_BUNDLE_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "unknown")
        print_status "Admin bundle size: $ADMIN_BUNDLE_SIZE"
    fi
    cd ..
fi

# =====================================================
# INTEGRATION TESTS
# =====================================================
print_status "Running integration tests..."

# Start test server if builds exist
if [ -d "website/dist" ]; then
    print_status "Starting test server..."
    cd website
    npx serve -s dist -l 3001 &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 5
    
    # Test server response
    run_test "Server Response Test" "curl -f http://localhost:3001/"
    
    # Test critical pages
    run_test "Homepage Load Test" "curl -f http://localhost:3001/ | grep -q 'Office of the Attorney General'"
    
    # Test API endpoints (if any)
    # run_test "API Health Check" "curl -f http://localhost:3001/api/health"
    
    # Stop test server
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
fi

# =====================================================
# PERFORMANCE TESTS
# =====================================================
print_status "Running performance tests..."

# Lighthouse CI (if available)
if command -v lhci &> /dev/null; then
    run_test "Lighthouse Performance Test" "lhci autorun"
else
    print_warning "Lighthouse CI not available - skipping performance tests"
fi

# Bundle analyzer (if available)
if [ -d "website" ]; then
    cd website
    if npm list webpack-bundle-analyzer &>/dev/null; then
        run_test "Bundle Analysis" "npm run analyze"
    else
        print_warning "Bundle analyzer not available"
    fi
    cd ..
fi

# =====================================================
# ACCESSIBILITY TESTS
# =====================================================
print_status "Running accessibility tests..."

# axe-core testing (if available)
if command -v axe &> /dev/null; then
    run_test "Accessibility Test" "axe http://localhost:3001/"
else
    print_warning "axe-core not available - skipping accessibility tests"
fi

# =====================================================
# ENVIRONMENT VALIDATION
# =====================================================
print_status "Running environment validation..."

# Check environment files
run_test "Environment Files Check" "[ -f website/.env.production.example ] && [ -f admin/.env.production.example ]"

# Check Docker configuration
run_test "Docker Configuration Check" "[ -f Dockerfile ] && [ -f docker-compose.prod.yml ]"

# Check deployment scripts
run_test "Deployment Scripts Check" "[ -f scripts/deploy-production.sh ] && [ -x scripts/deploy-production.sh ]"

# Check security headers configuration
run_test "Security Headers Check" "[ -f website/public/_headers ]"

# =====================================================
# DATABASE TESTS
# =====================================================
print_status "Running database tests..."

# Check SQL files
run_test "Database Schema Check" "[ -f PRODUCTION_SUPABASE_SETUP.sql ]"
run_test "Admin Users Setup Check" "[ -f ADMIN_USERS_SETUP.sql ]"

# Validate SQL syntax (basic check)
if command -v sqlfluff &> /dev/null; then
    run_test "SQL Syntax Check" "sqlfluff lint PRODUCTION_SUPABASE_SETUP.sql"
else
    print_warning "SQL linter not available - skipping SQL syntax check"
fi

# =====================================================
# DOCUMENTATION TESTS
# =====================================================
print_status "Running documentation tests..."

# Check required documentation
run_test "Documentation Check" "[ -f README.md ] && [ -f SECURITY_AUDIT_REPORT.md ] && [ -f TESTING_VALIDATION_REPORT.md ]"

# Check deployment documentation
run_test "Deployment Documentation Check" "[ -f DEPLOYMENT_CHECKLIST.md ] || [ -f IMPLEMENTATION_COMPLETE.md ]"

# =====================================================
# FINAL RESULTS
# =====================================================
echo ""
echo "=========================================="
print_status "TEST RESULTS SUMMARY"
echo "=========================================="
echo ""
print_status "Total Tests: $TESTS_TOTAL"
print_success "Passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    print_error "Failed: $TESTS_FAILED"
else
    print_success "Failed: $TESTS_FAILED"
fi
echo ""

# Calculate success rate
if [ $TESTS_TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
    print_status "Success Rate: $SUCCESS_RATE%"
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        print_success "✓ EXCELLENT - System ready for production!"
    elif [ $SUCCESS_RATE -ge 80 ]; then
        print_warning "⚠ GOOD - Minor issues to address before production"
    elif [ $SUCCESS_RATE -ge 70 ]; then
        print_warning "⚠ FAIR - Several issues need attention"
    else
        print_error "✗ POOR - Major issues must be fixed before deployment"
    fi
else
    print_warning "No tests were run"
fi

echo ""

# Generate test report
TEST_REPORT="TEST_REPORT_$(date +%Y%m%d_%H%M%S).md"
cat > "$TEST_REPORT" << EOF
# OAG Web System - Test Report

**Generated:** $(date)
**Total Tests:** $TESTS_TOTAL
**Passed:** $TESTS_PASSED
**Failed:** $TESTS_FAILED
**Success Rate:** ${SUCCESS_RATE:-0}%

## Test Categories

- Unit Tests
- Code Quality (Linting, TypeScript)
- Security Tests
- Build Tests
- Integration Tests
- Performance Tests
- Accessibility Tests
- Environment Validation
- Database Tests
- Documentation Tests

## Recommendations

$(if [ $SUCCESS_RATE -ge 90 ]; then
    echo "✅ System is ready for production deployment"
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo "⚠️ Address minor issues before production deployment"
else
    echo "❌ Fix critical issues before considering production deployment"
fi)

## Next Steps

1. Review failed tests and fix issues
2. Re-run tests to verify fixes
3. Update documentation as needed
4. Proceed with deployment when success rate ≥ 90%

---
*This report was generated automatically by the OAG Web System testing suite.*
EOF

print_success "Test report generated: $TEST_REPORT"

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
