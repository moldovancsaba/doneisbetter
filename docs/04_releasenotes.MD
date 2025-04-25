## [v1.15.0] - Admin Functions for All Cards View - 2025-04-25

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

