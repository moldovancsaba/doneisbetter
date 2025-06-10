# DoneIsBetter

## Project Overview
DoneIsBetter is a minimal, secure web application designed for submitting and managing personal short texts. It features SSO integration with Thanperfect for authentication, ensuring secure access to your content. The application combines modern web technologies with a clean, user-friendly interface to provide a seamless experience for text management.

## Current Development Status
Last updated: 2023-12-21T10:00:00.000Z

✅ Latest Updates:
- All core features are operational and tested
- SSO integration with Thanperfect is verified and working
- Recent bugfixes completed in UI components
- API endpoints are fully functional
- Performance optimizations implemented

## Dependencies and Requirements

### Tech Stack
- Next.js 15.3.3
- MongoDB (Atlas)
- Node.js (LTS version recommended)
- SSO authentication via Thanperfect

### Features
- SSO login using [thanperfect](https://thanperfect.vercel.app)
- MongoDB data store for persistent storage
- Text submission with identity verification
- Session-based access (10 minutes)
- Simple clean UI
- RESTful API endpoints for CRUD operations

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/moldovancsaba/doneisbetter.git
cd doneisbetter
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - For Vercel deployment, the following variables are required in `.env.vercel`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# MongoDB Configuration
MONGODB_URI="your_mongodb_connection_string"
MONGODB_CONNECT_TIMEOUT_MS="optional_connect_timeout"
MONGODB_INITIAL_RETRY_DELAY_MS="optional_retry_delay"
MONGODB_MAX_RETRIES="optional_max_retries"
MONGODB_MAX_RETRY_DELAY_MS="optional_max_retry_delay"
MONGODB_SOCKET_TIMEOUT_MS="optional_socket_timeout"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret"

# Feature Flags
NEXT_PUBLIC_DISABLE_CACHE="optional_cache_disable_flag"
NEXT_PUBLIC_FORCE_LOGIN="optional_force_login_flag"
```

NOTE: Never commit the actual values of these environment variables to version control. Use placeholder values in documentation and keep the real values secure.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Deployment Process

1. **Prerequisites**
   - Vercel account
   - MongoDB Atlas cluster
   - Environment variables configured

2. **Deployment Steps**
   a. Build the application:
   ```bash
   npm run build
   ```
   
   b. Deploy to Vercel:
   - The application is automatically deployed through Vercel's GitHub integration
   - Manual deployment can be done using Vercel CLI:
   ```bash
   vercel --prod
   ```

3. **Post-deployment**
   - Verify SSO integration is working
   - Confirm MongoDB connection
   - Test all API endpoints
   - Check session management

## API Routes
The following endpoints are available:
- `/api/auth` - Authentication
- `/api/create` - Create new entries
- `/api/delete` - Delete entries
- `/api/list` - List entries
- `/api/update` - Update existing entries
