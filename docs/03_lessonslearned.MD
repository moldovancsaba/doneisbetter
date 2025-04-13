# Done Is Better - Lessons Learned

## 📌 Project Context
All operations inside the following path:  
`/Users/moldovan/Projects/doneisbetter/`

Must always reference and stay in sync with the following documents:
- `README.MD`
- `01_roadmap.MD`
- `02_development.MD`
- `03_lessonslearned.MD`
- `04_releasenotes.MD`
- `05_50FirstDates.MD`
- `06_technology.MD`
- `07_Definition_of_Done_AI_Warp.MD`
- `08_One_Function_At_A_Time_Rule.MD`
- `09_Autopilot_Consent_Project_Access.MD`
- `10_AI_Knowledge_Rules.MD`
- `11_AI_Truthfulness_and_Verification.MD`
- `12_AI_Execution_Protocol.MD`

## 2025-04-13: Client-Side Reordering (v0.6.0)

### Handling Intra-Column Reordering with `@dnd-kit`
**Issue**: Differentiating between dropping a card into a different column vs. dropping it within the same column to reorder.
**Solution**:
1.  In `handleDragEnd`, compare the `activeColumnId` (derived from `findColumn(active.id)`) with the `overColumnId` (derived reliably from `over.data?.current?.sortable?.containerId || over.id`).
2.  If they are different, execute the inter-column move logic (update status, call server action).
3.  If they are the same, execute the intra-column reorder logic:
    *   Get the correct state array and setter (`getListAndSetter`).
    *   Find the `activeIndex` and `overIndex` using `findIndex` on the state array.
    *   Use `arrayMove` utility from `@dnd-kit/sortable` to update the local state array visually.
**Lesson**: The `onDragEnd` event provides `active` (dragged item) and `over` (drop target) information. To distinguish between moving columns and reordering within, check if the original container ID of the `active` item matches the final container ID derived from `over`. The `arrayMove` utility simplifies the state update for visual reordering. Note that persistence requires a separate step/action.

---

## 2025-04-13: Drag-and-Drop Implementation (v0.5.0)

### Library Integration: `@dnd-kit`
**Observation**: Integrating `@dnd-kit` requires understanding its core concepts: `DndContext` for overall setup, `sensors` for input methods, `useSortable` for individual items, and `useDroppable` for drop targets (columns). `SortableContext` is needed within droppable areas to manage sortable items.
**Solution**:
1. Wrapped the entire board in `DndContext` in `KanbanBoard.js`.
2. Used `useDroppable` in `Column.js` and passed its `id` to both `useDroppable` and `SortableContext`.
3. Used `useSortable` in `CardItem.js` with `card.id`.
4. Applied `transform`, `transition`, `listeners`, and `attributes` from `useSortable` to the `CardItem`'s wrapper div.
**Lesson**: `@dnd-kit` provides powerful primitives, but correct setup involves coordinating context providers (`DndContext`, `SortableContext`) and hooks (`useSortable`, `useDroppable`) across parent and child components. Carefully passing unique IDs is crucial.

### State Management for Drag-and-Drop
**Issue**: Handling both the optimistic UI update (moving the card visually immediately) and the asynchronous server action call, including potential failures and rollbacks.
**Solution**:
1. The `onDragEnd` handler in `KanbanBoard.js` performs the optimistic state update first (removing from the old list, adding to the new list).
2. It then calls the `updateCardStatus` server action asynchronously.
3. A basic `handleStatusUpdateReversal` function was added to attempt moving the card back visually if the server call fails (triggered in `.then()` error block or `.catch()`).
**Lesson**: Optimistic updates with drag-and-drop require careful state management. The client state changes first, then the server is notified. Implementing robust reversal logic for server failures is complex and needs careful consideration to avoid race conditions or inconsistent UI states, especially if items can be reordered within columns (though not implemented here).

---

## 2025-04-13: Kanban Layout Implementation (v0.4.0)

