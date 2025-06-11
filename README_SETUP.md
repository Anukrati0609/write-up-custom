# Matrix WriteItUp - Content Writing Competition

A modern, responsive web application for the Matrix WriteItUp content writing competition organized by Matrix JEC - the skill enhancement community of Jabalpur Engineering College.

## Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google accounts
- 📝 **Entry Submission** - Rich text editor for content submission (1000-1500 words)
- 🗳️ **Voting System** - One vote per user for other participants' entries
- 📊 **Real-time Updates** - Live vote counts and entry management
- 🎨 **Modern UI** - Beautiful, animated interface with gradient backgrounds
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔒 **Data Validation** - Server-side validation for all forms and submissions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with Google OAuth
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Rich Text Editor**: Tiptap
- **Icons**: React Icons

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth sign-in
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user?userId={userId}` - Get user profile and status

### Entries
- `POST /api/entries` - Submit new entry
- `GET /api/entries` - Get all entries (optionally filter by user)

### Voting
- `POST /api/vote` - Cast vote for an entry

## Database Schema

### Users Collection
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

### Entries Collection
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
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Business Rules

1. **One Entry Per User**: Each authenticated user can submit only one entry
2. **One Vote Per User**: Each user can vote for only one entry (not their own)
3. **Content Validation**: Entries must be between 1000-1500 words
4. **Authentication Required**: All actions require Google authentication
5. **Self-Voting Prevention**: Users cannot vote for their own entries

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd matrix-writeitup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication > Sign-in method > Google
4. Enable Firestore Database
5. Get your Firebase configuration from Project Settings

### 4. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Firestore Security Rules
Add these security rules to your Firestore database:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read entries, only authenticated users can create
    match /entries/{entryId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.auth.uid == resource.data.userId
        && !exists(/databases/$(database)/documents/users/$(request.auth.uid))
          .data.is_submitted;
      allow update: if request.auth != null;
    }
  }
}
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── google/route.js
│   │   │   └── logout/route.js
│   │   ├── entries/route.js
│   │   ├── user/route.js
│   │   └── vote/route.js
│   ├── entries/page.js
│   ├── register/page.js
│   └── layout.js
├── components/
│   ├── FormStep1.jsx
│   ├── FormStep2.jsx
│   ├── GoogleSignInButton.jsx
│   └── ...
├── config/
│   └── firebase.js
├── store/
│   └── useUserStore.js
└── middleware.js
```

## Key Components

- **useUserStore**: Zustand store managing authentication, user state, and API calls
- **GoogleSignInButton**: Handles Google OAuth authentication
- **FormStep1 & FormStep2**: Multi-step form for entry submission
- **API Routes**: Server-side endpoints for authentication, entries, and voting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [support@matrixjec.com] or create an issue in the repository.
