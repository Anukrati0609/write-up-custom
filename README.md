# Matrix WriteItUp - Content Writing Competition Platform

A comprehensive web platform for organizing and managing content writing competitions, built with Next.js and Firebase. This platform provides a complete solution for registration, submission, voting, and administration of writing competitions.

## 🎯 Project Overview

Matrix WriteItUp is a content writing competition platform developed for Matrix JEC - the skill enhancement community of Jabalpur Engineering College. It features user authentication, content submission, voting mechanisms, and administrative controls.

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zustand** - State management
- **Next Themes** - Theme management

### Backend & Database
- **Firebase Firestore** - NoSQL database
- **Firebase Admin SDK** - Server-side Firebase operations
- **Firebase Authentication** - User authentication
- **Google OAuth** - Social authentication

### Development Tools
- **ESLint** - Code linting
- **Vercel Edge Config** - Configuration management
- **Zod** - Schema validation
- **TipTap** - Rich text editor

## 📁 Project Structure

```
matrix-writeitup/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin management
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── entries/              # Entry management
│   │   ├── setup/                # Database setup
│   │   ├── statistics/           # Competition statistics
│   │   ├── timeline/             # Timeline management
│   │   ├── user/                 # User management
│   │   └── vote/                 # Voting system
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard
│   ├── entries/                  # Entries listing
│   ├── guidelines/               # Competition guidelines
│   └── register/                 # Registration page
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   ├── admin/                   # Admin-specific components
│   ├── backgrounds/             # Background effects
│   └── entries/                 # Entry-related components
├── config/                      # Configuration files
├── lib/                         # Utility functions
├── store/                       # State management
└── public/                      # Static assets
```

## 🔄 Application Flow

### User Journey
1. **Landing Page** - View submissions, vote for entries, check results
2. **About Page** - Rules, participation guidelines, voting instructions
3. **Registration** - Google Sign-in, profile completion, content submission
4. **Entries Page** - Browse all submissions, vote for favorites
5. **Guidelines** - Competition rules and submission guidelines

### Admin Journey
1. **Admin Login** - Secure authentication with session management
2. **Dashboard** - Overview of competition statistics
3. **Timeline Management** - Control competition phases
4. **Entry Management** - Review and moderate submissions
5. **User Management** - Monitor participants and voting

## 🛠 API Endpoints

### Authentication Endpoints

#### `/api/auth/google` (POST)
- **Purpose**: Handle Google OAuth authentication
- **Body**: `{ userDoc: { uid, email, displayName, photoURL } }`
- **Response**: User data with submission/voting status
- **Features**: Auto-creates user document, updates profile

#### `/api/auth/logout` (POST)
- **Purpose**: User logout
- **Response**: Success confirmation

#### `/api/auth/admin/login` (POST)
- **Purpose**: Admin authentication
- **Body**: `{ email, password }`
- **Response**: Admin session token (HTTP-only cookie)
- **Security**: SHA-256 password hashing, 24-hour sessions

#### `/api/auth/admin/register` (POST)
- **Purpose**: Admin registration
- **Body**: `{ email, password, secretKey }`
- **Response**: Admin profile with session
- **Security**: Requires secret key validation

#### `/api/auth/admin/logout` (POST)
- **Purpose**: Admin logout
- **Response**: Clears admin session cookie

#### `/api/auth/admin/validate` (GET)
- **Purpose**: Validate admin session
- **Response**: Admin profile or authentication error

### Entry Management

#### `/api/entries` (POST)
- **Purpose**: Submit new entry
- **Body**: `{ userId, fullName, year, branch, title, content }`
- **Validation**: User submission status, word count limits
- **Response**: Entry ID and success confirmation

#### `/api/entries` (GET)
- **Purpose**: Fetch entries
- **Query**: `userId` (optional)
- **Response**: List of approved entries with vote counts
- **Features**: Filters out pending/rejected entries

### Voting System

#### `/api/vote` (POST)
- **Purpose**: Vote for an entry
- **Body**: `{ userId, entryId }`
- **Validation**: Prevents self-voting, duplicate voting
- **Response**: Updated vote count

