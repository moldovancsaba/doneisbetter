# DoneIsBetter Roadmap

## Short-Term Goals (Next Sprint)
- [x] ✅ Basic SSO login using thanperfect
- [x] ✅ Submit strings with SSO-linked users
- [ ] ⏳ Show timestamps next to each entry
- [ ] ⏳ Allow editing of submitted entries
- [ ] ⏳ Allow deleting of submitted entries
- [ ] ⏳ Display activity logs per entry
- [ ] ⏳ Display the author (username from SSO) next to each entry

## Mid-Term Goals
- [ ] Add session expiration display and login timeout UX
- [ ] Add filter/search by username
- [ ] Export data (CSV/JSON)

## Long-Term Goals
- [ ] Real-time updates with Socket.io
- [ ] Admin dashboard to list all users and entries
- [ ] SSO SDK integration documentation for other apps

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
