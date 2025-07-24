
## MongoDB Integration

- **Library**: Mongoose
- **Connection file**: `src/lib/db.ts`
- **Healthcheck route**: `src/app/api/health/route.ts`
- **Environment variable**: `MONGODB_URI` (set via `.env.local` and Vercel)

### Healthcheck
- Endpoint: `/api/health`
- Returns:
  - `{ status: "ok", db: "connected" }` if DB is online
  - `{ status: "error", db: "failed" }` on failure

