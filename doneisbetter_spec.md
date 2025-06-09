# Functional Specification — DoneIsBetter

## Overview
A minimal app where users can log in using thanperfect SSO and submit arbitrary strings that are stored and listed publicly, tied to their username.

## Features
- ✅ Simple input + submit interface
- ✅ thanperfect SSO login
- ✅ MongoDB backend
- ✅ Token-based session (10 minutes)
- 🟡 Entries have:
  - Text
  - Author (identifier)
  - CreatedAt timestamp
  - Activity logs
- 🟡 Users can:
  - Edit their entries
  - Delete their entries
  - View a list with metadata

## Format
- All timestamps stored and shown in UTC ISO format `YYYY-MM-DDTHH:MM:SS.sssZ`

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
