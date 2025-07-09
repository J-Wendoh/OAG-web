# File Tree - OAG Web System

## Project Structure Overview

```
OAG-web/
├── admin/                          # Admin Panel Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Admin dashboard header
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   ├── Overview.tsx       # Dashboard overview
│   │   │   ├── NewsManagement.tsx # News CRUD operations
│   │   │   ├── ComplaintManagement.tsx # Complaint handling
│   │   │   └── ActivityLogs.tsx   # Admin activity tracking
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx    # Authentication management
│   │   │   └── DataContext.tsx    # Data state management
│   │   ├── hooks/
│   │   │   └── useAuth.tsx        # Authentication hook
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx    # Admin landing page
│   │   │   ├── LoginPage.tsx      # Admin login
│   │   │   └── Dashboard.tsx      # Main admin dashboard
│   │   ├── App.tsx                # Main admin app component
│   │   ├── main.tsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Dependencies & scripts
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── tsconfig.json              # TypeScript config
│
├── website/                        # Public Website Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx         # Website header
│   │   │   ├── Footer.tsx         # Website footer
│   │   │   ├── ComplaintSystem.tsx # Complaint submission
│   │   │   ├── SheriaBot.tsx      # Legal assistant bot
│   │   │   ├── HeroSection.tsx    # Homepage hero
│   │   │   ├── NewsSection.tsx    # News display
│   │   │   └── [Other UI components]
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Website homepage
│   │   │   ├── NewsPage.tsx       # News listing
│   │   │   ├── ServicesPage.tsx   # Services info
│   │   │   ├── ContactPage.tsx    # Contact information
│   │   │   ├── AboutPage.tsx      # About AG office
│   │   │   └── DepartmentsPage.tsx # Departments info
│   │   ├── i18n/                  # Internationalization
│   │   │   └── config.ts          # Language configuration
│   │   ├── App.tsx                # Main website app component
│   │   ├── main.tsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Dependencies & scripts
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── tsconfig.json              # TypeScript config
│
├── shared/                         # Shared Backend (To be created)
│   ├── database/
│   │   ├── schema.sql             # Database schema
│   │   └── migrations/            # Database migrations
│   ├── api/
│   │   ├── routes/
│   │   │   ├── news.ts            # News API endpoints
│   │   │   ├── complaints.ts      # Complaints API endpoints
│   │   │   └── auth.ts            # Authentication endpoints
│   │   ├── middleware/
│   │   │   ├── auth.ts            # Auth middleware
│   │   │   └── validation.ts      # Input validation
│   │   └── server.ts              # Express server setup
│   ├── utils/
│   │   ├── supabase.ts            # Supabase client
│   │   └── types.ts               # Shared type definitions
│   └── package.json               # Backend dependencies
│
├── task-log.md                     # Project task tracking
├── file-tree.md                    # This file
└── dev-notes.md                    # Technical implementation notes
```

---

## Component Relationships

### Admin Panel Flow
```
App.tsx
├── AuthProvider (Context)
├── DataProvider (Context)
├── Router
│   ├── LandingPage
│   ├── LoginPage
│   └── Dashboard
│       ├── Header
│       ├── Sidebar
│       └── Routes
│           ├── Overview
│           ├── NewsManagement
│           ├── ComplaintManagement
│           └── ActivityLogs
```

### Website Flow
```
App.tsx
├── i18n Configuration
├── Router
│   ├── Header
│   ├── Routes
│   │   ├── HomePage
│   │   ├── NewsPage
│   │   ├── ServicesPage
│   │   ├── ContactPage
│   │   ├── AboutPage
│   │   └── DepartmentsPage
│   ├── Footer
│   ├── ComplaintSystem (Global)
│   └── SheriaBot (Global)
```

---

## Data Flow Architecture

### Current State (Before Database Integration)
```
Admin Panel → Local State → No Persistence
Website → Hardcoded Data → No Persistence
ComplaintSystem → console.log → No Storage
```

### Target State (After Database Integration)
```
Admin Panel → Supabase Client → Database
     ↓
  Real-time Updates
     ↓
Website → Supabase Client → Database
     ↓
  Live Data Display
```

---

## File Size Analysis

### Admin Panel
- **Total Components**: ~12 files
- **Main App Logic**: ~1.3KB (App.tsx)
- **Authentication**: Role-based (AG, Communications, Complaint Handler)
- **Current Dependencies**: React Router, React Hook Form, Recharts, Quill

### Website
- **Total Components**: ~20 files
- **Main App Logic**: ~1.8KB (App.tsx)
- **Features**: Multilingual, Complaint System, Legal Bot
- **Current Dependencies**: React Router, Framer Motion, React i18next

### Shared Database (Planned)
- **Tables**: 3 core tables (news, complaints, activity_logs)
- **Features**: Real-time subscriptions, File storage, Row-level security
- **Technology**: Supabase (PostgreSQL + Real-time + Auth)

---

## Integration Points

### Database Connections
1. **Admin Panel**:
   - `NewsManagement` → `news` table
   - `ComplaintManagement` → `complaints` table
   - `ActivityLogs` → `activity_logs` table
   - `AuthContext` → `auth.users` table

2. **Website**:
   - `NewsPage` → `news` table (read-only)
   - `ComplaintSystem` → `complaints` table (write-only)
   - Real-time subscriptions for live updates

### API Endpoints (Planned)
```
/api/news
├── GET    /           # Get all published news
├── GET    /:id        # Get specific news article
├── POST   /           # Create new news (admin only)
├── PUT    /:id        # Update news (admin only)
└── DELETE /:id        # Delete news (admin only)

/api/complaints
├── GET    /           # Get all complaints (admin only)
├── GET    /:id        # Get specific complaint (admin only)
├── POST   /           # Submit new complaint (public)
└── PUT    /:id        # Update complaint status (admin only)

/api/auth
├── POST   /login      # Admin login
├── POST   /logout     # Admin logout
└── GET    /user       # Get current user
```

---

## Dependencies Overview

### Current Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **State**: React Context API
- **Forms**: React Hook Form (admin)
- **i18n**: React i18next (website)

### Required Additions
- **Database**: Supabase client
- **HTTP Client**: Axios or fetch wrapper
- **Real-time**: Supabase subscriptions
- **Validation**: Zod or similar
- **Error Handling**: React Error Boundary

---

## Security Considerations

### Authentication
- **Admin Panel**: Role-based access control
- **Website**: Public access with complaint submission
- **Database**: Row-level security policies

### Data Protection
- **Complaints**: Sensitive personal information
- **News**: Content moderation and approval workflow
- **Activity Logs**: Admin action tracking for accountability

---

## Performance Metrics

### Current Bundle Sizes
- **Admin Panel**: ~1MB (estimated)
- **Website**: ~1.2MB (estimated)
- **Shared**: TBD after backend integration

### Optimization Opportunities
- Code splitting by route
- Lazy loading of components
- Image optimization
- Database query optimization

---

## Future Expansion Areas

### Planned Modules
1. **Content Management**: Document storage and management
2. **House Data**: Property and housing information
3. **Legal Resources**: Case law and legal documents
4. **User Portal**: Citizen account management
5. **Analytics**: Usage and performance metrics

### Infrastructure Scaling
- CDN integration for static assets
- Database read replicas
- Caching strategies
- Load balancing considerations 