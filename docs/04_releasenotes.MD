# Release Notes

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

# Release Notes

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
- Implemented persistence for card reordering *within* columns (using `@dnd-kit` at the time).
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

## v0.1.0 - Initial Release (2025-04-12T08:48:00.000Z)

### Features
- Single line input field implementation
- MongoDB integration
- Basic card display
- Production deployment

### Technical Details
- Next.js 15.3.0 setup
- MongoDB connection with Mongoose
- CSS Modules for styling
- Vercel deployment configuration

### Known Issues
- Basic styling implementation
- Limited error handling
- No data pagination

### Dependencies
- next: 15.3.0
- react: 19
- react-dom: 19
- mongodb: latest
- mongoose: latest

### Environment Variables
- MONGODB_URI: MongoDB connection string

### Deployment
- Platform: Vercel
- URL: https://doneisbetter-rfuj3dwjs-narimato.vercel.app
- Platform: Vercel
- URL: https://doneisbetter-gqvjmpqp0-narimato.vercel.app
