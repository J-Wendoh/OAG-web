# OAG Web System

A comprehensive web system for the Office of the Attorney General (OAG) of Kenya, featuring a public-facing website and an administrative panel with a shared database backend.

## 🏗️ Architecture Overview

This project consists of two main applications sharing a common database and backend services:

### 📱 **Website** (`/website`)
- **Purpose**: Public-facing website for citizens
- **Features**: News display, complaint submission, information access
- **Technology**: React + TypeScript + Vite
- **Target Users**: General public, citizens

### 🔧 **Admin Panel** (`/admin`)
- **Purpose**: Administrative interface for OAG staff
- **Features**: News management, complaint handling, dashboard analytics
- **Technology**: React + TypeScript + Vite
- **Target Users**: OAG staff, administrators

### 🗄️ **Shared Backend** (`/shared`)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: WebSocket subscriptions
- **Storage**: File uploads and attachments
- **Authentication**: Role-based access control

## 📋 Features

### Website Features
- 📰 **News & Updates**: Latest news from the Attorney General's office
- 📝 **Complaint Submission**: Secure online complaint filing system
- 🔍 **Search**: Find relevant news and information
- 📱 **Responsive Design**: Mobile-friendly interface
- 🌐 **Multi-language Support**: English and Swahili

### Admin Panel Features
- 📊 **Dashboard**: Statistics and analytics overview
- 📝 **News Management**: Create, edit, and publish news articles
- 🎫 **Complaint Management**: Handle and track complaints
- 👥 **User Management**: Role-based access control
- 📈 **Analytics**: Track engagement and performance
- 🔔 **Real-time Notifications**: Live updates for new submissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OAG-web
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update the `.env` files in both `admin/` and `website/` directories

4. **Set up the database**
   - Copy the contents of `shared/database/schema.sql`
   - Run it in your Supabase SQL editor
   - Create storage buckets: `complaint-attachments`, `news-images`, `documents`

5. **Start the applications**
   ```bash
   # Terminal 1 - Admin Panel
   cd admin && npm run dev
   
   # Terminal 2 - Website
   cd website && npm run dev
   ```

## 📁 Project Structure

```
OAG-web/
├── admin/                 # Admin Panel Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── website/               # Public Website Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── shared/                # Shared Backend Services
│   ├── database/          # Database schema and migrations
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Shared utilities and API functions
├── docs/                  # Documentation
├── logs/                  # Application logs
├── task-log.md           # Development task tracking
├── dev-notes.md          # Technical implementation notes
├── file-tree.md          # Project structure documentation
└── setup.sh              # Setup script
```

## 🔐 Environment Configuration

### Admin Panel (.env)
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
VITE_APP_NAME=OAG Admin Panel
```

### Website (.env)
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=Office of the Attorney General
```

## 🗄️ Database Schema

The system uses a PostgreSQL database with the following main tables:

- **`news`**: News articles and updates
- **`complaints`**: Citizen complaints and submissions
- **`activity_logs`**: System activity and audit trail
- **`user_profiles`**: User accounts and roles

### Key Features
- ✅ Row Level Security (RLS) policies
- 🔄 Real-time subscriptions
- 📊 Performance indexes
- 🔐 Role-based access control

## 🔧 Development

### Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

### Code Style
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Conventional commits for version control

## 🧪 Testing

### Frontend Testing
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Database Testing
```bash
# Test database connection
npm run db:test

# Run migrations
npm run db:migrate
```

## 📊 Monitoring & Analytics

### Performance Monitoring
- Real-time performance metrics
- Error tracking and logging
- User engagement analytics

### Database Monitoring
- Query performance tracking
- Connection pool monitoring
- Storage usage analytics

## 🔒 Security

### Authentication
- Supabase Auth for user management
- JWT tokens for session management
- Role-based access control (RBAC)

### Data Security
- Row Level Security (RLS) policies
- Encrypted data transmission
- Secure file uploads

### Compliance
- GDPR compliance for data protection
- Audit trails for all activities
- Secure data retention policies

## 🚀 Deployment

### Production Deployment

1. **Build the applications**
   ```bash
   cd admin && npm run build
   cd ../website && npm run build
   ```

2. **Deploy to hosting service**
   - Vercel, Netlify, or AWS S3
   - Configure environment variables
   - Set up custom domains

3. **Configure Supabase**
   - Update production URLs
   - Set up backup policies
   - Configure monitoring

### CI/CD Pipeline
- GitHub Actions for automated deployment
- Automated testing before deployment
- Environment-specific configurations

## 📖 Documentation

- [`task-log.md`](./task-log.md) - Development task tracking
- [`dev-notes.md`](./dev-notes.md) - Technical implementation details
- [`file-tree.md`](./file-tree.md) - Project structure and relationships
- [`shared/database/schema.sql`](./shared/database/schema.sql) - Database schema

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Update documentation
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Document new features
- Follow conventional commits

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check Supabase credentials
npm run db:test

# Verify environment variables
cat admin/.env
cat website/.env
```

**Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Authentication Issues**
- Verify Supabase project settings
- Check RLS policies
- Ensure user roles are properly configured

## 📞 Support

For technical support or questions:
- **Email**: tech-support@ag.go.ke
- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues section

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Database and backend services by [Supabase](https://supabase.com/)
- UI components and styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)

---

**Office of the Attorney General - Kenya**  
*Building a transparent and accessible legal system* 