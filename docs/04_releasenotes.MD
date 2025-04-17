# Release Notes

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
