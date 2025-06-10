# User Stories — DoneIsBetter

## As a user
- I want to log in with a simple string through the thanperfect SSO
- I want to see a clean input field and submit button once I’m logged in
- I want to submit a short piece of text linked to my identity
- I want to see my submitted entries in a list
- I want to see the time when I submitted each entry
- I want to be able to edit my previous entries
- I want to delete my previous entries if needed
- I want to see my username shown next to each entry

## As a system maintainer
- I want to ensure no personal data is stored
- I want to see token validation and logs per entry
- I want to see universal timestamps in ISO format

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
