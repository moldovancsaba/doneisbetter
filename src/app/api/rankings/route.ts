import { connectDB } from "@/lib/db";
import { UserResult } from "@/models/UserResult";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json(
      { error: "Missing required field: session_id" },
      { status: 400 }
    );
  }

  const userResult = await UserResult.findOne({ session_id });

  if (!userResult) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(userResult.final_ranking);
}