#### `/api/vote/unlike` (POST)
- **Purpose**: Remove vote
- **Body**: `{ userId, entryId }`
- **Response**: Updated vote count

### User Management

#### `/api/user` (GET)
- **Purpose**: Get user profile
- **Query**: `userId`
- **Response**: User data with submission/voting status

### Statistics & Analytics

#### `/api/statistics` (GET)
- **Purpose**: Competition statistics
- **Response**: 
  - Total entries, votes, users
  - Voting percentage
  - Leaderboard (top 10)
  - Complete entries list

### Timeline Management

#### `/api/timeline` (GET)
- **Purpose**: Get competition timeline
- **Response**: Phase dates and current status

#### `/api/timeline` (POST)
- **Purpose**: Update timeline (Admin only)
- **Body**: `{ timeline: { registrationStart, registrationEnd, ... } }`
- **Response**: Updated timeline

### Admin Management

#### `/api/admin` (GET)
- **Purpose**: Admin dashboard data
- **Query**: `action` (stats, entries, users)
- **Response**: Comprehensive admin statistics
- **Authentication**: Requires admin session

### Database Setup

#### `/api/setup` (GET)
- **Purpose**: Initialize database collections
- **Response**: Setup status and schema information
- **Collections**: users, entries, votes, settings, admins

## 🗄 Database Schema

### Collections Structure

#### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  is_submitted: boolean,
  is_voted: boolean,
  votedFor: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Entries Collection
```javascript
{
  id: string,
  userId: string,
  authorName: string,
  year: string,
  branch: string,
  title: string,
  content: string,
  votes: number,
  voters: string[],
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Votes Collection
```javascript
{
  id: string,
  userId: string,
  entryId: string,
  createdAt: timestamp
}
```

#### Admins Collection
```javascript
{
  email: string,
  passwordHash: string,
  role: string,
  sessionToken: string,
  sessionExpires: number,
  createdAt: timestamp,
  lastLogin: timestamp
}
```

#### Settings Collection
```javascript
{
  key: string,
  value: any,
  description: string
}
```

## 🔒 Security Features

### Authentication
- **Google OAuth** integration for users
- **Session-based authentication** for admins
- **HTTP-only cookies** for session management
- **Password hashing** with SHA-256
- **Session expiration** (24 hours)

### Authorization
- **Route protection** via middleware
- **Admin-only endpoints** validation
- **User ownership** verification for submissions
- **Anti-fraud measures** (self-voting prevention)

### Data Validation
- **Input sanitization** for all forms
- **Schema validation** with Zod
- **Word count limits** for submissions
- **Duplicate submission** prevention

## 🎮 Features

### User Features
- **Google Sign-in** authentication
- **Rich text editor** for submissions
- **Real-time voting** system
- **Responsive design** with dark/light themes
- **Entry browsing** with pagination
- **Statistics dashboard**

### Admin Features
- **Secure admin panel** with authentication
- **Timeline management** for competition phases
- **Entry moderation** system
- **User management** dashboard
- **Real-time statistics** and analytics
- **Competition settings** control

### Technical Features
- **Server-side rendering** with Next.js
- **Real-time data** with Firebase
- **Optimized performance** with caching
- **Mobile-responsive** design
- **SEO optimization**
- **Error handling** and logging

## 🌐 Environment Setup

### Required Environment Variables
```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_json
ADMIN_SECRET=your_admin_secret_key

# Vercel Configuration (optional)
EDGE_CONFIG=your_edge_config_token
```

### Firebase Setup
1. Create Firebase project
2. Enable Firestore Database
3. Enable Authentication (Google provider)
4. Generate service account key
5. Update configuration files

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd matrix-writeitup

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npm run setup-db

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Set up Edge Config for feature flags
4. Deploy with automatic builds

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy to your hosting platform
3. Configure environment variables
4. Set up domain and SSL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is part of Matrix JEC and is intended for educational and community purposes.

## 📞 Support

For support and queries, contact the Matrix JEC development team.
