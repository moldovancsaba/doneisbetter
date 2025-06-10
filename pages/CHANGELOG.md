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
