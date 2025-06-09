# Development Direction — DoneIsBetter

## Principles
- Use only long-term supported packages
- No ESLint
- No third-party auth — only thanperfect SSO
- Minimal and readable codebase

## Backend
- MongoDB to store entries (string + timestamp + user)
- `/api/create`, `/api/list`, `/api/update`, `/api/delete`
- All entries validated via SSO before write

## Frontend
- Display logged-in username
- Allow submission of new text
- Show all entries with:
  - Text
  - Author (SSO username)
  - Timestamp
  - Edit/Delete buttons

## Current Tasks
- [x] SSO login and token handling
- [x] Basic entry submission
- [ ] Timestamp display
- [ ] Edit/Delete support
- [ ] Activity log display

_Last updated: 2025-06-09T16:26:07.818911Z_

## ✅ Update @ 2025-06-09T17:17:39.025828Z

- Build errors resolved in `index.js` due to unclosed JSX.
- Activity Log now includes `created @ ...` as first entry.
- "Created at ..." line removed from outside the log block.
- Edit/Delete buttons moved to bottom of entry block.
- Files verified working:
  - pages/index.js
  - API routes: /auth, /create, /delete, /list, /update
- Thanperfect SSO integration tested and confirmed.
