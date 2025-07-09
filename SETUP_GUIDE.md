# OAG Web System - Quick Setup Guide

## 🚀 Getting Started

### **Current Status**: Applications are running with placeholder configuration
- **Website**: http://localhost:5173 ✅
- **Admin Panel**: http://localhost:5174 ✅

## ⚠️ **Important**: Database Configuration Required

The applications are currently running with placeholder Supabase configuration. To enable full functionality, you need to set up a real Supabase project.

## 📋 **Step-by-Step Setup**

### **1. Create Supabase Project**
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `oag-web-system`
   - Database Password: (create a secure password)
   - Region: Choose closest to Kenya (e.g., Singapore)
6. Click "Create new project"

### **2. Get Your Credentials**
Once your project is created:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)

### **3. Update Environment Variables**

**For Website (`website/.env`):**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**For Admin Panel (`admin/.env`):**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **4. Set Up Database Schema**
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `shared/database/schema.sql`
3. Paste and run the SQL to create all tables

### **5. Set Up Storage Buckets**
1. Go to **Storage** in Supabase dashboard
2. Create these buckets:
   - `complaint-attachments` (public: false)
   - `news-images` (public: true)
   - `documents` (public: true)

### **6. Restart Applications**
After updating the environment variables:
```bash
# Stop both applications (Ctrl+C)
# Then restart them

# Terminal 1 - Website
cd website
npm run dev

# Terminal 2 - Admin Panel
cd admin
npm run dev
```

## 🧪 **Testing the Setup**

### **Verify Database Connection**
1. Open browser console (F12)
2. Look for Supabase configuration warnings
3. If properly configured, you should see no warnings

### **Test Basic Functionality**
1. **Website**: Try submitting a complaint
2. **Admin Panel**: Try logging in (you'll need to create an admin user)

### **Create Admin User**
Run this in Supabase SQL Editor:
```sql
-- Insert admin user (replace with your email)
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'admin@ag.go.ke',
  crypt('your-password-here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

## 📊 **What Works Without Database**

Even without proper database setup, you can still:
- ✅ View the website design and layout
- ✅ Test the responsive design
- ✅ Navigate between pages
- ✅ See the admin panel interface
- ✅ Test the multi-language functionality

## 🔧 **What Requires Database**

These features need proper Supabase setup:
- ❌ Complaint submission and tracking
- ❌ News management
- ❌ Hero section management
- ❌ Admin authentication
- ❌ File uploads
- ❌ Real-time updates

## 🆘 **Troubleshooting**

### **Common Issues**

1. **"Invalid URL" Error**
   - Check that your VITE_SUPABASE_URL is properly set
   - Ensure it starts with `https://`

2. **"Invalid API Key" Error**
   - Verify your VITE_SUPABASE_ANON_KEY is correct
   - Make sure there are no extra spaces

3. **Database Connection Fails**
   - Ensure you've run the database schema
   - Check that your project is not paused (free tier pauses after inactivity)

### **Get Help**
- Check the browser console for detailed error messages
- Refer to the comprehensive `TESTING_GUIDE.md` for detailed testing scenarios
- Review the `task-log.md` for implementation details

## 🎯 **Next Steps**

1. **Set up Supabase** (5-10 minutes)
2. **Run database schema** (2 minutes)
3. **Test core features** (follow `TESTING_GUIDE.md`)
4. **Deploy to production** (when ready)

---

*The system is fully functional once properly configured with Supabase!* 