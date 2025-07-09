# Vercel Environment Variables Setup

## Required Environment Variables for OAG Web System

To properly deploy the OAG Web System on Vercel, you need to set up the following environment variables in your Vercel project dashboard.

### 🔧 How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below with the appropriate values

### 📋 Required Variables

#### **Supabase Configuration (REQUIRED)**
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

#### **Application Settings**
```
NODE_ENV=production
VITE_APP_NAME=Office of the Attorney General
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
```

#### **API Configuration**
```
VITE_API_BASE_URL=
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif
```

#### **Storage Configuration**
```
VITE_STORAGE_BUCKET_ATTACHMENTS=complaint-attachments
VITE_STORAGE_BUCKET_NEWS_IMAGES=news-images
VITE_STORAGE_BUCKET_DOCUMENTS=documents
VITE_STORAGE_BUCKET_HERO_IMAGES=hero-images
VITE_STORAGE_BUCKET_PROFILE_PHOTOS=profile-photos
```

#### **Security & Performance**
```
VITE_SESSION_TIMEOUT=3600000
VITE_ENABLE_LOGGING=false
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
LOG_LEVEL=warn
```

### 🗄️ Setting Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Credentials**:
   - Go to **Settings** → **API**
   - Copy your **Project URL** (use for `VITE_SUPABASE_URL`)
   - Copy your **anon/public key** (use for `VITE_SUPABASE_ANON_KEY`)
   - Copy your **service_role key** (use for `VITE_SUPABASE_SERVICE_ROLE_KEY`)

3. **Set Up Database Tables**:
   - Go to **SQL Editor** in Supabase
   - Run the database schema setup (see database-schema.sql)

### 🚀 Deployment Steps

1. **Set Environment Variables** in Vercel dashboard
2. **Trigger Redeploy** in Vercel
3. **Verify Deployment** by checking:
   - Main website loads at your-domain.vercel.app
   - Admin panel loads at your-domain.vercel.app/admin
   - No 404 errors for assets
   - News functionality works (if Supabase is configured)

### 🔍 Troubleshooting

#### **404 Errors for Assets**
- Check that all image references use correct filenames
- Verify build process copies all assets correctly

#### **API Connection Errors**
- Ensure `VITE_API_BASE_URL` is empty (to use Supabase)
- Verify Supabase credentials are correct
- Check Supabase project is active and accessible

#### **Admin Panel Not Loading**
- Verify `/admin` path routing is working
- Check admin build completed successfully
- Ensure admin environment variables are set

### 📊 Expected Behavior After Setup

✅ **Working Features**:
- Main website loads instantly
- Slideshow displays with 5 slides
- Navigation works properly
- Court of arms image displays correctly
- News section shows placeholder or Supabase data
- Admin panel accessible at /admin

⚠️ **Features Requiring Supabase**:
- News import functionality
- Real-time news updates
- Complaint system
- User authentication
- Data persistence

### 🔗 Useful Links

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)
- [OAG Web System Repository](https://github.com/J-Wendoh/OAG-web)
