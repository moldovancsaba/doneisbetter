# Done Is Better Development Diary - 50 First Dates

**Current State**: 🟢 Persistent Reordering in Columns Implemented.
**Last Updated**: 2025-04-13
**Deployment**: https://doneisbetter-8elimlyoy-narimato.vercel.app
**Version**: v0.7.0

## Latest Development (v0.7.0)

### 2025-04-13: Persistent Reordering
- Added an `order` field to the `Card` schema in `actions.js`.
- Modified `createCard` to assign a default order (negative timestamp).
- Updated `getCards` to sort by the `order` field.
- Created a new server action `updateCardsOrder` that accepts an array of `{id, order}` updates and uses `bulkWrite` for database persistence.
- Modified the `handleDragEnd` function in `KanbanBoard.js` to call `updateCardsOrder` after successfully reordering items visually within the same column.
- Added error handling to revert the visual order change if the database update fails.
- Successfully deployed v0.7.0 to Vercel production.
## Latest Development (v0.6.0)

### 2025-04-13: Client-Side Reordering
- Updated `handleDragEnd` in `KanbanBoard.js` to differentiate between inter-column moves and intra-column reorders.
- Implemented visual reordering within columns using `arrayMove` from `@dnd-kit/sortable` upon dropping an item within the same column.
- This reordering is currently only visual and does not persist to the backend.
- Successfully deployed v0.6.0 to Vercel production.
## Latest Development (v0.5.0)

### 2025-04-13: Drag-and-Drop Implementation
- Installed `@dnd-kit` core, sortable, and utilities packages.
- Replaced swipe functionality (`react-swipeable`) with drag-and-drop.
- Configured `DndContext` in `KanbanBoard.js` with Pointer and Keyboard sensors.
- Implemented `handleDragEnd` logic in `KanbanBoard.js` for optimistic state updates and triggering the `updateCardStatus` server action.
- Modified `updateCardStatus` action to allow moving cards back to 'active' or other statuses.
- Made `Column.js` a droppable target using `useDroppable` and context provider using `SortableContext`.
- Made `CardItem.js` draggable using `useSortable`, removing all swipe-related code.
- Added CSS for visual feedback during drag operations.
- Implemented basic error handling for failed optimistic updates (attempting to revert visual state).
- Successfully deployed v0.5.0 to Vercel production.
## Latest Development (v0.4.0)

### 2025-04-13: Kanban Board Layout
- Updated `getCards` action to fetch all cards (not just 'active').
- Created `KanbanBoard.js` client component to manage state for 'Deleted', 'Active', and 'Done' columns.
- Created `Column.js` client component to render each column.
- Modified `CardItem.js` to call a new `onStatusUpdate` prop function upon successful swipe action.
- Updated `page.js` to use `KanbanBoard` instead of `CardList`.
- Added CSS Grid styles for the 3-column layout.
- Successfully deployed v0.4.0 to Vercel production.
## Latest Development (v0.3.0)

### 2025-04-13: Swipe Actions Implementation
- Added `react-swipeable` dependency.
- Updated `Card` schema in `actions.js` to include a `status` field ('active', 'done', 'deleted').
- Modified `getCards` action to only fetch 'active' cards.
- Created `updateCardStatus` server action to set 'done' or 'deleted' status.
- Refactored card display into client components: `CardList.js` (manages local state) and `CardItem.js` (handles swipe logic).
- Implemented swipe left (delete) and swipe right (done) gestures using `useSwipeable`.
- Added optimistic UI update: card is removed from the list immediately on swipe completion.
- Added visual feedback (background color change) during swipe.
- Successfully deployed v0.3.0 to Vercel production.
## Latest Development (v0.2.0)

### 2025-04-13: Input Field and Card Display
- Installed Mongoose for database interaction.
- Created MongoDB connection utility (`lib/db.js`).
- Implemented server actions (`createCard`, `getCards`) with error handling and revalidation.
- Developed client-side Input component (`components/Input.js`) with active/loading/error states and event handling (submit, escape, click outside).
- Updated main page (`app/page.js`) to use Input component, fetch cards via `getCards`, and display them in a list.
- Added basic CSS styling for layout, input, and cards, including dark mode support.
- Successfully deployed v0.2.0 to Vercel production.
## Latest Development (v0.1.0)

### 2025-04-12: Initial Implementation
- Created basic input field functionality
- Implemented MongoDB integration
- Added card display functionality
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
- Cards move between 'Deleted', 'Active', and 'Done' columns via drag-and-drop.
- Cards can be reordered within their columns, and the order persists.
- Optimistic UI updates for drag actions.
### Next Steps
- Add input animations
- Implement dark mode
- Enable search functionality

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

### Future Considerations
- User authentication
- Advanced card features
- Search functionality
- Analytics integration

