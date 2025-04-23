# Done Is Better Development Diary - 50 First Dates

## v1.8.2 - Use Icon for Timestamp Display (2025-04-23T19:30:00+02:00)

### Summary
Replaced the text label "Created (UTC):" with the clock emoji "🕒" next to the card creation timestamp in the `Column` component for a more compact UI. Also fixed related JSX syntax errors identified during debugging.

### Key Changes
- Updated `src/app/components/Column.tsx` to use "🕒" before the timestamp.
- Corrected JSX structure within the `Draggable` and `Droppable` components.

### Status
- **🟢 BUILT & DEPLOYED:** UI change implemented, documented (`04_releasenotes.MD`), committed (`9a753db`), tagged (v1.8.2), and deployed successfully.
- **🟡 PENDING USER VERIFICATION:** User needs to confirm the icon display on production.
- **Definition of Done:** All steps completed except final user verification.

### Links
- **Deployment:** https://doneisbetter-nddvt8tom-narimato.vercel.app
- **Commit:** `9a753db`

**Project is stable and ready for the next task, pending user confirmation of this UI change.**

---
## v1.8.1 - Restore Full Kanban Board Functionality & Final Verification (2025-04-23T19:10:00+02:00)

### Summary
Restored the full Kanban board implementation in `KanbanBoard.tsx` that was temporarily commented out during debugging. This included re-enabling drag-and-drop functionality, fixing related TypeScript type errors (`onDragEnd`), and ensuring the `isReadOnly` prop correctly disabled interactions in the "All Cards" view.

### Key Changes
- Restored `KanbanBoard.tsx` component logic.
- Fixed `@hello-pangea/dnd` type errors for `onDragEnd`.
- Verified `isReadOnly` prop functionality in `KanbanBoard` and `Column` components.

### Status
- **🟢 COMPLETE & VERIFIED:** Logic restored, documented (`04_releasenotes.MD`), committed (`3baf685`), tagged (v1.8.1), deployed, and user confirmed full functionality on production.
- **Definition of Done:** All criteria met.

### Links
- **Deployment:** https://doneisbetter-lg9ecqm8y-narimato.vercel.app
- **Commit:** `3baf685`

**Project is stable and ready for the next task.**

---
## v1.7.3 - Revert Timestamp Format to ISO 8601 (2025-04-23T17:30:00+02:00)

