# Done Is Better ✍️

A minimalist Kanban-style task management application with Google Authentication and MongoDB integration.

**Status**: 🟢 Google Auth Integrated
**Version**: v1.7.1
**Live**: [doneisbetter-cvypuh09x-narimato.vercel.app](https://doneisbetter-cvypuh09x-narimato.vercel.app)

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/moldovancsaba/doneisbetter.git
    cd doneisbetter
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the following variables (get credentials from Google Cloud Console, MongoDB Atlas, and generate a secret):
    ```bash
    MONGODB_URI="your_mongodb_connection_string"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    NEXTAUTH_URL="http://localhost:3000" # For local development
    NEXTAUTH_SECRET="your_strong_secret_key" # Generate with: openssl rand -base64 32
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `src/app/`: Next.js application core (App Router)
    -   `layout.tsx` - Root layout (Server Component)
    -   `page.tsx` - Main application entry point (Client Component for interactivity)
    -   `actions.ts` - Server Actions for database operations (user-specific)
    -   `globals.css` - Global styles (Tailwind base)
    -   `api/auth/[...nextauth]/route.ts` - NextAuth.js API route handler
-   `src/components/`: React components
    -   `KanbanBoard.tsx` - Main board logic (Client)
    -   `Column.tsx` - Column rendering (Client)
    -   `Input.tsx` - New card input (Client)
    -   `AuthButtons.tsx` - Login/Logout UI (Client)
    -   `SessionProvider.tsx` - NextAuth session wrapper (Client)
    -   `Providers.tsx` - Wrapper for client-side providers (e.g., Toaster) (Client)
-   `src/lib/`: Shared utilities, configuration, and data models
    -   `db.ts` - MongoDB connection helper
    -   `authOptions.ts` - NextAuth.js configuration
    -   `models/User.ts` - Mongoose User schema/model
    -   `models/Card.ts` - Mongoose Card schema/model
-   `src/app/types/`: TypeScript type definitions
    -   `card.ts` - Types related to cards and columns
    -   `auth.ts` - Types related to NextAuth session/JWT
-   `docs/`: Project documentation (Roadmap, Dev Diary, Release Notes, Rules, etc.)
-   `public/`: Static assets
-   `package.json`: Dependencies and scripts
-   `next.config.js`: Next.js configuration
-   `postcss.config.js`, `tailwind.config.ts`: CSS processing configuration

## Tech Stack

-   **Framework:** Next.js 14.0.4 (App Router)
-   **Language:** TypeScript
-   **UI Library:** React 18
-   **Styling:** Tailwind CSS
-   **Database:** MongoDB with Mongoose
-   **Authentication:** NextAuth.js (v4) with Google Provider
-   **Drag-and-Drop:** `@hello-pangea/dnd`
-   **Notifications:** `react-hot-toast`
-   **Deployment:** Vercel
-   **Version Control:** Git / GitHub

## Features

-   User Authentication via Google Sign-In.
-   User-specific task management (cards belong to users).
-   Input field to add new task cards.
-   Cards stored persistently in MongoDB.
-   3-column Kanban layout ('TODO', 'IN_PROGRESS', 'DONE').
-   Drag-and-Drop cards between columns (updates status persistently).
-   Drag-and-Drop cards within columns to reorder (updates order persistently).
-   Toast notifications for card actions (creation, movement).
-   Basic error handling and loading states.
-   Responsive design.

## Environment Variables

The following environment variables are required. Create a `.env.local` file for local development. For production, configure these in your Vercel project settings.

-   `MONGODB_URI`: Your MongoDB connection string (e.g., from Atlas).
-   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
-   `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
-   `NEXTAUTH_URL`: The canonical URL of your deployment.
    -   Local Development: `http://localhost:3000`
    -   Production: Your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)
-   `NEXTAUTH_SECRET`: A strong secret key used to encrypt session tokens. Generate one using `openssl rand -base64 32`. **Required for production.**

## Authentication

Authentication is handled using NextAuth.js with the Google OAuth provider.
-   Users sign in via the Google button.
-   A User document is created/retrieved in MongoDB upon successful sign-in.
-   The user's MongoDB `_id` is stored in the session and used for all user-specific database operations.
-   Session state is managed using JWT strategy.

## Known Limitations

-   Requires Google OAuth credentials and MongoDB connection string setup.
-   Basic styling (functional, not heavily designed).
-   Limited error handling feedback in the UI (mostly console logs).
-   No card editing or deletion functionality yet.

## Documentation

### Project Documentation
- [Development Timeline](docs/05_50FirstDates.MD)
- [Release History](docs/04_releasenotes.MD)
- [Implementation Insights](docs/03_lessonslearned.MD)
- [Project Roadmap](docs/01_roadmap.MD)
- [Technical Details](docs/06_technology.MD)

### AI Development Guidelines
- [Definition of Done](docs/07_Definition_of_Done_AI_Warp.MD)
- [One Function Rule](docs/08_One_Function_At_A_Time_Rule.MD)
- [Autopilot Consent](docs/09_Autopilot_Consent_Project_Access.MD)
- [AI Knowledge Rules](docs/10_AI_Knowledge_Rules.MD)
- [AI Truthfulness](docs/11_AI_Truthfulness_and_Verification.MD)
- [Execution Protocol](docs/12_AI_Execution_Protocol.MD)
