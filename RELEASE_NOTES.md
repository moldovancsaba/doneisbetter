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
