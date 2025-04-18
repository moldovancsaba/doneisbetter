# Done Is Better Development Diary - 50 First Dates

**Current State**: 🟢 Urbanist Font Integrated (via Standard CSS).
**Last Updated**: 2025-04-13T14:05:00.000Z
**Deployment**: https://doneisbetter-7yqr97f90-narimato.vercel.app
**Version**: v0.9.0

## Latest Development (v0.9.0)

### 2025-04-18T18:33:59.722546+02:00: Authentication Implementation Rollback
- Reverted to stable commit 9375766 (v1.1.1)
- Cleaned all auth-related changes
- Documented implementation challenges in LESSONS_LEARNED.md
- Successfully redeployed stable version

### 2025-04-18T18:28:22.943481+02:00: Successful Rollback
- Integrated Urbanist Google Font (Light 300, ExtraBold 800) using `next/font/google` and CSS variables.
- Styled main title `#DONEISBETTER` with specified weights.
- Encountered persistent, conflicting PostCSS/Tailwind build errors related to plugin configuration and utility class recognition (`font-light`).
- Resolved build errors by removing `@tailwind` directives from `globals.css` and applying font weights and styles via standard CSS selectors, effectively bypassing the problematic Tailwind processing layer for this feature. Manually created config files after `npx init` failed.
- Successfully built and deployed the application with the new font applied via standard CSS.

## Previous Development History

### 2025-04-13T11:07:00.000Z: Fix Card Timestamp Display (v0.8.2)
- Debugged and corrected structural errors in `CardItem.js` that were causing timestamps to display incorrectly (showing locale format instead of the intended raw ISO string).
- Confirmed the component now correctly renders the full UTC ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Finalized documentation updates with correct ISO 8601 timestamps.

## Previous Development History

### 2025-04-13T10:43:42.534Z: Drag-and-Drop Fix (@hello-pangea/dnd) (v0.8.0)
- Switched from non-functional `@dnd-kit` implementation to `@hello-pangea/dnd`.
- Refactored `KanbanBoard`, `Column`, `CardItem` components for the new library.
- Implemented `onDragEnd` logic for inter-column moves (status updates) and intra-column reorders (order updates).
- Corrected client-side hydration errors.
- Tested locally and deployed working DnD functionality.

### 2025-04-13T07:37:00.000Z: Persistent Reordering (v0.7.0)
- Added `order` field to `Card` schema.
- Updated `createCard` for default order, `getCards` to sort by order.
- Created `updateCardsOrder` action using `bulkWrite`.
- Integrated persistence call into `@dnd-kit` `handleDragEnd`.

### 2025-04-13T07:32:00.000Z: Client-Side Reordering (v0.6.0)
- Implemented visual-only reordering within columns using `arrayMove` (@dnd-kit).

### 2025-04-13T07:23:00.000Z: Drag-and-Drop Implementation (@dnd-kit Attempt) (v0.5.0)
- Attempted first DnD implementation using `@dnd-kit`. Encountered functional issues and client-side errors.

### 2025-04-13T07:13:00.000Z: Kanban Board Layout (v0.4.0)
- Implemented 3-column layout.
- Refactored card display using `KanbanBoard` and `Column` components.
- Modified `getCards` to fetch all cards for client-side sorting into columns.

### 2025-04-13T06:57:00.000Z: Swipe Actions Implementation (v0.3.0)
- Added `react-swipeable` for swipe-to-delete/done functionality.
- Added `status` field to schema and `updateCardStatus` action.
- Implemented optimistic UI updates.

### 2025-04-13T06:34:00.000Z: Input Field and Card Display (v0.2.0)
- Implemented core feature: Add card via input, save to DB, display list.
- Added Mongoose, DB connection utility, `createCard`/`getCards` actions.

### 2025-04-12T08:48:00.000Z: Initial Implementation & Setup (v0.1.0)
- Set up Next.js project (JavaScript, App Router).
- Resolved initial build/deployment challenges.
- Established core documentation structure.

## Project Status (as of v0.8.2)
- Core features (Add, View, Move via DnD, Reorder via DnD) implemented and persistent.
- Timestamps displayed in correct ISO 8601 format.
- Basic testing performed locally.
- Core documentation structure in place and updated.
- CI/CD via Vercel working.

### Current Architecture
- Next.js 15.3.0 (App Router)
- React 19
- MongoDB / Mongoose
- `@hello-pangea/dnd`
- CSS Modules / Global CSS

### Known Issues
- Basic styling only.
- Optimistic update reversal logic is basic.
- Order persistence is not updated when moving cards *between* columns (only status is updated).

### Future Considerations
- User authentication.
- Card editing functionality.
- Search/filtering.
- More robust error handling/feedback.
- UI/UX refinements.
- Address order update on inter-column moves.

# Done Is Better Development Diary - 50 First Dates

**Current State**: 🟢 Working Drag-and-Drop Kanban with Correct Timestamp Display.
**Last Updated**: 2025-04-13T11:07:00.000Z
**Deployment**: https://doneisbetter-aeidmp1k2-narimato.vercel.app
**Version**: v0.8.2

## Latest Development (v0.8.2)

### 2025-04-13T11:07:00.000Z: Fix Card Timestamp Display
- Debugged and corrected structural errors in `CardItem.js` that were causing timestamps to display incorrectly (showing locale format instead of the intended raw ISO string).
- Confirmed the component now correctly renders the full UTC ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Updated documentation timestamps throughout project files to ISO 8601 format.

## Previous Development History

