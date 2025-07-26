import { connectDB } from "@/lib/db";
import { Card } from "@/models/Card";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    await Card.deleteMany({});
    console.log("✅ All cards deleted");

    return NextResponse.json({ message: "All cards deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting all cards:", error);
    return NextResponse.json(
      { error: "Error deleting all cards" },
      { status: 500 }
    );
  }
}
