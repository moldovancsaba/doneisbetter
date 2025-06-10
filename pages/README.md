# DoneIsBetter

A minimal SSO-connected app for submitting and managing personal short texts.

## Features
- SSO login using [thanperfect](https://thanperfect.vercel.app)
- MongoDB data store
- Text submission with identity
- Session-based access (10 minutes)
- Simple clean UI

## Tech Stack
- Next.js 15.3.3
- MongoDB (Atlas)
- No external auth or dependencies
- Hosted on Vercel

## Getting Started

```bash
git clone https://github.com/moldovancsaba/doneisbetter.git
cd doneisbetter
npm install
touch .env.local
# Paste the MongoDB and SSO_VALIDATE_URL inside
npm run dev
```

## Environment Variables

```env
MONGODB_URI="your_mongo_uri"
SSO_VALIDATE_URL="https://thanperfect.vercel.app/api/validate"
```

_Last updated: 2023-12-21T10:00:00.000Z_

## ✅ Update @ 2023-12-21T10:00:00.000Z
## ✅ Update @ 2025-06-09T17:17:39.025828Z

- Build errors resolved in `index.js` due to unclosed JSX.
- Activity Log now includes `created @ ...` as first entry.
- "Created at ..." line removed from outside the log block.
- Edit/Delete buttons moved to bottom of entry block.
- Files verified working:
  - pages/index.js
  - API routes: /auth, /create, /delete, /list, /update
- Thanperfect SSO integration tested and confirmed.
