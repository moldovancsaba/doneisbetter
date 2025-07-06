## Backend

### MongoDB Integration
- When using MongoDB with Next.js API routes, ensure database connections are handled at the route level rather than in models to prevent connection conflicts
- Always validate incoming data before processing, especially for enumerated values like vote directions
- Use ISO 8601 UTC timestamps consistently for all date fields
- Handle both `_id` and `id` fields properly when working with MongoDB documents in TypeScript

# CardSwipe Development Learnings

## 2025-07-06T13:52:50.000Z - Vote and Swipe Integration

**Issue:** Component naming inconsistency between VoteBattle and intended Vote functionality caused confusion in the codebase.

**Root Cause:** Initial implementation used battle terminology, which didn't align with the actual voting and swiping mechanics intended for the ranking system.

**Resolution:**
- Renamed VoteBattle component to Vote for clarity
- Aligned all related function names and variables
- Integrated swipe detection directly with vote actions
- Standardized the flow: Swipe → Vote → Rank

**Key Learnings:**
- Maintain consistent terminology across codebase
- Keep component names aligned with their core functionality
- Ensure clear separation between gesture detection and action handling
- Document component relationships explicitly

## 2025-10-01T12:00:00.000Z - Main Page Redirect and Simplification

**Change:** The main page was redirected to /play, removing the outdated HomePage with voting UI and simplifying the app flow.

**Reasoning:** 
- Improve maintainability by removing outdated components.
- Streamline user experience by focusing directly on the /play path.

**Insights:**
- Ensure thorough checks on linked components when deprecating features.
- Verify all documentation and entry points align with new routing.

## 2025-07-06T21:03:26Z - Critical Component Centralization

**Issue:** Lack of proper component centralization led to inconsistent UI implementations across pages.

**Root Cause:** Missing standardized component structure and unclear rules about component reuse.

**Resolution:**
- Created centralized Card component in common/Card.tsx
- Established proper layout hierarchy for all pages
- Enforced use of centralized Navigation and Card components
- Added architectural documentation for component usage

**Key Learnings:**
- Core UI components must be centralized in /components/common
- All pages must reuse these components without variation
- Layout components must be standardized and consistent
- Component documentation must explicitly state reuse requirements

## 2025-07-06T20:59:36Z - Navigation Component Consistency

**Issue:** Custom navigation implementation in ranking page deviated from centralized component, including unauthorized "Home" link.

**Root Cause:** Direct implementation of navigation in page component instead of using the centralized Navigation component.

**Resolution:**
- Removed custom navigation from ranking page
- Enforced use of centralized Navigation component
- Eliminated unauthorized navigation items

**Key Learnings:**
- Always use centralized components for consistent UI elements
- Never implement page-specific variations of global components
- Validate navigation items against approved structure
- Document component reuse requirements clearly

## 2025-07-06T20:57:00Z - Minimal Design Implementation

**Issue:** Inconsistent use of white backgrounds and containers across layouts affected visual consistency.

**Root Cause:** Different components were independently styled with their own background colors and container elements, leading to visual inconsistency.

**Resolution:**
- Removed bg-white classes from layout components
- Simplified container styling in error and not-found pages
- Enforced consistent minimal design across all pages

**Key Learnings:**
- Maintain consistent styling patterns across layouts
- Remove unnecessary decorative elements
- Keep visual hierarchy simple and clear
- Document styling decisions in component comments

## Dev

### Authentication
- SSO integration requires specific session handling for ranking persistence
- Token refresh strategy needs careful implementation

### Design
- No breadcrumb navigation as per design policy
- Core UI flows (SWIPE → VOTE → RANKING) must be strictly linear

### Backend
- MongoDB schema design optimized for ranking calculations
- Activity logging crucial for debugging user flows

### Frontend
- Swipe mechanics need careful touch event handling
- State management between SWIPE and VOTE phases requires clear transitions

### Process
- Versioning system in place for all deployments
- Documentation kept current with implementation

## Resolved Issues

### 2025-07-06T12:21:14Z - Model Registration Issue

**Issue:** Models were inadvertently registered multiple times across different modules leading to schema conflicts and memory leaks.

**Root Cause:** Lack of a centralized model registration strategy in the application architecture.

**Resolution:** Implemented a centralized registration pattern within the `/models` directory. Models are now registered once and reused through the model registry.

**Potential Pitfalls:**
- Ensure all models are included in the registry to prevent missing model errors.
- Avoid cyclic dependencies that can cause import issues.

### 2025-07-06T08:50:06Z - Next.js Configuration Warning

**Issue:** Invalid `next.config.js` configuration detected - unrecognized `strict` key in `typescript` configuration.

**Root Cause:** Next.js 14.0.4 no longer supports direct TypeScript configuration in `next.config.js`. TypeScript configuration should be managed through `tsconfig.json` instead.

**Resolution:** Removed typescript.strict from next.config.js as it's redundant with tsconfig.json settings.