### 2025-04-13T10:43:42.534Z: Drag-and-Drop Fix (@hello-pangea/dnd) (v0.8.0)
- Switched from non-functional `@dnd-kit` implementation to `@hello-pangea/dnd`.
- Refactored `KanbanBoard`, `Column`, `CardItem` components for the new library.
- Implemented `onDragEnd` logic for inter-column moves (status updates) and intra-column reorders (order updates).
- Corrected client-side hydration errors.
- Tested locally and deployed working DnD functionality.

### 2025-04-13T07:37:00.000Z: Persistent Reordering (v0.7.0)
- Added `order` field to `Card` schema.
- Updated `createCard` for default order, `getCards` to sort by order.
- Created `updateCardsOrder` action using `bulkWrite`.
- Integrated persistence call into `@dnd-kit` `handleDragEnd`.

### 2025-04-13T07:32:00.000Z: Client-Side Reordering (v0.6.0)
- Implemented visual-only reordering within columns using `arrayMove` (@dnd-kit).

### 2025-04-13T07:23:00.000Z: Drag-and-Drop Implementation (@dnd-kit Attempt) (v0.5.0)
- Attempted first DnD implementation using `@dnd-kit`. Encountered functional issues and client-side errors.

### 2025-04-13T07:13:00.000Z: Kanban Board Layout (v0.4.0)
- Implemented 3-column layout.
- Refactored card display using `KanbanBoard` and `Column` components.
- Modified `getCards` to fetch all cards for client-side sorting into columns.

### 2025-04-13T06:57:00.000Z: Swipe Actions Implementation (v0.3.0)
- Added `react-swipeable` for swipe-to-delete/done functionality.
- Added `status` field to schema and `updateCardStatus` action.
- Implemented optimistic UI updates.

### 2025-04-13T06:34:00.000Z: Input Field and Card Display (v0.2.0)
- Implemented core feature: Add card via input, save to DB, display list.
- Added Mongoose, DB connection utility, `createCard`/`getCards` actions.

### 2025-04-12T08:48:00.000Z: Initial Implementation & Setup (v0.1.0)
- Set up Next.js project (JavaScript, App Router).
- Resolved initial build/deployment challenges.
- Established core documentation structure.

## Project Status (as of v0.8.2)
- Core features (Add, View, Move via DnD, Reorder via DnD) implemented and persistent.
- Timestamps displayed in correct ISO 8601 format.
- Basic testing performed locally.
- Core documentation structure in place and updated.
- CI/CD via Vercel working.
### Current Architecture
- Next.js 15.3.0 (App Router)
- React 19
- MongoDB / Mongoose
- `@hello-pangea/dnd`
- Standard Global CSS (No active Tailwind processing via `@tailwind` directives)
- Google Fonts via `next/font/google` (Urbanist)

### Known Issues
### Known Issues
- Basic styling only.
- Optimistic update reversal logic is basic.
- Order persistence is not updated when moving cards *between* columns (only status is updated).

### Future Considerations
- User authentication.
- Card editing functionality.
- Search/filtering.
- More robust error handling/feedback.
- UI/UX refinements.
- Address order update on inter-column moves.
- Added `react-swipeable` dependency.
- Updated `Card` schema in `actions.js` to include a `status` field ('active', 'done', 'deleted').
- Created `updateCardStatus` server action to set 'done' or 'deleted' status.
- Refactored card display into client components: `CardList.js` (manages local state) and `CardItem.js` (handles swipe logic).
- Implemented swipe left (delete) and swipe right (done) gestures using `useSwipeable`.
- Added optimistic UI update: card is removed from the list immediately on swipe completion.
- Added visual feedback (background color change) during swipe.
- Successfully deployed v0.3.0 to Vercel production.
## Latest Development (v0.2.0)

### 2025-04-13T06:34:00.000Z: Input Field and Card Display // Keeping original estimate
- Installed Mongoose for database interaction.
- Created MongoDB connection utility (`lib/db.js`).
- Implemented server actions (`createCard`, `getCards`) with error handling and revalidation.
- Developed client-side Input component (`components/Input.js`) with active/loading/error states and event handling (submit, escape, click outside).
- Updated main page (`app/page.js`) to use Input component, fetch cards via `getCards`, and display them in a list.
- Added basic CSS styling for layout, input, and cards, including dark mode support.
- Successfully deployed v0.2.0 to Vercel production.
## Latest Development (v0.1.0)


### 2025-04-12T08:48:00.000Z: Initial Implementation // Keeping original estimate
- Created basic input field functionality
- Implemented MongoDB integration
- Deployed to Vercel

### Technical Implementation Details
- Next.js 15.3.0 setup
- MongoDB connection with Mongoose
- Basic CSS styling
- Error handling implementation

### Current Capabilities
- Text input with focus states
- MongoDB data persistence
- Newest-to-oldest display
- Production deployment
- Basic CSS styling and dark mode support
- Swipe left/right to mark cards as deleted/done. (Removed in v0.5.0)
- Cards can be reliably reordered within their columns, and the order persists.
- Optimistic UI updates for drag actions.
### Next Steps
- Add input animations
- Enable search functionality

## Project Status
## Project Status
- Core features implemented
- Basic testing in place
- Core documentation structure created
- CI/CD operational
### Current Architecture
- Next.js 15.3.0 with App Router
- React 19 for UI
- MongoDB for storage
- CSS Modules for styling

### Known Issues
- Basic styling only
- Optimistic updates lack robust error recovery (if server action fails after UI update).
- Reversal logic for failed optimistic updates is basic and might need refinement.
- Simple CRUD operations
- Order persistence is not updated when moving cards *between* columns (only status is updated).

### Future Considerations
- User authentication
- Advanced card features
- Search functionality
- Analytics integration

