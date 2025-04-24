# Release Notes

## v1.9.0 - Soft Delete Functionality (2025-04-24T08:30:00+02:00)

### Features
- **Soft Delete:** Implemented a soft delete mechanism for cards. Clicking the delete icon (🗑️) now marks a card as deleted (`isDeleted: true`, `deletedAt: Date`) instead of removing it permanently.
- **"Deleted" View:** Added a new "Deleted" view accessible via the header toggle, showing only soft-deleted cards for the current user, sorted by deletion date (newest first).
- **Delete Button:** Added a delete icon button to cards, visible and active only in the "My Cards" view.
- **Data Filtering:** Updated `getCards` and `getAllCards` actions to exclude soft-deleted cards from normal views.
- **Hard Delete (Future):** Schema includes `deletedAt` field, enabling future implementation of automatic hard deletion (e.g., via TTL index or scheduled job).

### Technical Implementation
- **Schema:** Added `isDeleted` (boolean) and `deletedAt` (Date) fields to `Card` model (`src/lib/models/Card.ts`) with appropriate indexes.
- **Server Actions:**
    - Created `softDeleteCard` action to mark cards as deleted for the authenticated user.
    - Created `getDeletedCards` action to fetch deleted cards for the authenticated user.
    - Updated `getCards` (via `findCardsByUser` in model) and `getAllCards` actions to filter by `isDeleted: { $ne: true }`.
- **Frontend (`page.tsx`):**
    - Added "Deleted" option to the view mode state and UI toggle.
    - Updated data fetching `useEffect` to call `getDeletedCards` for the "Deleted" view.
    - Added `handleCardDelete` function with optimistic UI update (filtering) and server action call.
    - Passed `handleCardDelete` prop down through `KanbanBoard` to `Column`.
    - Reused `KanbanBoard` component (in read-only mode) to display deleted cards.
- **Component (`Column.tsx`):**
    - Added conditional delete button with `onClick` handler calling `onCardDelete` prop.
- **Dependencies & Build:** Reinstalled `@hello-pangea/dnd`; downgraded Next.js to `14.0.4` and aligned React types to resolve persistent build errors.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-24T08:30:00+02:00
## v1.8.3 - Display User Info on "All Cards" View (2025-04-23T19:50:00+02:00)

### UI Change
- **User Identification:** Added user avatar (if available) and username to cards displayed in the "All Cards" view. This helps identify the owner of each card in the global view.
- **Conditional Display:** User information is only shown when the board is in "All Cards" mode (read-only).

### Technical Implementation
- Updated `getAllCards` server action to use Mongoose `.populate()` to fetch user `name` and `image` for each card.
- Updated frontend `Card` type (`src/app/types/card.ts`) to include optional `userName` and `userImage` fields.
- Updated `Column.tsx` component to conditionally render user avatar and name based on the `isReadOnly` prop and availability of user data.
- Resolved related build errors by correcting Mongoose type assertions and JSX structure after extensive debugging.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T19:50:00+02:00
## v1.8.2 - Use Icon for Timestamp Display (2025-04-23T19:30:00+02:00)

### UI Change
- **Timestamp Icon:** Replaced the text label "Created (UTC):" with the clock emoji "🕒" for the card creation timestamp display, improving visual compactness.

### Technical Implementation
- Updated the rendering logic within the `<small>` tag in `src/app/components/Column.tsx`.
- Fixed related JSX syntax errors identified during implementation and debugging of previous build errors.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T19:30:00+02:00
## v1.8.1 - Restore Full Kanban Board Functionality & Final Verification (2025-04-23T19:10:00+02:00)

### Fixes & Completion
- **Kanban Logic:** Restored full Kanban board implementation in `KanbanBoard.tsx` that was temporarily commented out during debugging.
- **Drag-and-Drop:** Restored and verified full drag-and-drop functionality with proper read-only mode handling.
- **Type Safety:** Resolved TypeScript issues with `@hello-pangea/dnd` event handlers (`onDragEnd`).
- **Functionality Verified:** User confirmed all Kanban features (drag, status changes, reordering) and read-only mode work correctly on production.

