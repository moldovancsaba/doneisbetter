# Done Is Better - Lessons Learned

## Google Authentication Implementation (v1.7.0 - v1.7.1) - 2025-04-23T16:45:00+02:00

### 1. Challenge: TypeScript & Mongoose Type Inference
**Issue:** TypeScript struggled to correctly infer the type of the `_id` field returned by Mongoose queries (e.g., `UserModel.findOne`), often treating it as `unknown`. This occurred specifically within NextAuth callbacks (`jwt`), causing build failures even when the `UserDocument` interface correctly defined `_id: mongoose.Types.ObjectId;`. Standard type annotations on the variable (`const dbUser: UserDocument | null = ...`) were insufficient.
**Solution:** A defensive runtime check was implemented within the `jwt` callback before accessing `_id.toString()`:
```typescript
if (dbUser && dbUser._id && typeof dbUser._id.toString === 'function') {
  token.dbUserId = dbUser._id.toString();
} else {
  // Log error or handle missing/invalid _id
}
```
**Lesson:** When complex library interactions (Mongoose + NextAuth + TypeScript) lead to persistent, seemingly incorrect type errors, resorting to runtime checks can be a pragmatic solution to unblock builds, although it sacrifices some compile-time safety. Understanding *why* type inference failed requires deeper investigation into Mongoose's type definitions or NextAuth's callback signatures.

### 2. Challenge: Next.js Path Resolution (Aliases vs. Relative Paths)
**Issue:** Consistent `Module not found` errors occurred when importing modules into the NextAuth API route (`src/app/api/auth/[...nextauth]/route.ts`) and server actions (`src/app/actions.ts`). Both path aliases (`@/app/...`, `@/lib/...`) defined in `tsconfig.json` and manually calculated relative paths (`../`, `../../`, `../../../`, `../../../../`) failed intermittently or consistently depending on the file location and build context.
**Solution:** Restructured the project to move shared logic (database connection, models) into a top-level `src/lib` directory. Imports were updated to use the `@/lib/...` alias. This structure proved more reliable for Next.js's build system across different file types (API routes, server actions, components).
**Lesson:** Next.js path resolution, especially involving aliases, can be sensitive within certain directories like `api/`. Centralizing shared utilities and models in a dedicated `src/lib` directory and using aliases consistently seems to be a more robust pattern for the App Router. Avoid overly complex relative path calculations.

### 3. Challenge: Missing `NEXTAUTH_SECRET` in Production
**Issue:** After deploying the authentication feature, login attempts resulted in a generic "Server error" message. Vercel logs revealed `[next-auth][error][NO_SECRET] Please define a \`secret\` in production.`
**Solution:** Generated a strong secret (`openssl rand -base64 32`) and added it as the `NEXTAUTH_SECRET` environment variable in the Vercel project settings for the **Production** environment. Redeployed the application.
**Lesson:** `NEXTAUTH_SECRET` is mandatory for production deployments to secure session tokens (especially when using JWT strategy). While `.env.local` works for development, production environment variables must be explicitly configured in the deployment platform (Vercel).

### 4. Challenge: User ID Management (Provider ID vs. Database ID)
**Issue:** Initial implementation stored the Google User ID (`token.sub` or `user.id` from the provider) in the session (`session.user.id`). Server actions then used this Google ID when querying the `Card` collection's `user` field, which expected a MongoDB `ObjectId`. This resulted in a `CastError: Cast to ObjectId failed...`.
**Solution:** Modified the NextAuth callbacks:
    - **`signIn`:** After finding or creating the user in the `User` collection, ensure the MongoDB `_id` is available.
    - **`jwt`:** Fetch the `User` document using the Google ID (`token.sub`) and store the user's MongoDB `_id` as `token.dbUserId`.
    - **`session`:** Assign `token.dbUserId` to `session.user.id`.
Server actions now correctly receive and use the MongoDB `_id` for database queries.
**Lesson:** Clearly distinguish between the external identity provider's ID and the application's internal database user ID. Ensure the session object contains the internal ID needed for database operations.

### 5. Challenge: Build vs. Development Discrepancies
**Issue:** Several issues, particularly the TypeScript type errors and path resolution problems, behaved differently or were only apparent during the production build (`npm run build`), while the development server (`npm run dev`) sometimes compiled without errors.
**Solution:** Adopted a stricter workflow of running `npm run build` locally after significant changes, especially those involving types, imports, or configuration, before committing or deploying.
**Lesson:** The Next.js development server uses different compilation and caching mechanisms than the production build. Relying solely on `npm run dev` for validation is insufficient. Always test with `npm run build` to catch production-specific errors early.

