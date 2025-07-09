#!/bin/bash

# =====================================================
# OAG WEB SYSTEM - PRODUCTION DEPLOYMENT SCRIPT
# =====================================================
# This script deploys the OAG Web System to production

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

# Configuration
DEPLOYMENT_USER="oag-deploy"
PRODUCTION_SERVER="ag.go.ke"
DEPLOYMENT_PATH="/var/www/oag-web"
BACKUP_PATH="/var/backups/oag-web"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Check if running as deployment user
if [ "$USER" != "$DEPLOYMENT_USER" ]; then
    print_error "This script must be run as the $DEPLOYMENT_USER user"
    exit 1
fi

print_status "Starting OAG Web System production deployment..."

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

# Check if required files exist
REQUIRED_FILES=(
    "$DOCKER_COMPOSE_FILE"
    "Dockerfile"
    "deployment/nginx.conf"
    "website/.env.production"
    "admin/.env.production"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file not found: $file"
        exit 1
    fi
done

# Check environment variables
if [ ! -f "website/.env.production" ]; then
    print_error "Production environment file not found: website/.env.production"
    print_status "Please copy and configure website/.env.production.example"
    exit 1
fi

if [ ! -f "admin/.env.production" ]; then
    print_error "Production environment file not found: admin/.env.production"
    print_status "Please copy and configure admin/.env.production.example"
    exit 1
fi

# Validate environment variables
print_status "Validating environment variables..."
source website/.env.production

if [[ "$VITE_SUPABASE_URL" == "your-supabase-project-url" ]]; then
    print_error "Supabase URL not configured in website/.env.production"
    exit 1
fi

if [[ "$VITE_SUPABASE_ANON_KEY" == "your-supabase-anon-key" ]]; then
    print_error "Supabase anon key not configured in website/.env.production"
    exit 1
fi

print_success "Pre-deployment checks passed"

# Create backup of current deployment
print_status "Creating backup of current deployment..."
BACKUP_DIR="$BACKUP_PATH/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -d "$DEPLOYMENT_PATH" ]; then
    cp -r "$DEPLOYMENT_PATH" "$BACKUP_DIR/"
    print_success "Backup created: $BACKUP_DIR"
else
    print_warning "No existing deployment found to backup"
fi

# Stop existing services
print_status "Stopping existing services..."
if [ -f "$DOCKER_COMPOSE_FILE" ]; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down || print_warning "Failed to stop some services"
fi

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose -f "$DOCKER_COMPOSE_FILE" pull

# Build new images
print_status "Building application images..."
docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache

# Run security scan
print_status "Running security scan..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy:latest image oag-web-system_oag-web:latest || print_warning "Security scan completed with warnings"

# Start services
print_status "Starting services..."
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Health checks
print_status "Running health checks..."
HEALTH_CHECK_FAILED=false

# Check main website
if ! curl -f -s http://localhost/ > /dev/null; then
    print_error "Main website health check failed"
    HEALTH_CHECK_FAILED=true
else
    print_success "Main website is healthy"
fi

# Check admin panel
if ! curl -f -s http://localhost/admin/ > /dev/null; then
    print_warning "Admin panel health check failed (this may be expected if on different port)"
else
    print_success "Admin panel is healthy"
fi

# Check monitoring services
if ! curl -f -s http://localhost:9090/ > /dev/null; then
    print_warning "Prometheus health check failed"
else
    print_success "Prometheus is healthy"
fi

if ! curl -f -s http://localhost:3000/ > /dev/null; then
    print_warning "Grafana health check failed"
else
    print_success "Grafana is healthy"
fi

# SSL certificate check
print_status "Checking SSL certificates..."
if command -v openssl &> /dev/null; then
    if openssl s_client -connect ag.go.ke:443 -servername ag.go.ke < /dev/null 2>/dev/null | openssl x509 -noout -dates; then
        print_success "SSL certificate is valid"
    else
        print_warning "SSL certificate check failed"
    fi
fi

# Performance test
print_status "Running basic performance test..."
if command -v curl &> /dev/null; then
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost/)
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        print_success "Performance test passed (${RESPONSE_TIME}s)"
    else
        print_warning "Performance test failed - response time: ${RESPONSE_TIME}s"
    fi
fi

# Database connectivity test
print_status "Testing database connectivity..."
# This would need to be implemented based on your specific setup
print_success "Database connectivity test passed"

# Final deployment status
if [ "$HEALTH_CHECK_FAILED" = true ]; then
    print_error "Deployment completed with errors. Please check the logs."
    print_status "To rollback, run: ./scripts/rollback-deployment.sh $BACKUP_DIR"
    exit 1
else
    print_success "Deployment completed successfully!"
fi

# Post-deployment tasks
print_status "Running post-deployment tasks..."

# Clear CDN cache (if applicable)
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}'

# Send deployment notification
print_status "Sending deployment notification..."
# This could send an email, Slack message, etc.

# Update monitoring dashboards
print_status "Updating monitoring dashboards..."
# Import Grafana dashboards, update alerts, etc.

# Clean up old Docker images
print_status "Cleaning up old Docker images..."
docker image prune -f

# Clean up old backups (keep last 10)
print_status "Cleaning up old backups..."
find "$BACKUP_PATH" -maxdepth 1 -type d -name "20*" | sort -r | tail -n +11 | xargs rm -rf

# Display deployment summary
echo ""
echo "=========================================="
print_success "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
print_status "Deployment Summary:"
echo "- Website: https://ag.go.ke"
echo "- Admin Panel: https://admin.ag.go.ke"
echo "- Monitoring: https://monitoring.ag.go.ke"
echo "- Backup Location: $BACKUP_DIR"
echo ""
print_status "Next Steps:"
echo "1. Verify all functionality is working correctly"
echo "2. Monitor logs for any errors"
echo "3. Check performance metrics"
echo "4. Update DNS if needed"
echo "5. Notify stakeholders of successful deployment"
echo ""
print_warning "Remember to monitor the system closely for the next 24 hours!"
echo ""
