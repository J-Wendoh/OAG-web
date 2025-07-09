# OAG Web System - Comprehensive Testing Guide

## 🚀 Applications Running

Both applications are now running and ready for testing:

- **Website (Citizen Portal)**: http://localhost:5173
- **Admin Panel**: http://localhost:5174

## 📋 Pre-Testing Setup

### 1. Database Setup Required
⚠️ **Important**: Before testing, you need to set up Supabase:

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Create a new project
   - Note your Project URL and API Key

2. **Configure Environment Variables**:
   ```bash
   # Update admin/.env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   
   # Update website/.env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run Database Schema**:
   - Copy contents of `shared/database/schema.sql`
   - Paste into Supabase SQL Editor
   - Execute to create all tables and functions

4. **Create Storage Buckets**:
   - Create `complaint-attachments` bucket
   - Create `news-images` bucket
   - Create `hero-images` bucket

## 🧪 Testing Scenarios

### Phase 1: Website Testing (Citizen Portal)

#### Test 1: Hero Section (Dynamic Content)
**URL**: http://localhost:5173

**What to Test**:
- ✅ Hero section displays properly
- ✅ Background image loads
- ✅ Title and subtitle are visible
- ✅ Call-to-action button works
- ✅ Responsive design on mobile

**Expected Behavior**:
- If database is connected: Shows dynamic content from `hero_sections` table
- If database is not connected: Shows fallback content gracefully

#### Test 2: Complaint Submission
**URL**: http://localhost:5173/complaints

**Test Steps**:
1. Fill out complaint form:
   - First Name: "John"
   - Last Name: "Doe"
   - County: "Nairobi"
   - Subject: "Legal Aid Request"
   - Complaint: "I need assistance with a legal matter..."

2. Submit form

**Expected Results**:
- ✅ Form validates required fields
- ✅ Ticket ID is generated (format: COMPLAINT-YYYY-XXX)
- ✅ Access password is generated
- ✅ Success message shows ticket ID and password
- ✅ Complaint is saved to database

#### Test 3: Complaint Status Check
**URL**: http://localhost:5173/complaint-status

**Test Steps**:
1. Use ticket ID and password from Test 2
2. Enter credentials in status check form
3. Submit form

**Expected Results**:
- ✅ Form validates input
- ✅ Shows complaint details
- ✅ Displays current status (should be "pending")
- ✅ Shows submission date
- ✅ Shows status history (if any updates exist)

#### Test 4: News Section
**URL**: http://localhost:5173/news

**Expected Results**:
- ✅ Displays published news articles
- ✅ Shows featured articles prominently
- ✅ Categories filter works
- ✅ Article details page loads
- ✅ Responsive design

### Phase 2: Admin Panel Testing

#### Test 5: Admin Login
**URL**: http://localhost:5174

**Note**: You'll need to create an admin user through Supabase Auth dashboard first.

**Test Steps**:
1. Create user in Supabase Auth
2. Add user profile to `user_profiles` table
3. Login with credentials

**Expected Results**:
- ✅ Login form validates
- ✅ Authentication works
- ✅ Dashboard loads after login
- ✅ Role-based menu appears

#### Test 6: Hero Section Management
**URL**: http://localhost:5174/dashboard/hero-sections

**Test Steps**:
1. Click "Add Hero Section"
2. Fill form:
   - Title: "Welcome to OAG Kenya"
   - Subtitle: "Serving Justice"
   - Description: "We are committed to upholding the rule of law..."
   - Background Image: Upload or URL
   - CTA Text: "Learn More"
   - CTA Link: "/about"
   - Set as Active: ✅

3. Save hero section

**Expected Results**:
- ✅ Form validates properly
- ✅ Hero section is created
- ✅ Appears in hero sections list
- ✅ Active status is managed correctly
- ✅ Only one hero section can be active at a time

#### Test 7: Complaint Management
**URL**: http://localhost:5174/dashboard/complaints

**Test Steps**:
1. View complaints list
2. Click on complaint from Test 2
3. Update status to "in_progress"
4. Add resolution notes
5. Save changes

**Expected Results**:
- ✅ Complaints list displays properly
- ✅ Complaint details load
- ✅ Status can be updated
- ✅ Status history is tracked
- ✅ Changes are saved

#### Test 8: News Management
**URL**: http://localhost:5174/dashboard/news

**Test Steps**:
1. Click "Create News"
2. Fill form:
   - Title: "New Legal Aid Program Launched"
   - Category: "Legal Aid"
   - Content: "The Office of the Attorney General announces..."
   - Author: "Communications Team"
   - Status: "Published"
   - Featured: ✅

3. Save article

**Expected Results**:
- ✅ News article is created
- ✅ Appears in news list
- ✅ Featured articles are highlighted
- ✅ Published articles appear on website

### Phase 3: Integration Testing

#### Test 9: Hero Section Integration
**Test Steps**:
1. Create/update hero section in admin panel
2. Check website homepage
3. Verify changes appear immediately

**Expected Results**:
- ✅ Admin changes reflect on website
- ✅ Background images load properly
- ✅ CTA buttons work correctly

#### Test 10: Complaint Workflow
**Test Steps**:
1. Submit complaint on website (Test 2)
2. Check complaint in admin panel
3. Update status in admin
4. Check status on website (Test 3)

**Expected Results**:
- ✅ Complete workflow works end-to-end
- ✅ Status updates are reflected
- ✅ Timestamps are accurate
- ✅ Audit trail is maintained

#### Test 11: News Publication Workflow
**Test Steps**:
1. Create draft news in admin
2. Check it doesn't appear on website
3. Publish the news
4. Verify it appears on website

**Expected Results**:
- ✅ Draft articles are not public
- ✅ Published articles appear immediately
- ✅ Featured articles are prominently displayed

### Phase 4: Performance & Error Testing

#### Test 12: Database Connection Failure
**Test Steps**:
1. Temporarily disable database connection
2. Test website functionality

**Expected Results**:
- ✅ Website still loads
- ✅ Fallback content is shown
- ✅ No critical errors
- ✅ User experience remains good

#### Test 13: Form Validation
**Test Steps**:
1. Try submitting forms with invalid data
2. Test required field validation
3. Test email format validation

**Expected Results**:
- ✅ Proper error messages
- ✅ Form doesn't submit with invalid data
- ✅ User-friendly error handling

#### Test 14: Mobile Responsiveness
**Test Steps**:
1. Test on mobile devices/responsive mode
2. Check all major pages
3. Test form interactions

**Expected Results**:
- ✅ Mobile-friendly design
- ✅ Touch interactions work
- ✅ Content is readable
- ✅ Navigation is usable

## 🔍 Debugging Tips

### Common Issues & Solutions

1. **Database Connection Issues**:
   ```bash
   # Check environment variables
   cat admin/.env
   cat website/.env
   
   # Verify Supabase project is active
   ```

2. **Build Errors**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf admin/node_modules website/node_modules
   cd admin && npm install
   cd ../website && npm install
   ```

