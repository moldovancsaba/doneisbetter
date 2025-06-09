# DoneIsBetter

## Project Overview
DoneIsBetter is a minimal, secure web application designed for submitting and managing personal short texts. It features SSO integration with Thanperfect for authentication, ensuring secure access to your content. The application combines modern web technologies with a clean, user-friendly interface to provide a seamless experience for text management.

## Current Development Status
Last updated: 2025-06-09T17:17:39.025828Z

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
   - Add the following required variables:
```env
MONGODB_URI="your_mongo_uri"
SSO_VALIDATE_URL="https://thanperfect.vercel.app/api/validate"
```

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
