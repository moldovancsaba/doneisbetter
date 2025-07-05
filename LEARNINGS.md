# CardSwipe Development Learnings

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

*No issues logged yet*
