#!/bin/bash

# OAG Web System Setup Script
# This script sets up the shared database system for both Admin Panel and Website

echo "🚀 Setting up OAG Web System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and npm."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies for admin panel
print_status "Installing dependencies for Admin Panel..."
cd admin
if npm install; then
    print_status "Admin Panel dependencies installed successfully"
else
    print_error "Failed to install Admin Panel dependencies"
    exit 1
fi

# Install dependencies for website
print_status "Installing dependencies for Website..."
cd ../website
if npm install; then
    print_status "Website dependencies installed successfully"
else
    print_error "Failed to install Website dependencies"
    exit 1
fi

cd ..

# Create environment files if they don't exist
print_status "Setting up environment files..."

if [ ! -f "admin/.env" ]; then
    cp admin/.env.example admin/.env
    print_status "Created admin/.env from template"
    print_warning "Please update admin/.env with your Supabase credentials"
else
    print_status "admin/.env already exists"
fi

if [ ! -f "website/.env" ]; then
    cp website/.env.example website/.env
    print_status "Created website/.env from template"
    print_warning "Please update website/.env with your Supabase credentials"
else
    print_status "website/.env already exists"
fi

# Create logs directory
mkdir -p logs
print_status "Created logs directory"

# Print setup completion message
echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Update the .env files in both admin/ and website/ directories with your Supabase credentials"
echo "3. Run the database schema:"
echo "   - Copy the contents of shared/database/schema.sql"
echo "   - Run it in your Supabase SQL editor"
echo "4. Create storage buckets in Supabase:"
echo "   - complaint-attachments"
echo "   - news-images"
echo "   - documents"
echo "5. Set up Row Level Security policies (already included in schema.sql)"
echo "6. Start the applications:"
echo "   - Admin Panel: cd admin && npm run dev"
echo "   - Website: cd website && npm run dev"
echo ""
echo "📚 Documentation:"
echo "- Project structure: file-tree.md"
echo "- Development notes: dev-notes.md"
echo "- Task tracking: task-log.md"
echo ""
echo "🔧 For help with Supabase setup, visit: https://supabase.com/docs"
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    print_status "Supabase CLI is installed"
    echo "💡 You can use 'supabase init' to initialize a local Supabase project"
else
    print_warning "Supabase CLI is not installed. Install it with: npm install -g supabase"
fi

echo "🎉 Happy coding!" 