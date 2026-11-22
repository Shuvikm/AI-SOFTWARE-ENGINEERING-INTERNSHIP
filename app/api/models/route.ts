import { NextRequest, NextResponse } from "next/server";
import { ModelService } from "@/services/model.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const provider = searchParams.get("provider") || undefined;
    const company = searchParams.get("company") || undefined;
    const category = searchParams.get("category") || undefined;
    const capability = searchParams.get("capability") || undefined;
    const sortBy = (searchParams.get("sortBy") as "popularity" | "releaseDate" | "contextWindow" | "benchmark") || "popularity";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const data = await ModelService.getAll({
      query,
      provider,
      company,
      category,
      capability,
      sortBy,
      order,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API /api/models error:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