### Technical Implementation
- Restored original `KanbanBoard` component logic.
- Corrected `onDragEnd` type handling.

### User Verification
- Passed: User verified all intended functionality on deployment `https://doneisbetter-lg9ecqm8y-narimato.vercel.app`.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T19:10:00+02:00
## v1.8.0 - "View All Cards" Admin/Debug Feature (2025-04-23T18:30:00+02:00)

### Features
- **View All Cards:** Added an option to toggle between viewing only the current user's cards ("My Cards") and viewing all cards created by all users ("All Cards").
- **Server Action:** Introduced `getAllCards` server action in `src/lib/actions.ts` which fetches all cards without user filtering. (Note: This function currently lacks authorization controls and should only be used for admin/debug scenarios.)
- **Frontend Toggle:** Implemented toggle UI in `page.tsx` to switch view modes. Default is "My Cards".
- **Read-only Mode:** In "All Cards" view, drag-and-drop, card creation, and card actions are disabled for data integrity and security.

### Technical Implementation
- Updated `KanbanBoard` and `Column` components to use an `isReadOnly` prop for disabling interactions.
- Updated data fetching logic in `page.tsx` to use `getCards` or `getAllCards` per the active mode.
- Updated PropTypes/types and fixed build errors related to Draggable/Droppable structure.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T18:30:00+02:00
## v1.7.3 - Revert Timestamp Format to ISO 8601 (2025-04-23T17:25:00+02:00)

