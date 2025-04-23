# Release Notes

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
