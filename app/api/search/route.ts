import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/services/search.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const results = await SearchService.searchGlobal(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API /api/search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