3. **Port Conflicts**:
   ```bash
   # Kill existing processes
   lsof -ti:5173 | xargs kill -9
   lsof -ti:5174 | xargs kill -9
   ```

### Browser Developer Tools

1. **Network Tab**: Check API calls
2. **Console**: Look for JavaScript errors
3. **Application Tab**: Check localStorage/sessionStorage
4. **Elements Tab**: Inspect responsive design

## 📊 Test Results Checklist

### Website (Citizen Portal)
- [ ] Hero section displays correctly
- [ ] Complaint form works
- [ ] Status check functions
- [ ] News section loads
- [ ] Mobile responsive
- [ ] Error handling works

### Admin Panel
- [ ] Login system works
- [ ] Hero section management
- [ ] Complaint management
- [ ] News management
- [ ] Role-based access
- [ ] Dashboard statistics

### Integration
- [ ] Real-time updates
- [ ] Cross-application sync
- [ ] Database consistency
- [ ] Performance acceptable

## 🎯 Success Criteria

**All tests pass when**:
- ✅ Citizens can submit complaints and check status
- ✅ Admin staff can manage content and complaints
- ✅ Hero sections update dynamically
- ✅ News articles publish correctly
- ✅ System handles errors gracefully
- ✅ Mobile experience is excellent
- ✅ Database operations are reliable

## 📞 Support

If you encounter issues during testing:

1. **Check the browser console** for JavaScript errors
2. **Verify environment variables** are set correctly
3. **Ensure Supabase project** is properly configured
4. **Check network connectivity** to Supabase
5. **Review database schema** is properly installed

---

**Happy Testing! 🚀**

The OAG Web System is now ready for comprehensive testing. Follow this guide systematically to ensure all features work as expected. 