### Changes
- **Timestamp Format:** Changed the displayed `createdAt` timestamp on cards back to the raw UTC ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`) to align with the project's previously established standard (v0.8.1). Removed `toLocaleString()` formatting for consistency.

### Technical Implementation
- Updated `Column.tsx` to render `card.createdAt` directly without formatting.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T17:25:00+02:00
## v1.7.2 - Display Card Creation Time (2025-04-23T17:15:00+02:00)

### Features
- **Timestamp Display:** Added the creation timestamp (`createdAt`) to each card displayed in the Kanban columns.
- **Formatting:** Timestamp is formatted using `toLocaleString()` for readability.

### Fixes
- **Type Synchronization:** Ensured the `createdAt` field (as ISO string) is correctly propagated from the database through server actions to the frontend `Card` type.
- **Build Resolution:** Resolved a build error ("Unexpected token `section`") in `Column.tsx` that was likely caused by upstream type inconsistencies related to `createdAt`. Fixed by correcting type handling in Mongoose model static methods.

### Technical Implementation
- Updated `Card` type in `src/app/types/card.ts` to include `createdAt: string`.
- Updated `CardModel` static methods (`findCardsByUser`, `updateCardStatus`) in `src/lib/models/Card.ts` to return `createdAt` as an ISO string and include missing `id`/`content` fields in `updateCardStatus` return object.
- Updated `Column.tsx` to render the `createdAt` field.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T17:15:00+02:00
## v1.7.1 - Fix Authentication Build Errors (2025-04-23T15:15:00+02:00)

### Fixes
- **Build Error:** Resolved TypeScript type errors (`Object is of type 'unknown'`) related to Mongoose `_id` field in NextAuth callbacks (`jwt`).
- **Type Handling:** Implemented defensive checks for MongoDB document IDs within `src/lib/authOptions.ts`.
- **Syntax Correction:** Fixed minor syntax errors in `authOptions.ts` and `types/auth.ts`.
- **Index Warnings:** Removed duplicate Mongoose index definitions in `User` model to resolve build warnings.

### Deployment
- **Platform:** Vercel
- **Deployment Date:** 2025-04-23T15:15:00+02:00
## v1.7.0 - Google Authentication (2025-04-23T14:45:00+02:00)

### Features
- **Google Login:** Implemented user authentication using Google OAuth via NextAuth.js.
- **User Persistence:** Added MongoDB User model to store user information.
- **Data Ownership:** Associated cards with specific users in the database.
- **Authenticated Actions:** Updated server actions (create, update, get cards) to be user-specific.
- **Session Management:** Integrated NextAuth session provider for frontend state.
- **UI Updates:** Added Login/Logout buttons and conditional rendering based on auth status.

### Technical Implementation
- **NextAuth.js Setup:**
  - Configured Google Provider with client ID/secret.
  - Implemented `signIn`, `session`, and `jwt` callbacks.
  - Created API route handler `src/app/api/auth/[...nextauth]/route.ts`.
  - Separated configuration into `src/lib/authOptions.ts`.
- **Database Integration:**
  - Created `User` model with Mongoose schema.
  - Updated `Card` model to include `user` reference.
  - Modified Card model static methods (`findCardsByUser`, `updateCardStatus`) to filter by user ID.
  - Ensured database connection is handled correctly.
- **Server Actions:**
  - Integrated `getServerSession` to fetch user session.
  - Added authentication checks to all actions.
  - Modified database queries to be user-specific.
- **Frontend:**
  - Created `AuthProvider` and `AuthButtons` components.
  - Updated `HomePage` to use `useSession` hook and manage UI based on authentication status.
  - Added loading states for authentication.
- **Project Structure:**
  - Moved database connection (`db.ts`) and models (`User.ts`, `Card.ts`) to `src/lib/` directory.
  - Updated all import paths to use `@/lib/...` aliases for better resolution.

### Deployment
- **Platform:** Vercel
- **Authentication:** NextAuth.js with Google Provider
- **Database:** MongoDB Atlas
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-23T14:45:00+02:00
## v1.6.0 - MongoDB Integration (2025-04-23T14:15:00+02:00)

### Features
- **Database Persistence:** Added MongoDB Atlas integration for persistent card storage
- **Server Actions:** Updated card operations to use database storage
- **Connection Management:** Implemented connection pooling and caching
- **Error Handling:** Added robust error handling for database operations
- **Type Safety:** Enhanced TypeScript type definitions throughout the data layer

### Technical Implementation
- **MongoDB Integration:**
  - Implemented secure connection handling with MongoDB Atlas
  - Added environment variable configuration for connection string
  - Created connection pooling to optimize performance
  - Implemented connection caching for development hot-reloading
- **Data Models:**
  - Created mongoose schema for Card model
  - Added proper indexes for efficient queries
  - Implemented data validation at the schema level
  - Separated database interface from application logic
- **Type Safety:**
  - Enhanced TypeScript definitions for MongoDB documents
  - Created proper interfaces for database operations
  - Fixed circular type references
  - Ensured strict type checking across server/client boundary

### Infrastructure
- **Environment Setup:**
  - Added .env.local configuration
  - Deployed MongoDB environment variables to Vercel
  - Implemented database connection rotation
  - Added database connection status monitoring

### Deployment
- **Platform:** Vercel
- **Database:** MongoDB Atlas
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-23T14:15:00+02:00
## v1.5.0 - Drag-and-Drop Implementation (2025-04-23T14:00:00+02:00)

### Features
- **Drag and Drop:** Implemented intuitive drag-and-drop for card movement between columns
- **Order Preservation:** Added ability to reorder cards within columns
- **Visual Feedback:** Enhanced UI with hover, active, and drag state indicators
- **Toast Notifications:** Added success and error notifications for card actions
- **Optimistic Updates:** Immediately update UI before server response for better UX
- **Error Recovery:** Added state recovery when server operations fail

### Technical Implementation
- **@hello-pangea/dnd Integration:**
  - Used DragDropContext, Droppable, and Draggable components
  - Implemented proper drag source/destination handling
  - Added keyboard accessibility for drag operations
- **State Management:**
  - Enhanced card ordering with explicit sort algorithm
  - Added card position tracking with order field
  - Implemented status and position-aware sorting
- **Client/Server Separation:**
  - Created dedicated Providers component for client-side features
  - Maintained server-rendered layout with client islands
  - Optimized component architecture for Next.js App Router
- **Error Handling:**
  - Added comprehensive try/catch blocks
  - Implemented state rollback on failed operations
  - Added contextual error notifications

### Accessibility Improvements
- **Keyboard Navigation:** Full keyboard support for drag operations
- **ARIA Attributes:** Enhanced screen reader support for drag context
- **State Announcements:** Added aria-live regions for dynamic updates
- **Focus Management:** Improved focus handling during drag operations
- **Semantic Structure:** Used proper HTML5 elements with role attributes

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-23T14:00:00+02:00
## v1.4.0 - Kanban Board Implementation (2025-04-23T13:00:00+02:00)

### Features
- **Kanban Board:** Implemented 3-column Kanban board layout (TODO, IN_PROGRESS, DONE)
- **Status Management:** Added ability to move cards between workflow stages
- **Visual Design:** Color-coded columns with customizable styling
- **Count Indicators:** Added card count badges for each column
- **Progressive Movement:** One-click progression through workflow stages
- **Responsive Layout:** Adapts to mobile, tablet, and desktop viewports
- **Empty States:** Added visual indicators for empty columns

### Technical Implementation
- **Component Architecture:**
  - Created reusable Column component for consistent column rendering
  - Implemented KanbanBoard component for layout management
  - Extended Card type with status field and column metadata
- **Status Handling:**
  - Added updateCardStatus server action for status changes
  - Implemented client-side state management for immediate updates
  - Added loading states during status transitions
- **TypeScript Improvements:**
  - Added CardStatus type for workflow statuses
  - Created ColumnData interface for column configuration
  - Enhanced type safety throughout components

### Accessibility Improvements
- **ARIA Attributes:** Enhanced screen reader support for Kanban layout
- **Keyboard Navigation:** Improved focus management and keyboard interactions
- **Status Announcements:** Added aria-live regions for dynamic updates
- **Semantic Structure:** Used proper HTML5 sectioning and heading hierarchy
- **Visual Indicators:** Added loading states with appropriate ARIA properties

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-23T13:00:00+02:00
## v1.3.0 - Card Creation Functionality (2025-04-23T11:35:00+02:00)

### Features
- **Task Creation:** Implemented ability to add new task cards
- **Form Validation:** Added client-side validation with error handling
- **Loading States:** Added visual feedback during task creation
- **State Management:** Implemented client-side state for immediate UI updates
- **Server Actions:** Used Next.js 14 server actions for form processing

### Technical Implementation
- Created Input component with proper TypeScript typing
- Implemented server action (createCard) for task processing
- Added client-side state management in the Home page component
- Used React hooks for form state and error handling
- Implemented proper error boundaries and loading states

### Accessibility Improvements
- Added ARIA attributes for form controls
- Implemented proper form labels and error messaging
- Added loading state indicators for screen readers
- Included keyboard navigation support
- Enhanced focus management during form interactions

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-23T11:35:00+02:00
## v1.2.2 - TypeScript Build System Fix (2025-04-22T09:15:00+02:00)

### Fixes
- **Build System:** Resolved TypeScript compilation errors preventing successful deployment
- **Type Definitions:** Implemented proper Card interface in TypeScript
- **Architecture:** Restructured components to follow Next.js 14 best practices
  - Created typed Card interface with proper JSDoc documentation
  - Implemented data layer with Card[] typing
  - Updated page component to use proper TypeScript definitions

### Technical Notes
- Addressed persistent caching issues in TypeScript compilation
- Rebuilt file structure to ensure clean type imports
- Implemented properly typed component hierarchy
- Added accessibility attributes to enhance user experience

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter.vercel.app
- **Deployment Date:** 2025-04-22T09:15:00+02:00
## v1.2.1 - UI Refinements (2025-04-20T15:29:00.000Z)

### Improvements
- **Viewport Utilization:** Optimized layout to maximize screen real estate
- **Full-Height Design:** Eliminated unnecessary scrolling with full viewport design
- **Equal Column Layout:** Ensured columns maintain equal proportions
- **Scrolling Improvements:**
  - Individual column scrolling for overflow content
  - Custom scrollbar styling for better UX
- **Responsive Behavior:** Improved mobile layout with appropriate height constraints

### Technical Notes
- Used CSS Flexbox for dynamic height distribution
- Applied viewport-based sizing for grid elements
- Optimized padding and spacing for denser information display
- Removed unused auth-related components and dependencies

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter-lhv9tfqm8-narimato.vercel.app
- **Deployment Date:** 2025-04-20T15:29:00.000Z

## v1.2.0 - Eisenhower Matrix Layout (2025-04-20T15:16:00.000Z)

### Features
- **Layout:** Implemented Eisenhower Matrix 2x2 grid layout
- **Columns:** Added 4th column (DECIDE) alongside the existing 3 columns
- **Schema:** Updated database schema to include 'decide' status type
- **Organization:**
  - Top Row: "DO" and "DECIDE" columns
  - Bottom Row: "DELEGATE" (renamed from "DELETED") and "DELETE" (renamed from "DONE")
- **Responsive:** Mobile-friendly adaptive layout

### Deployment
- **Platform:** Vercel
- **URL:** https://doneisbetter-1ye8pikh5-narimato.vercel.app
- **Deployment Date:** 2025-04-20T15:16:00.000Z

## v1.1.1 - File Casing Normalization (2025-04-18T13:17:21.935618+02:00)
### Fixes
- Normalized file casing for AI knowledge rules documentation
- Moved `10_AI_Knowledge_Rules.MD` to `docs/` folder
- Fixed potential case sensitivity issues in Git tracking

### Technical Notes
- Deleted old file `10_AI_Knowledge_Rules.md`
- Kept and committed new file `docs/10_AI_Knowledge_Rules.MD`
- Verified case sensitivity handling in git

### Deployment
- Platform: Vercel
- URL: https://doneisbetter-j6f2a3xuc-narimato.vercel.app

## ✅ Build Fix & Redeployment (2025-04-17T14:05)
- **Status:** Production deployment successful after resolving build errors.
- **Fixes:**
    - Removed problematic JSX comments from `src/components/Column.js` that caused build failures.
    - Removed custom font configuration from `src/app/layout.js` to resolve ESLint warnings.
- **URL:** https://doneisbetter-djkumc00a-narimato.vercel.app
- **Commit:** (Based on d6c036d with fixes)

## ✨ Dependency Updates & Cleanup (2025-04-17T14:50)
- **Status:** Dependencies updated to latest stable/LTS versions per `package.json`.
- **Packages Updated:** `@types/node`, `@types/react`, `autoprefixer`, `eslint`, `eslint-config-next`, `postcss`, `tailwindcss`, `typescript`.
- **Ignored:** React 19, Tailwind v4 (deferred for stability).
- **Deprecated:** No directly used deprecated packages found or added.
- **Cleanup:** Extraneous package `@emnapi/runtime` noted but ignored as non-blocking after multiple removal attempts failed.
- **Build:** Verified successful build with updated dependencies.
- **Next Step:** Ready for deployment or further development.

### Features & Fixes
- Integrated 'Urbanist' Google Font using `next/font/google`.
- Applied font weights: Light 300 for body text, ExtraBold 800 for headings/bold text.
- Implemented two-weight style for the main page title (`#DONEISBETTER`).
- Bypassed persistent PostCSS/Tailwind build errors by removing Tailwind directives (`@tailwind`) from `globals.css` and applying font styles using standard CSS classes and the `next/font` CSS variable (`--font-urbanist`).
- Manually created compatible `tailwind.config.js` and `postcss.config.js` after `npx init` failures.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-7yqr97f90-narimato.vercel.app