### Challenge: Managing Multiple Client-Side States from Server Data
**Issue**: Needed to display cards in three distinct columns ('Deleted', 'Active', 'Done') based on their status, manage moves between these columns client-side after server actions, using data initially fetched on the server.
**Solution**:
1.  Created a parent client component (`KanbanBoard.js`) responsible for managing the state of all three columns (`deletedCards`, `activeCards`, `doneCards`).
2.  Used `useEffect` within `KanbanBoard.js` to filter the `initialCards` prop (fetched server-side in `page.js`) into the appropriate column state arrays. This effect re-runs if `initialCards` changes (e.g., after adding a new card and the page revalidates).
3.  Implemented a handler function (`handleStatusUpdate`) in `KanbanBoard.js` that finds the card in any list, removes it, and adds it to the correct new list based on the `newStatus` received from `CardItem.js`.
**Lesson**: For complex UIs derived from server data but requiring interactive client-side state manipulation (like moving items between lists), a dedicated parent client component acting as a state manager is effective. It centralizes the logic for distributing and updating items based on actions triggered in child components.

### Refactoring for Reusability
**Observation**: The structure for displaying a list of cards within a column was repetitive.
**Solution**: Created a `Column.js` component that takes `title` and `cards` as props and renders the column structure, including mapping `cards` to `CardItem.js`. This simplified `KanbanBoard.js`.
**Lesson**: Identify repeating UI structures and extract them into reusable components to keep parent components cleaner and more focused on state management or layout orchestration.

---

## 2025-04-13: Swipe Action Implementation (v0.3.0)

### Challenge: Client-Side State Management for Server Data
**Issue**: Needed to implement swipe gestures and optimistic UI updates (removing a card visually before server confirmation) for data initially fetched on the server.
**Solution**:
1.  Refactored the card display logic from the server component (`page.js`) into client components (`CardList.js`, `CardItem.js`).
2.  Passed the initial server-fetched data (`initialCards`) as a prop to `CardList.js`.
3.  `CardList.js` initializes its own state (`cards`) with `initialCards` and manages this state for optimistic updates.
4.  `CardItem.js` receives a callback (`onSwipeComplete`) from `CardList.js` to notify it when a server action succeeds, allowing `CardList.js` to update its local `cards` state.
**Lesson**: For interactive lists with optimistic updates based on server data, fetch initial data server-side but manage the list's state client-side, passing the initial data as a prop.

### Best Practice: Optimistic UI Updates
**Observation**: Removing the card immediately from the UI upon swipe completion provides a much smoother user experience than waiting for the server action to complete.
**Solution**: The `onSwipeComplete` callback in `CardItem` triggers `setCards` in `CardList` *immediately* after the `updateCardStatus` server action promise resolves successfully.
**Lesson**: Implement optimistic UI updates for actions like deletion or status changes to improve perceived performance. Acknowledge the need for potential error recovery logic if the server action fails post-update.

### Tool Integration: `react-swipeable`
**Observation**: The `react-swipeable` library provided a straightforward way to implement swipe detection with necessary configurations (threshold, mouse tracking, scroll prevention).
**Lesson**: Leverage well-maintained libraries for common interaction patterns like swipe gestures to save development time and ensure robustness. Pay attention to configuration options like `preventScrollOnSwipe` and `touchAction` CSS for good mobile behavior.

---

## 2025-04-13: Core Functionality Implementation (v0.2.0)

### Challenge: Server Actions and Client Components
**Issue**: Managing state updates and error feedback between client components (`Input.js`) and server actions (`createCard`).
**Solution**:
1.  Server action (`createCard`) returns a serializable object `{ success: boolean, error?: string }`.
2.  Client component (`Input.js`) uses `await` to call the server action and checks the `result` object.
3.  Client component sets local state (`error`, `isLoading`) based on the server action's response.
4.  Used `revalidatePath('/')` in the server action to trigger data refresh on the page after successful creation.
**Lesson**: Server actions should return clear, serializable status/error information for client components to act upon. `revalidatePath` is crucial for updating server-rendered data after mutations.

