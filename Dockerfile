# =====================================================
# OAG WEB SYSTEM - PRODUCTION DOCKERFILE
# =====================================================
# Multi-stage build for optimal production image

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./
COPY website/package*.json ./website/
COPY admin/package*.json ./admin/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build applications using combined build script
RUN chmod +x scripts/build-combined.sh && ./scripts/build-combined.sh

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Copy combined build (website at root, admin at /admin)
COPY --from=builder /app/dist-combined /var/www/oag-web

# Copy nginx configuration
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx && \
    chown -R nginx:nginx /var/www/oag-web && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/www/oag-web

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose ports
EXPOSE 80 443

# Use non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