## v0.8.2 - Fix Card Timestamp Display (2025-04-13T11:07:00.000Z)

### Fixes
- Corrected syntax errors and component structure in `CardItem.js` that prevented the raw UTC ISO 8601 timestamp (`createdAt`) from being displayed correctly.
- Verified that the component now renders the full `YYYY-MM-DDTHH:mm:ss.sssZ` string as intended.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-aeidmp1k2-narimato.vercel.app

## v0.8.1 - Timestamp Format Verification (2025-04-13T11:03:23.917Z)

### Changes
- Verified card `createdAt` timestamps display in UTC ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Updated documentation timestamps to ISO 8601 format.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-gqvjmpqp0-narimato.vercel.app (No functional code change deployed)


## v0.8.0 - Working Drag-and-Drop (@hello-pangea/dnd) (2025-04-13T10:43:42.534Z)

### Features & Fixes
- Re-implemented drag-and-drop using `@hello-pangea/dnd`.
- Fixed previous DnD functional issues (from v0.5.0-v0.7.0).
- Enabled persistent drag-and-drop for column moves (status) and reordering (order).
- Uninstalled `@dnd-kit`.
### Technical Details
- Refactored components for `@hello-pangea/dnd`.
- Ensured client-only rendering for DnD context.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-gqvjmpqp0-narimato.vercel.app