### Challenge: MongoDB Connection Management
**Issue**: Ensuring the database connection is established reliably without redundant connections in a serverless context.
**Solution**: Implemented a connection utility (`lib/db.js`) that checks `mongoose.connection.readyState` before attempting a new connection. Included basic error handling and logging.
**Lesson**: A shared connection utility with state checking is essential for database interactions in serverless functions/actions.

### Best Practice: Data Serialization
**Observation**: Data fetched directly from Mongoose (`getCards`) needs to be serialized before being passed from server components/actions to client components. Dates and ObjectIds are common issues.
**Solution**: Used `.lean()` in the Mongoose query and explicitly converted `_id` to string and `createdAt` to ISO string format before returning from `getCards`.
**Lesson**: Always ensure data passed between server and client boundaries is serializable (plain objects, strings, numbers, etc.). Convert complex types like ObjectIds and Dates appropriately.

---

## 2025-04-12: Initial Setup and Deployment

### Challenge: Next.js Build Configuration
**Issue**: Initial Vercel deployment failed due to TypeScript and ESLint configurations.

**Solution**:
1. Simplified project structure:
   ```javascript
   // Removed unnecessary TypeScript and ESLint configs
   // Kept only essential files:
   - src/app/page.js
   - src/app/layout.js
   - src/app/globals.css
   ```

**Lesson**: Start with minimal configuration and add complexity incrementally.

### Challenge: MongoDB Integration
**Issue**: MongoDB connection management in serverless environment.

**Solution**:
1. Implemented connection pooling:
   ```javascript
   if (mongoose.connection.readyState === 1) {
     return mongoose.connection;
   }
   ```
2. Added proper error handling
3. Used environment variables for configuration

**Lesson**: Always implement connection pooling in serverless environments.

### Challenge: CSS Module Integration
**Issue**: Initial styling approach with Tailwind caused build issues.

**Solution**:
1. Switched to CSS Modules for simplicity
2. Implemented basic, clean styling
3. Removed unnecessary PostCSS plugins

**Lesson**: Choose simpler styling solutions for initial implementations.

### Best Practices Discovered

#### 1. Project Structure
- Keep file structure flat and simple
- Use clear, descriptive file names
- Separate concerns appropriately

#### 2. Error Handling
- Implement try-catch blocks consistently
- Log errors with proper context
- Provide user-friendly error messages

#### 3. State Management
- Use React hooks effectively
- Implement proper loading states
- Handle edge cases explicitly

#### 4. Development Workflow
- Regular commits with clear messages
- Test deployments before pushing to production
- Document changes immediately

### Future Considerations

#### 1. Performance Optimization
- Implement MongoDB query caching
- Add proper indexing
- Optimize component rendering

#### 2. User Experience
- Add more interactive feedback
- Improve loading states
- Enhance error messages

#### 3. Code Quality
- Consider TypeScript migration
- Add comprehensive testing
- Implement stricter validation

### Security Considerations

#### 1. Database Security
- Proper environment variable management
- Input validation and sanitization
- Connection string security

#### 2. API Security
- Rate limiting implementation
- Request validation
- Error message sanitization

### Documentation Updates

#### 1. Required Documentation
- Keep README.md updated
- Maintain clear API documentation
- Document all environment variables

#### 2. Development Guides
- Setup instructions
- Deployment process
- Troubleshooting guide

### Deployment Process

#### 1. Vercel Deployment
- Environment variable configuration
- Build process optimization
- Error monitoring setup

#### 2. MongoDB Setup
- Connection string management
- Database access control
- Backup strategy

### Testing Strategy

#### 1. Current Approach
- Manual testing of core functionality
- Production deployment verification
- Database operation validation

#### 2. Future Improvements
- Add unit tests
- Implement E2E testing
- Add performance monitoring

## Rules for Future Development

1. **Code Quality**
   - Write clean, maintainable code
   - Follow consistent naming conventions
   - Add proper documentation

2. **Testing**
   - Test all new features thoroughly
   - Verify MongoDB operations
   - Check error handling

3. **Documentation**
   - Update docs with each change
   - Keep README current
   - Document all decisions

4. **Deployment**
   - Test locally before deployment
   - Verify environment variables
   - Monitor deployment logs