---

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


## Feature Dependencies and Clean Removal (2025-04-20)

### Challenge: Removing Auth0 Integration and Understanding Feature Dependencies

**Issue**: Removing the Auth0 authentication feature required understanding all dependent components and touchpoints across the codebase. The auth integration had created implicit dependencies in multiple files that were not immediately obvious, causing build failures after partial removal.

**Affected Files**:
- `src/app/auth-provider.tsx` - Auth0 context provider
- `src/app/dashboard/page.tsx` - Protected route component
- `src/app/layout.tsx` - Imported and wrapped content with AuthProvider
- `src/middleware.ts` - Auth0 middleware for route protection
- `auth.config.ts` - Auth0 configuration file
- `src/components/auth/` - Directory with auth-specific components
- `next.config.js` - Contained redirect from root to dashboard

**Debugging Process**:
1. Initial removal of primary auth-related files caused cascading build errors
2. Each build error revealed another dependency
3. Needed to systematically track down and remove all auth-related code
4. Discovered implicit redirect in `next.config.js` that wasn't obvious

**Solution Steps**:
1. Created comprehensive inventory of all auth-related files
2. Removed auth components directory completely
3. Updated layout to remove auth provider wrapper
4. Removed middleware file
5. Removed auth configuration
6. Updated next.config.js to remove redirects

**Key Lessons**:

1. **Dependency Mapping**: When implementing a feature, document ALL touch points in the codebase:
   - Component dependencies
   - Configuration changes
   - Middleware additions
   - Layout modifications
   - Navigation/routing changes

2. **Feature Registry**: Create a "Feature Registry" document that maps each major feature to:
   - All files directly implementing the feature
   - All files that depend on or reference the feature
   - Configuration changes required by the feature
   - Environment variables used by the feature

3. **Clean Feature Boundaries**: Design features with clear boundaries and minimal coupling:
   - Use interface abstractions between features
   - Isolate feature-specific code in dedicated directories
   - Avoid embedding feature dependencies in shared components
   - Use feature flags for conditional rendering

4. **Removal Checklist Template**: For each major feature, create a removal checklist that includes:
   - Primary feature files to remove
   - Configuration settings to revert
   - Environment variables to unset
   - Dependent features to update
   - Build verification steps

### Best Practices for Future Feature Implementation

1. **Pre-Implementation Planning**:
   - Document all anticipated file changes
   - Create dependency graph showing impacted areas
   - List all configuration changes required

2. **Implementation Documentation**:
   - Update feature registry with actual files modified
   - Note any unexpected dependencies discovered
   - Document all configuration changes made

3. **Post-Implementation Audit**:
   - Verify all touch points are documented
   - Create feature removal guide if needed
   - Update architecture diagrams to show new feature relationships

4. **Code Organization**:
   - Group feature-specific files in dedicated directories
   - Use clear naming conventions that indicate feature relationships
   - Minimize cross-feature dependencies through abstraction
   - Consider feature-based code splitting

### Architectural Recommendations

1. **Feature Modules**: Organize code into feature modules with clear boundaries
2. **Provider Pattern**: Use context providers with composition over direct imports
3. **Configuration Isolation**: Keep feature-specific configuration isolated
4. **Dependency Injection**: Use dependency injection to make feature dependencies explicit
5. **Feature Flags**: Implement feature flags for easier enabling/disabling

### Case Study: Auth0 Integration Removal

The Auth0 integration removal revealed several architectural issues:

1. **Hidden Redirects**: The root redirect in `next.config.js` was not obviously related to auth
2. **Layout Coupling**: Auth provider was deeply integrated in the main layout
3. **Implicit Dependencies**: Several files imported from auth components without clear indication
4. **Configuration Spreading**: Auth-related configuration spread across multiple files
5. **No Removal Documentation**: No guide existed for clean removal of the auth feature

This case study demonstrates the importance of maintaining a "Feature Registry" that explicitly documents all components, configurations, and dependencies associated with each major feature.

## Authentication Implementation Challenges (2025-04-18)

### Key Lessons

1. **Next.js 15 Compatibility**: 
   - Current @auth0/nextjs-auth0 (v4.4.2) doesn't fully support Next.js 15.3.0
   - Errors occurred with handlers export pattern