## v0.7.0 - Persistent Column Reordering (2025-04-13T07:37:00.000Z)

### Features
- Implemented persistence for card reordering *within* columns (using `@dnd-kit`).
- Added `order` field to schema.
- Updated `createCard`, `getCards`, created `updateCardsOrder` action.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-8elimlyoy-narimato.vercel.app

## v0.6.0 - Client-Side Column Reordering (2025-04-13T07:32:00.000Z)

### Features
- Added visual reordering within columns using `@dnd-kit`.
### Known Issues (at time of release)
- Reordering was client-side only.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-rfuj3dwjs-narimato.vercel.app

## v0.5.0 - Drag-and-Drop Kanban Board (@dnd-kit Attempt) (2025-04-13T07:23:00.000Z)

### Features (Attempted)
- Replaced swipe with `@dnd-kit` drag-and-drop.
### Known Issues (at time of release)
- Drag-and-drop was non-functional due to client-side errors.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-kqr4i2fxb-narimato.vercel.app

## v0.4.0 - Kanban Board Layout (2025-04-13T07:13:00.000Z)

### Features
- Implemented 3-column layout.
- Cards moved between columns via *swipe* actions (pre-DnD).
- Refactored display into `KanbanBoard` and `Column` components.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-1hcbxr4x7-narimato.vercel.app

## v0.3.0 - Swipe Actions for Cards (2025-04-13T06:57:00.000Z)

### Features
- Implemented swipe left ('deleted') and swipe right ('done').
- Added `react-swipeable`.
- Updated schema with `status` field.
- Created `updateCardStatus` action.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-k4i92tiif-narimato.vercel.app

## v0.2.0 - Core Functionality (2025-04-13T06:34:00.000Z)

### Features
- Input field saves cards to MongoDB.
- Display saved cards, sorted newest first.
- Basic styling and error handling.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-n77pwfkpk-narimato.vercel.app

## v0.1.0 - Initial Release (2025-04-12T08:48:00.000Z)

### Features
- Basic Next.js project setup.
- Minimal input field (no persistence).
- Successful initial Vercel deployment.
### Deployment
- Platform: Vercel
- URL: https://doneisbetter-6o3vm7ng0-narimato.vercel.app
