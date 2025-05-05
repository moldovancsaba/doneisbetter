## [v1.17.1] - Complete Eisenhower Matrix Implementation - 2025-05-05

### Features
- **Eisenhower Matrix UI:** Added 2x2 grid layout showing task priorities by urgency and importance
- **Task Classification:** Tasks now include importance and urgency flags for quadrant placement
- **Layout Toggle:** Added toggle between traditional Kanban and Eisenhower Matrix views 
- **Visual Indicators:** Color-coded quadrants with descriptions of each priority level
- **Smart Input:** New task creation with importance/urgency toggles and quadrant preview
- **Adaptive Card Movement:** Cards moved between quadrants automatically update importance/urgency values

### Technical Implementation
- **Type-Safe MongoDB Integration:** Added helper utilities for type-safe document handling 
- **Responsive Grid Layout:** Implemented mobile-friendly 2x2 matrix grid using CSS Grid
- **Component Extensions:** Updated Input, KanbanBoard, and Column components to support both views
- **State Management:** Added layout mode state with URL persistence
- **Performance Optimization:** Improved document mapping to prevent excessive type conversions

### UI/UX Improvements
- **Quadrant Guide:** Added informational section explaining Eisenhower Matrix methodology
- **Toggle Switches:** Custom-styled importance and urgency toggle controls
- **Quadrant Preview:** Real-time preview of which quadrant a new task will be placed in
- **Visual Hierarchy:** Color-coded quadrants (red: urgent+important, purple: important, orange: urgent, gray: neither)

### Deployment
- **Commit:** `fix(types): add proper type safety for MongoDB documents`
- **Platform:** Vercel
- **URL:** `https://doneisbetter-9k9udqt02-narimato.vercel.app`
- **Deployment Date:** 2025-05-05

## [v1.17.0] - Eisenhower Matrix Data Model - 2025-05-05

### Features
- **Admin All Cards View:** Enhanced the "All Cards" view to be fully functional for administrators
- **Role-Based Access:** "All Cards" view button is now only visible to users with admin role
- **Full Functionality:** Administrators can now perform all card operations (move, edit, delete) in the "All Cards" view
- **Regular Users:** Non-admin users no longer see the "All Cards" option in view mode toggle

### Technical Implementation
- **Authentication:** Enhanced role-based access control in view mode selection
- **Component Logic:** Modified `page.tsx` to conditionally render "All Cards" button based on user role
- **Permissions:** Updated `KanbanBoard` component to enable full functionality for admins in "All Cards" view
- **Access Control:** Added role checks to prevent unauthorized access to "All Cards" view via URL manipulation

### Deployment
- **Commit:** `36046ee`
- **Platform:** Vercel
- **URL:** `https://doneisbetter-edsx5kmvl-narimato.vercel.app`
- **Deployment Date:** 2025-04-25

