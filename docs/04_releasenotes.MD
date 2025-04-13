# Release Notes

## v0.6.0 - Client-Side Column Reordering (2025-04-13)

### Features
- Added visual reordering of cards within the same column using drag-and-drop.
- Updated `KanbanBoard.js` `handleDragEnd` logic to detect same-column drops.
- Used `arrayMove` from `@dnd-kit/sortable` to update the local component state for visual reordering.

### Known Issues
- Reordering is currently client-side only and does not persist in the database. Order resets on page refresh.

## v0.5.0 - Drag-and-Drop Kanban Board (2025-04-13)

### Features
- Replaced swipe gestures with drag-and-drop functionality for moving cards between columns.
- Integrated `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` libraries.
- Updated `KanbanBoard.js` to use `DndContext` and handle `onDragEnd` events.
- Updated `Column.js` to act as a `droppable` area and provide `SortableContext`.
- Updated `CardItem.js` to use `useSortable` hook, removing swipe logic.
- Modified `updateCardStatus` server action to allow moving cards back to 'active' or any other valid status.
- Implemented optimistic updates for drag-and-drop actions (card moves visually immediately).
- Added basic error handling and visual reversal attempt if server update fails after optimistic move.
- Added CSS styles for draggable items and dragging state.

### Technical Details
- Utilized `@dnd-kit` sensors (Pointer, Keyboard) for interaction.
- State management for columns handled within `KanbanBoard.js`.
- `handleDragEnd` logic determines source/destination columns and triggers server action + optimistic UI update.

## v0.4.0 - Kanban Board Layout (2025-04-13)

### Features
- Implemented a 3-column Kanban-style layout ('Deleted', 'Active', 'Done').
- Cards now move between columns based on swipe actions (Left for 'Deleted', Right for 'Done').
- Modified `getCards` server action to fetch all cards, regardless of status.
- Introduced `KanbanBoard.js` client component to manage the state of cards across the three columns.
- Introduced `Column.js` client component to render each column and its cards.
- Updated `CardItem.js` to trigger a status update callback passed down from `KanbanBoard.js`.
- Refactored `page.js` to use `KanbanBoard.js`.
- Added CSS Grid styles for the 3-column layout.

### Technical Details
- Client-side state (`useState`, `useEffect` in `KanbanBoard.js`) is used to manage card positions based on status changes initiated by swipes.

## v0.3.0 - Swipe Actions for Cards (2025-04-13)

### Features
- Implemented swipe gestures on cards:
  - Swipe Left: Mark card as 'deleted' (hides from list).
  - Swipe Right: Mark card as 'done' (hides from list).
- Added `react-swipeable` library for gesture detection.
- Updated MongoDB schema (`status` field: 'active', 'done', 'deleted').
- Created `updateCardStatus` server action.
- Refactored card list rendering into client components (`CardList.js`, `CardItem.js`) to handle state and interactions.
- Implemented optimistic UI updates (card removed immediately on swipe).
- Added visual feedback during swipe (background color change).

### Technical Details
- `getCards` action now filters for `status: 'active'`.
- `CardItem.js` uses `useSwipeable` hook and manages swipe state.
- `CardList.js` manages the local card state for optimistic updates.

## v0.2.0 - Core Functionality (2025-04-13)

### Features
- Implemented input field for adding new cards.
- Added functionality to save cards to MongoDB via server actions.
- Display saved cards below the input, sorted newest first.
- Included basic styling and dark mode support via CSS.
- Added error handling for database operations and form submission.

### Technical Details
- Created `lib/db.js` for reusable MongoDB connection.
- Implemented `createCard` and `getCards` server actions in `app/actions.js`.
- Developed client-side `components/Input.js` with state management.
- Updated `app/page.js` to integrate components and fetch/display data.

## v0.1.0 - Initial Release (2025-04-12)

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
- URL: https://doneisbetter-kqr4i2fxb-narimato.vercel.app