2. **Middleware Issues**:
   - Edge runtime conflicts with some OIDC dependencies
   - Better to implement page-level protection initially

3. **Rollback Procedure**:
   - Verify clean working directory first
   - Use explicit commit hash (`git reset --hard 9375766`)
   - Full cleanup of node_modules and .next required

4. **Recommendations for Future**:
   - Consider Auth.js (next-auth v5 beta) for better Next.js 15 support  
   - Always test in isolated branch before merging
   - Verify build works locally before deployment

## 2025-04-18T13:25:00.000Z: Auth0 Implementation (v1.2.0)

### Challenge: Inconsistent File Casing in Git
**Issue**: The project had two versions of the same file (`10_AI_Knowledge_Rules.md` and `docs/10_AI_Knowledge_Rules.MD`) due to case sensitivity on Unix systems. Git was tracking both as separate files.
**Solution (Workaround)**:
1.  Removed `@tailwind` directives from `globals.css`.
2.  Kept minimal `tailwind.config.js` (for `content` scanning) and `postcss.config.js` (with `tailwindcss: {}`, `autoprefixer: {}`). Although Tailwind isn't processing via `@tailwind`, having the configs might be implicitly needed by Next.js's build pipeline.
3.  Imported the font using `next/font/google` in `layout.js` and applied the generated CSS variable (`--font-urbanist`) to the `<html>` tag.
4.  Applied base font styles (`font-family: var(--font-urbanist)`, `font-weight: 300`) directly to `body` in `globals.css`.
5.  Applied specific weights (`font-weight: 800`) to headings/bold elements using standard CSS selectors (`h1`, `h2`, `.title-bold`, etc.) in `globals.css`.
**Lesson**: When encountering intractable build tool configuration errors (especially with CSS tooling chains like PostCSS/Tailwind), simplifying the approach can be a necessary workaround. Bypassing the problematic layer (in this case, Tailwind's `@apply` or utility class processing for fonts) and using more direct methods (CSS variables + standard CSS selectors) can achieve the desired visual outcome while resolving build blockers. Documenting the workaround and the original issue is crucial. The root cause of the PostCSS conflict remains unclear but likely involves specific version interactions or environment issues.

### Best Practice: `next/font/google` with CSS Variables
**Observation**: Using the `variable` option with `next/font/google` provides a flexible way to apply the font globally via CSS, decoupling it slightly from direct framework class names and allowing standard CSS rules to manage weights and styles.
**Lesson**: The CSS variable approach with `next/font` is robust and recommended, especially if not relying heavily on Tailwind utility classes for font management.

---

## 2025-04-13T10:43:42.534Z: Drag-and-Drop Debugging & Library Switch (v0.8.0)

### Challenge: Non-Functional Drag-and-Drop Despite Successful Builds
**Issue**: The `@dnd-kit` implementation (v0.5.0-v0.7.0) built successfully locally and deployed, but drag-and-drop did not work functionally in the browser. Client-side exceptions occurred during hydration, and despite fixes, runtime logic errors persisted.
**Debugging Steps**:
1. Added extensive console logging to `handleDragEnd` to trace event data and logic flow with `@dnd-kit`.
2. Attempted to fix potential client/server rendering mismatches by strictly rendering `DndContext` only after `useEffect` confirmed client-side mounting (`isClient` state).
3. Encountered repeated syntax errors and structural problems during refactoring attempts with `@dnd-kit`.
**Solution**: Switched library from `@dnd-kit` to `@hello-pangea/dnd` (a `react-beautiful-dnd` fork compatible with React 18+).
**Lesson**: Successful builds do not guarantee correct runtime behavior, especially with complex client-side interactions and libraries sensitive to the rendering environment (SSR vs Client). When extensive debugging with one library fails or becomes overly complex (especially if multiple AI interventions introduce structural errors), switching to a different, potentially more established or straightforward library for the specific use case can be a valid solution. `react-beautiful-dnd` (and its forks) often have a more constrained API but proved simpler and more reliable for this standard list/board reordering task. Rigorous local testing *after* a successful build is crucial.

### Implementation with `@hello-pangea/dnd`
**Observation**: `react-beautiful-dnd` uses a different component structure (`DragDropContext`, `Droppable`, `Draggable`) and `onDragEnd` result format compared to `@dnd-kit`.
**Solution**:
1. Refactored `KanbanBoard` to use `DragDropContext` and handle the `onDragEnd(result)` callback.
2. Refactored `Column` to use `Droppable`, providing a `droppableId`.
3. Refactored `CardItem` to use `Draggable`, providing `draggableId` and `index`.
4. Adjusted the `onDragEnd` logic in `KanbanBoard` to parse the `result` object (source/destination droppableId and index) and correctly update state for both same-column reorders and different-column moves, including calling the appropriate server actions (`updateCardsOrder`, `updateCardStatus`).
5. Ensured `DragDropContext` only renders client-side using the `isClient` state pattern.
**Lesson**: When switching libraries, carefully adapt the component structure and event handler logic to match the new library's API and data structures. Pay close attention to the props required by each component (`droppableId`, `draggableId`, `index`) and the structure of the event result object (`onDragEnd`'s `result`). Client-only rendering remains important for DOM-heavy libraries.

