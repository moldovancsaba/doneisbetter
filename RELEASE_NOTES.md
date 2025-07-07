## [4.2.1] — 2025-07-07T09:04:43Z

### Fixed
- Fixed card container in ranking page to properly fit images:
  - Added aspect ratio constraint (3:4) for consistent sizing
  - Updated Card component to properly fill container
  - Improved image object-fit behavior
  - Enhanced responsive layout consistency

## [4.2.0] — 2025-07-07T08:55:05Z

### Changed
- Enhanced admin cards page with improved layout and functionality:
  - Added batch image URL input form for efficient card creation
  - Implemented grid layout matching ranking page design
  - Added delete functionality with confirmation
  - Enhanced error handling and success messages
  - Improved responsive design with proper spacing
  - Added consistent shadows and styling

## [4.1.0] — 2025-07-07T08:24:48Z

### Added
- Random card selection in swipe phase
  - Each card is now randomly selected from available pool
  - Prevents sequential card order bias
  - Maintains state of available cards
  - Seamless transition between selections

## [4.0.0] — 2025-07-07T08:10:48Z

### Major UI Update
- **Vertical Centering:** Implemented fixed positioning and transforms for perfect vertical alignment in both swipe and vote phases.
- **Card Scaling:** Cards are now scaled by height, maintaining aspect ratio integrity.
- **Layout Adjustments:** `VoteComparison` and `SwipePhase` now use `max-w-80vw` with centered containers.
- **Navigation Consideration:** Offsets added to account for navigation height ensuring proper centering.
- **Strict Aspect Ratio Maintenance:** Enhanced policies to strictly rule out any aspect ratio adjustments under any circumstances.

## [3.0.0] — 2025-07-06T22:05:22Z

### Major Update: Enhanced Image Handling System

#### Added
- Comprehensive image handling system in Card component:
  - Automatic aspect ratio preservation across all contexts
  - Cross-browser drag prevention mechanisms
  - Touch interaction blocking for mobile devices
  - Responsive sizing with container-based dimensions
  - Error recovery with exponential backoff

#### Changed
- Complete overhaul of image display architecture:
  - Removed unnecessary nested divs for better performance
  - Implemented native aspect ratio calculations
  - Optimized SwipePhase layout for better responsiveness
  - Enhanced image scaling across all interaction phases
  - Improved DOM structure for maintainability

#### Performance Improvements
- Optimized resize calculations:
  - CSS-based sizing calculations
  - Minimal JavaScript interventions
  - Efficient aspect ratio handling
  - Proper event listener cleanup
  - Controlled component re-renders

#### Technical Details
- Added comprehensive component documentation
- Updated architecture documentation with image handling system
- Implemented proper error boundaries
- Enhanced accessibility support
- Added thorough code comments

## [2.0.7] — 2025-07-06T21:32:25Z

## [2.0.6] — 2025-07-06T21:27:29Z

### Fixed
- SwipePhase card image aspect ratio handling:
  - Added proper container dimensions
  - Ensured image fills container while preserving aspect ratio
  - Matched card behavior with Vote and Ranking pages
  - Removed unnecessary height constraints

## [2.0.5] — 2025-07-06T21:14:54Z

### Changed
- Major UI improvements:
  - Card images now preserve aspect ratio
  - No text overlays on any cards
  - Responsive vote layouts (landscape/portrait)
  - Consistent card design across all views
  - Improved ranking grid layout
  - Proper image scaling in all contexts

## [2.0.4] — 2025-07-06T21:05:12Z

### Fixed
- Removed duplicate /rankings route, keeping only /ranking
- Fixed version mismatch in package.json
- Cleaned up build output

## [2.0.3] — 2025-07-06T21:03:26Z

### Changed
- Implemented centralized UI components:
  - Created common/Card.tsx for unified card display
  - Added proper ranking page layout with Navigation
  - Ensured consistent styling across all pages
  - Removed all page-specific component variations

## [2.0.2] — 2025-07-06T20:59:36Z

### Fixed
- Removed custom navigation from ranking page
- Removed unauthorized "Home" link
- Enforced use of centralized Navigation component

## [2.0.1] — 2025-07-06T20:57:00Z

### Changed
- Removed unnecessary white backgrounds and containers from layouts:
  - Removed bg-white from play/layout.tsx
  - Removed bg-white from (default)/layout.tsx
  - Simplified error.tsx and not-found.tsx styling
  - Enhanced minimal design consistency

## [2.0.0] — 2025-07-06T16:18:29Z

### Changed
- Redirected main page (/) to /play for better user experience:
  - Removed old HomePage with voting UI
  - Added clean redirect to /play page
  - Simplified application flow
  - Improved code maintainability

## [1.6.0] — 2025-07-06T14:52:51Z

### Changed
- Complete overhaul of voting system to match requirements:
  - Implements required business logic exactly
  - Progressive ranking through multiple comparisons
  - New card always on left, random comparison on right
  - Proper comparison chain based on win/loss results
  - Full battle outcome tracking
  - State management with VoteManager