### Summary
Reverted the display format for the card creation timestamp (`createdAt`) back to the raw UTC ISO 8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`). This aligns with the project's previously established standard (v0.8.1). The previous implementation used `toLocaleString()`, which has been removed.

### Key Changes
- Updated `src/app/components/Column.tsx` to render `card.createdAt` directly.
- Changed label to "Created (UTC):".

### Status
- **🟢 COMPLETE & VERIFIED:** Change implemented, documented (`04_releasenotes.MD`), committed (`a589156`), tagged (v1.7.3), deployed successfully, and user confirmed timestamp format (ISO 8601) is correct on production.
- **Definition of Done:** All criteria met.

### Links
- **Deployment:** https://doneisbetter-4uu7ku13n-narimato.vercel.app
- **Commit:** `a589156`

**Project is stable and ready for the next task.**

---
## v1.7.2 - Display Card Creation Time (2025-04-23T17:20:00+02:00)

### Summary
Added the creation timestamp (`createdAt`) to each card displayed on the Kanban board. This involved updating the frontend `Card` type, ensuring the Mongoose model static methods return the timestamp as an ISO string, and modifying the `Column` component to render the formatted time. Also resolved a related build error in `Column.tsx` caused by upstream type inconsistencies.

### Key Changes
- **Feature:** Card creation time is now visible on each card (formatted via `toLocaleString()`).
- **Types:** Added `createdAt: string` to `Card` interface in `types/card.ts`.
- **Model:** Updated `findCardsByUser` and `updateCardStatus` in `models/Card.ts` to return `createdAt` as ISO string.
- **Component:** Updated `Column.tsx` to display the `createdAt` value.
- **Fixes:** Resolved build error ("Unexpected token `section`") by fixing type propagation.

### Status
- **🟢 BUILT & DEPLOYED:** Feature implemented, documented, committed (cab6feb), tagged (v1.7.2), and deployed successfully.
- **🟡 PENDING USER VERIFICATION:** User needs to confirm timestamp display on production.
- **Definition of Done:** All steps completed except final user verification.

### Links
- **Deployment:** https://doneisbetter-r118rzk2y-narimato.vercel.app
- **Commit:** `cab6feb`

**Project is stable and ready for the next task, pending user confirmation of this feature.**

---
## v1.7.1 - Google Authentication & Fixes (2025-04-23T16:45:00+02:00)

### Summary
Successfully implemented Google Authentication using NextAuth.js, integrated user persistence with MongoDB, and updated server actions for user-specific card management. Resolved several build errors related to TypeScript types, path resolution, and production environment variables. The application now supports user login, and cards are associated with the logged-in user.

### Key Changes
- **Authentication:** Integrated NextAuth.js with Google Provider.
- **Database:** Added User model; updated Card model to link to User.
- **Server Actions:** Modified `createCard`, `updateCardStatus`, `getCards` to be user-aware and use MongoDB `_id`.
- **Session:** Implemented session provider and updated UI (`AuthButtons`, conditional rendering on `HomePage`).
- **Structure:** Moved DB connection and models to `src/lib` for better path resolution.
- **Fixes (v1.7.1):** Addressed build errors (`unknown` type for `_id`, path resolution, missing `NEXTAUTH_SECRET`), removed Mongoose index warnings.

### Status
- **🟢 COMPLETE & VERIFIED:** Feature implemented, documented, committed (0576569), tagged (v1.7.1), and deployed successfully.
- **🟢 TESTED:** User confirmed login/logout works as expected on production. Card loading and creation after login are functional.
- **Definition of Done:** All criteria met.

### Links
- **Deployment:** https://doneisbetter-cvypuh09x-narimato.vercel.app
- **Commit:** `0576569` (Specific commit hash for v1.7.1 fixes)

**Project is stable and ready for the next task.**

---

## Previous Development History (Cleaned)

### v1.7.0 - Google Authentication (Initial Implementation) - 2025-04-23T14:45:00+02:00
- Initial setup of NextAuth.js, Google Provider, User model, and session integration.
- Encountered build/runtime errors addressed in v1.7.1.

### v1.6.0 - MongoDB Integration - 2025-04-23T14:15:00+02:00
- Added MongoDB Atlas integration for persistent card storage using Mongoose.
- Implemented connection management (`src/lib/db.ts`) and Card model (`src/lib/models/Card.ts`).
- Updated server actions to use the database.

### v1.5.0 - Drag-and-Drop Implementation - 2025-04-23T14:00:00+02:00
- Integrated `@hello-pangea/dnd` for card drag-and-drop.
- Added card reordering within columns and status updates between columns.
- Implemented optimistic UI updates and toast notifications.

### v1.4.0 - Kanban Board Implementation - 2025-04-23T13:00:00+02:00
- Created `Column` and `KanbanBoard` components.
- Implemented 3-column layout (TODO, IN_PROGRESS, DONE).
- Added basic card status progression on click.

### v1.3.0 - Card Creation Functionality - 2025-04-23T11:35:00+02:00
- Implemented `Input` component and `createCard` server action.
- Added form validation, loading states, and client-side state management.

### v1.2.2 - TypeScript Build System Fix - 2025-04-22T09:15:00+02:00
- Resolved persistent build errors by cleaning repository state and rebuilding foundations.

*(Older history omitted for brevity)*

---

## Project Status (as of v1.7.1)
- **Core Features:** Kanban board (Add, View, DnD Move/Reorder), User Authentication (Google), MongoDB Persistence.
- **Technology:** Next.js 14.0.4 (App Router), React 18, TypeScript, MongoDB/Mongoose, NextAuth.js, `@hello-pangea/dnd`, Tailwind CSS.
- **Deployment:** Vercel CI/CD operational.

### Next Steps / Future Considerations
- Card Editing Functionality
- Card Deletion Functionality
- Search/Filtering
- UI/UX Refinements (e.g., visual confirmation on DnD, more card details)
- Testing (Unit, Integration, E2E)

