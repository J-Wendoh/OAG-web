# OAG Web System - Production Deployment Guide

## News System Deployment Fix

This guide addresses the critical news functionality deployment issues on Vercel and provides a complete solution for production deployment.

## Issues Fixed

### 1. API Configuration
- **Problem**: News system was trying to fetch from localhost in production
- **Solution**: Created Vercel serverless API functions in `/api` directory
- **Files**: `website/api/news.ts`, `website/api/health.ts`, `website/api/news-import.ts`

### 2. Database Connection
- **Problem**: SQLite database doesn't work in Vercel's serverless environment
- **Solution**: Migrated to Supabase for production database
- **Configuration**: Updated API endpoints to use Supabase client

### 3. Environment Variables
- **Problem**: Missing production environment configuration
- **Solution**: Updated `.env.production` and Vercel configuration
- **Required Variables**:
  ```
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  ```

### 4. API Endpoints
- **Problem**: Hardcoded localhost URLs
- **Solution**: Dynamic API URL resolution based on environment
- **Implementation**: Updated `api-config.ts` to use current domain in production

### 5. News Import Process
- **Problem**: File-based news import doesn't work in serverless
- **Solution**: Created database initialization script and API endpoint
- **Files**: `scripts/init-production-news.js`, `website/api/news-import.ts`

## Deployment Steps

### 1. Environment Setup
1. Create a Supabase project at https://supabase.com
2. Set up the `news_articles` table with the following schema:
   ```sql
   CREATE TABLE news_articles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title_en TEXT NOT NULL,
     title_sw TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     excerpt_en TEXT,
     excerpt_sw TEXT,
     content_en TEXT NOT NULL,
     content_sw TEXT NOT NULL,
     featured_image_url TEXT,
     status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
     is_featured BOOLEAN DEFAULT false,
     author_id UUID,
     tags TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     published_at TIMESTAMP WITH TIME ZONE
   );
   ```

### 2. Vercel Configuration
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`

### 3. Build Configuration
- The system now uses `npm run build:production` which:
  1. Initializes news data in Supabase
  2. Builds the application for production
  3. Combines admin and main website builds

### 4. API Routes
The following API routes are now available in production:
- `GET /api/news` - Get all published news
- `GET /api/news?action=featured` - Get featured news
- `GET /api/news?action=search&q=term` - Search news
- `POST /api/news-import` - Initialize news data
- `GET /api/health` - Health check

## Testing Deployment

### 1. Health Check
Visit `https://your-domain.vercel.app/api/health` to verify:
- Database connection
- News articles count
- System status

### 2. News Functionality
1. Visit the main website
2. Check that news articles are displayed
3. Test search functionality
4. Verify featured articles appear

### 3. Admin Panel
1. Visit `https://your-domain.vercel.app/admin`
2. Test news management features
3. Verify API connectivity

## Troubleshooting

### News Not Loading
1. Check Vercel function logs
2. Verify Supabase connection
3. Ensure environment variables are set
4. Run health check endpoint

### API Errors
1. Check Vercel serverless function logs
2. Verify Supabase permissions
3. Test API endpoints directly

### Database Issues
1. Verify Supabase table schema
2. Check RLS (Row Level Security) policies
3. Ensure service role key has proper permissions

## Monitoring

### Performance
- Vercel Analytics for page performance
- Supabase dashboard for database metrics
- API response times via Vercel functions

### Errors
- Vercel function logs
- Browser console for client-side errors
- Supabase logs for database issues

## Maintenance

### News Updates
- Use admin panel for content management
- API endpoints handle CRUD operations
- Automatic bilingual content support

### System Updates
- Deploy via Git push to main branch
- Vercel automatically rebuilds and deploys
- Zero-downtime deployments

## Security

### API Security
- CORS enabled for frontend domain
- Environment variables secured in Vercel
- Supabase RLS policies for data protection

### Content Security
- Input validation on all API endpoints
- XSS protection headers
- Secure content delivery

## Next Steps

After successful news deployment, continue with:
1. SheriaBot OpenAI integration
2. Real-time notifications system
3. Admin role management
4. Enhanced slideshow features

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase dashboard
3. Test API endpoints individually
4. Verify environment configuration