## [1.5.2] — 2025-07-06T14:46:41Z

### Fixed
- Fixed vote state management:
  - Added battle win/loss tracking
  - Improved card selection for battles
  - Fixed API request format for battles
  - Added battle stats display in UI
  - Streamlined phase transitions

## [1.5.1] — 2025-07-06T14:46:41Z

### Fixed
- Fixed vote functionality:
  - Added /api/cards/next endpoint for proper card fetching
  - Updated Card model with description and rank fields
  - Fixed data model mismatches between API and UI
  - Added proper rank tracking in database

## [1.5.0] — 2025-07-06T14:36:53Z

### Changed
- Fixed vote phase implementation:
  - New card always appears on the left
  - Random previously liked card on the right
  - Progressive ranking system based on vote outcomes
  - Proper ranking adjustment after each vote
  - Efficient card comparison tracking
- Enhanced vote UI:
  - Clear left/right card positioning
  - Smooth slide-in animations
  - Improved visual feedback

## [1.4.0] — 2025-07-06T14:26:43Z

### Added
- Implemented VoteComparison component for direct card comparison
  - Added animated card selection with Framer Motion
  - Interactive voting interface with visual feedback
  - Smooth transitions between cards
- Enhanced vote phase with battle functionality
  - Direct winner/loser selection
  - Automatic phase transition after voting
  - Battle results recording via API

## [1.3.1] — 2025-07-06T14:18:53Z

### Fixed
- Fixed vote phase transition not occurring after liking two cards
  - Added likedCards state monitoring with useEffect
  - Removed timing-dependent phase transition check

## [1.3.0] — 2025-07-06T14:12:26Z

### Added
- Implemented VoteBattle component for 1v1 card comparisons
- Added WebSocket infrastructure for real-time updates
- Integrated Framer Motion animations for smooth transitions
- Created progressive ELO-like ranking system

### Changed
- Enhanced PlayPage component with swipe and vote phases
- Updated Activity and Ranking models for battle outcomes
- Improved UI feedback and animations
- Optimized WebSocket implementation for Edge runtime

### Technical
- Switched to Edge-compatible WebSocket APIs
- Enhanced build configuration for Next.js Edge runtime
- Updated documentation files:
  - ARCHITECTURE.md: Updated system overview
  - ROADMAP.md: Strategic development plans
  - TASKLIST.md: Active tasks and priorities
  - LEARNINGS.md: Development insights

## [1.2.0] - 2024-01-19T14:30:00.000Z

### Changed
- Updated WebSocket implementation for Next.js 14 compatibility
- Improved WebSocket error handling and security
- Added token-based authentication for WebSocket connections
- Removed legacy middleware from route handlers

## [1.1.1] - 2025-07-06T13:20:15Z

### Fixed
- Voting functionality in card ranking system
  - Added proper validation for vote direction (left/right)
  - Fixed database connection handling
  - Added correct timestamp handling for new rankings
  - Fixed card ID handling between frontend and backend

# CardSwipe Release Notes

## [v2.0.0] — 2024-01-18T10:00:00.000Z

### Major Changes
- Simplified overall architecture and codebase
- Removed advanced features for better maintainability
- Streamlined user experience

### Removed Features
- WebSocket real-time updates
- OAuth authentication system
- Advanced ranking features (weights, categories)
- Image URL support
- Advanced filtering options
- Binary tournament sorting

### Simplified Architecture
- Basic card management with title and description
- Simple swipe-based ranking system
- Streamlined API routes
- Minimal UI components
- Core MongoDB collections only

### Developer Notes
- Migration required for existing image-based cards
- Update client applications to use new simplified API
- Review documentation for updated architecture
## [v1.0.1] — 2024-01-17T15:30:00.000Z

### Added
- Complete Next.js 13+ App Router implementation
- MongoDB integration with Mongoose models
- NextAuth.js authentication with MongoDB adapter
- Real-time WebSocket updates for rankings
- Dark mode support across all components
- Role-based access control system
- Navigation bar and footer components

### Fixed
- MongoDB adapter configuration and legacy peer dependencies
- TypeScript type annotations in React components:
  - `/cards/page.tsx`
  - `/play/page.tsx`
  - `/ranking/page.tsx`
- Date field handling in Mongoose models
- Import path resolution for auth configuration
- Build errors in API route handlers

### Changed
- Unified NextAuth configuration in `/src/app/api/auth/config.ts`
- Standardized date fields to use ISO string format
- Modified development server port to 3003

### Developer Notes
- Use `--legacy-peer-deps` when installing dependencies
- Ensure proper environment variable configuration
- TypeScript strict mode is enabled
- WebSocket implementation requires proper error handling

## [v1.0.0] — 2024-01-15T00:00:00.000Z

### Added
- Initial project setup
- Core documentation structure
- Basic architecture design
- Development roadmap
- Task tracking system

### Technical Details
- Next.js 14 framework setup
- Tailwind CSS integration
- MongoDB connection configuration
- SSO integration planning

## Version History

*This is the first release.*
