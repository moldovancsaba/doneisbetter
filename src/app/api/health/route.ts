// src/app/api/health/route.ts
// API route for healthcheck — verifies DB connection and backend liveness

import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Checks MongoDB connection and returns status
 */
export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (e) {
    return NextResponse.json({ status: "error", db: "failed" }, { status: 500 });
  }
}
