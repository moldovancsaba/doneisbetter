# DoneIsBetter application scaffold

This repository contains a Next.js application scaffold with a MongoDB connection, URL-card entry screen and database health endpoint. It is a starting point for application development; the current home page and browser metadata still contain the framework starter content.

The identity service is maintained separately in [DoneIsBetter SSO](https://github.com/moldovancsaba/sso). This repository is not the source for the SSO product.

## Start here

| Task | Source |
| --- | --- |
| Inspect the current home page | [src/app/page.tsx](src/app/page.tsx) |
| Inspect the URL-card screen | [src/app/card/page.tsx](src/app/card/page.tsx) |
| Inspect card collection operations | [src/app/api/cards/route.ts](src/app/api/cards/route.ts) |
| Inspect browser metadata and root layout | [src/app/layout.tsx](src/app/layout.tsx) |
| Understand database configuration | [ARCHITECTURE.md](ARCHITECTURE.md) and [src/lib/db.ts](src/lib/db.ts) |
| Inspect the health endpoint | [src/app/api/health/route.ts](src/app/api/health/route.ts) |
| Check available scripts and dependency versions | [package.json](package.json) |
| Follow this welcome repair | [Delivery issue #921](https://github.com/moldovancsaba/mvp-factory-control/issues/921) |
| Read documentation changes and limits | [RELEASE_NOTES.md](RELEASE_NOTES.md) |

## Current source scope

- Next.js App Router application with React and TypeScript.
- Mongoose connection configured by `MONGODB_URI`, using database name `doneisbetter`.
- `GET /api/health` calls the database connector.
- `/card` lists stored image-URL cards and submits a multiline URL list to `POST /api/cards`.
- `GET /api/cards` returns cards ordered by creation time; `POST /api/cards` inserts a supplied URLs array.
- Starter landing page and default “Create Next App” browser metadata.

Repository inspection does not establish that a production deployment is healthy or that the scaffold is the canonical DoneIsBetter public website. Hosted destination and operational lifecycle require separate verification.

## Local development

Install the dependencies recorded in the lockfile:

```sh
npm ci
```

Create an untracked `.env.local` containing a valid MongoDB connection string:

```dotenv
MONGODB_URI=<your MongoDB connection string>
```

The connector throws during module initialization if this variable is absent. Configure it before starting or building the application. Never commit real credentials.

```sh
npm run dev
```

The package also defines `npm run build`, `npm run start` and `npm run lint`. These are source-defined commands; their successful execution was not established by this documentation-only change. Start requires a completed production build.

## Health contract

Once the route is configured and loaded, a successful connection returns HTTP 200 with `{ "status": "ok", "db": "connected" }`. A connection failure caught by the handler returns HTTP 500 with `{ "status": "error", "db": "failed" }`.

Missing configuration can fail before the handler runs. The endpoint reports database connection status; it does not prove all application workflows work.

## Known implementation limits

The card screen includes a Delete button that calls `DELETE /api/cards/{id}`, but the inspected default-branch tree contains only the collection route and no matching per-card route. Do not treat deletion as implemented. The card API is not a readiness or security certification; use a development database for local investigation. This documentation change does not fix runtime gaps.

## Working and delivery rules

Shared UI work follows the [General Design System](https://github.com/sovereignsquad/general-design-system). Keep product-specific implementation documentation in this repository and shared portfolio policy in [MVP Factory Control](https://github.com/moldovancsaba/mvp-factory-control). This documentation repair is tracked centrally; future routing should be checked against the current product policy.

The README update changes no application code, dependency, environment or deployment configuration. Validate documentation links and source claims separately from runtime and production verification.
