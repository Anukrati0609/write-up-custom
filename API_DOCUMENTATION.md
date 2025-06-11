# API Documentation

## Database Setup

The API routes have been updated to automatically create Firestore collections if they don't exist. Here are the available endpoints:

## Setup & Admin Endpoints

### 1. Database Initialization
- **GET** `/api/setup` - Initialize database with all required collections
- **POST** `/api/setup` - Advanced setup options
  ```json
  {
    "action": "force_init" | "check_health"
  }
  ```

### 2. Admin Operations
- **GET** `/api/admin?action=stats` - Get database statistics
- **POST** `/api/admin` - Admin operations
  ```json
  {
    "action": "initialize" | "reset",
    "data": { "collections": ["users", "entries"] }
  }
  ```

## Authentication Endpoints

### 1. Google Sign In
- **POST** `/api/auth/google`
  ```json
  {
    "idToken": "firebase_id_token"
  }
  ```

### 2. Logout
- **POST** `/api/auth/logout`

## User Management

### 1. Get User Data
- **GET** `/api/user?userId=USER_ID`

## Entry Management

### 1. Submit Entry
- **POST** `/api/entries`
  ```json
  {
    "userId": "string",
    "fullName": "string",
    "year": "string",
    "branch": "string",
    "title": "string",
    "content": "string (1000-1500 words)"
  }
  ```

### 2. Get All Entries
- **GET** `/api/entries?userId=USER_ID` (optional, excludes user's own entry)

## Voting System

### 1. Cast Vote
- **POST** `/api/vote`
  ```json
  {
    "userId": "string",
    "entryId": "string"
  }
  ```

## Statistics

### 1. Get Competition Statistics
- **GET** `/api/statistics`
  Returns voting statistics, leaderboard, and competition metrics.

## Database Collections

The following Firestore collections are automatically created:

1. **users** - User profiles and authentication data
2. **entries** - Writing competition entries
3. **votes** - Vote tracking records
4. **settings** - Application configuration

## Initial Setup Instructions

1. First, run the setup endpoint to initialize the database:
   ```
   GET /api/setup
   ```

2. Check database health:
   ```
   POST /api/setup
   {
     "action": "check_health"
   }
   ```

3. View statistics:
   ```
   GET /api/statistics
   ```

## Environment Variables

For production, set up the following environment variable:
- `FIREBASE_SERVICE_ACCOUNT_KEY` - JSON string of Firebase service account key

## Error Handling

All endpoints include proper error handling and will return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing/invalid parameters)
- 404: Resource not found
- 500: Internal server error

## Collection Auto-Creation

Each endpoint automatically ensures required collections exist before performing operations. This eliminates the need for manual database setup.
