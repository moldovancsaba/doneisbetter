# Changelog

## [1.0.0] - 2023-12-21T10:00:00.000Z

### Major Project Restructuring

#### Deleted Documentation Files
- Documentation index and structure files (01-24_*.md)
- Project documentation files including:
  - Technology Stack documentation
  - AI related guidelines and protocols
  - Development guidelines and rules
  - Architecture and design documentation
  - Security and deployment guidelines
  - Project structure documentation
- ROADMAP.md

#### Deleted Components
- Layout components:
  - Grid, Header, Layout, Navigation, PageContent, PageWrapper, Stack components
  - Page transitions and layout index
- UI components:
  - Alert, Animations, Button, Card, Dropdown, ErrorBoundary
  - Forms, InfoMessage, Loading, Modal, ThemeSwitcher
  - Toast, Tooltip components
- Feature components:
  - SwipeCard and related components
  - CardList and CardStack
  - UserRegistration
  - Vote-related components (VoteArena, VoteCard, VoteControls)

#### Deleted Pages and API Routes
- Pages:
  - 404, _app, admin, rankings, results, swipe, users, vote pages
- API routes:
  - Cards, interactions, sessions, users endpoints
  - Vote-related endpoints (pair, rankings, submit)
  - Debug endpoints

#### Deleted Models
- Card, Interaction, Session models
- User models (including backup versions)
- VotePair and VoteRank models

#### Deleted Utils and Configs
- Database connection utilities
- Date and error utilities
- Configuration files (postcss, tailwind)
- Scripts (database cleanup, health checks, seeding)
- Style files (globals.css, navigation.css, theme.js)

#### Modified Files
- lib/db.js: Database connection updates
- next.config.js: Configuration updates
- package.json: Dependency updates
- pages/index.js: Main page modifications

#### New Files
- .env.vercel: Environment configuration for Vercel
- CHANGELOG.md: This changelog file
- README.md: Updated project documentation
- development_direction_doneisbetter.md: Development guidelines
- doneisbetter_roadmap.md: Updated project roadmap
- doneisbetter_spec.md: Project specifications
- models/Entry.js: New Entry model
- New API routes:
  - auth.js: Authentication endpoints
  - create.js: Creation endpoints
  - delete.js: Deletion endpoints
  - list.js: Listing endpoints
  - update.js: Update endpoints
- user_stories_doneisbetter.md: User stories documentation

# CHANGELOG — DoneIsBetter

## [0.1.0] - 2025-06-09T16:26:07.818911Z
### ✅ New Features
- SSO login via thanperfect
- Token session handling
- Entry submission linked to SSO user

### 🐞 Fixed Bugs
- Auth handling corrected
- Token validation flow fixed

### ⚠ Known Issues
- No edit/delete UI yet
- No timestamps shown
- Logs not visible yet

### 🔮 Future Roadmap
- Add timestamps, edit/delete
- Logs per entry
- Admin dashboard and SDK docs

## ✅ Update @ 2025-06-09T17:17:39.025828Z

- Build errors resolved in `index.js` due to unclosed JSX.
- Activity Log now includes `created @ ...` as first entry.
- "Created at ..." line removed from outside the log block.
- Edit/Delete buttons moved to bottom of entry block.
- Files verified working:
  - pages/index.js
  - API routes: /auth, /create, /delete, /list, /update
- Thanperfect SSO integration tested and confirmed.