---

## 2025-04-13T07:37:00.000Z: Persistent Reordering (v0.7.0)

### Persisting Order with `bulkWrite`
4.  Used `CardModel.bulkWrite(bulkOps)` to execute all updates in a single database command.
5.  In `KanbanBoard.js`, after visually reordering using `arrayMove`, mapped the new list to create the `orderUpdates` array (`[{ id, order: index }]`) and called `updateCardsOrder`.
**Lesson**: For batch updates like saving the order of a list, Mongoose's `bulkWrite` is significantly more performant than multiple individual `findByIdAndUpdate` calls. Map the client-side array to the required `bulkWrite` operation format.

### Default Ordering Strategy
**Observation**: Newly created cards need a default order value that places them appropriately (e.g., at the top) when sorting by the `order` field (ascending).
**Solution**: Assigned `order: -Date.now()` in the `createCard` action. Since `Date.now()` increases over time, its negative value decreases, ensuring newer cards have smaller `order` values and appear first when sorting ascending.
**Lesson**: Using timestamps (or their negative) can be a simple way to establish a default chronological or reverse-chronological order for items when an explicit order field is introduced. Ensure the sorting direction (`asc` or `desc`) matches the desired outcome based on the timestamp strategy.

---

## 2025-04-13T07:32:00.000Z: Client-Side Reordering (v0.6.0)

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

## 2025-04-13T07:23:00.000Z: Drag-and-Drop Implementation (@dnd-kit Attempt) (v0.5.0)

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

## 2025-04-13T07:13:00.000Z: Kanban Layout Implementation (v0.4.0)

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

## 2025-04-13T06:57:00.000Z: Swipe Action Implementation (v0.3.0)

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

## 2025-04-13T06:34:00.000Z: Core Functionality Implementation (v0.2.0)

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

## 2025-04-12T08:48:00.000Z: Initial Setup and Deployment (v0.1.0)

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


---

### 2025-04-17T13:41 - Resolved Persistent 401 Auth Errors
- **Symptom:** All deployments under the `narimato` scope returned 401 Unauthorized with `_vercel_sso_nonce` cookie, even after confirming Vercel Team authentication settings were disabled.
- **Diagnosis:** Suspected stale or conflicting local project linking information stored in the `.vercel` directory.
- **Solution:**
    1. Removed the local `.vercel` directory (`rm -rf .vercel`).
    2. Explicitly relinked the local project to the correct Vercel project (`vercel link --scope narimato --project doneisbetter --yes`).
    3. Deployed a fresh build (`vercel deploy --prod --yes`).
- **Result:** The subsequent deployment was publicly accessible (200 OK), confirming the local configuration was the root cause.
- **Lesson:** When Vercel CLI deployment behavior contradicts dashboard settings (especially regarding authentication), clearing local Vercel configuration (`.vercel` directory) and relinking can resolve inconsistencies.

---

### 2025-04-17T14:48 - Persistent Extraneous Package Investigation
- **Package:** `@emnapi/runtime@1.4.3` consistently appears via `npm list --depth=0 | grep extraneous`.
- **Attempts to Remove:**
    - `npm prune`
    - `npm cache clean --force`, `sudo rm -rf node_modules package-lock.json`, `npm install --force --legacy-peer-deps`
- **Result:** Package persists despite all standard cleaning methods.
- **Hypothesis:** Might be linked via build tooling, global packages, or non-standard npm resolution, not directly by `package.json`.
- **Decision:** As `npm audit` shows 0 vulnerabilities and the package doesn't prevent successful builds, ignoring its presence for stability (Rule 07). Further investigation deferred unless it causes runtime issues. Build successfully completed after ignoring.
