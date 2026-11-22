import { NextRequest, NextResponse } from "next/server";
import { BenchmarkService } from "@/services/benchmark.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const benchmarkId = searchParams.get("benchmarkId") || undefined;
    const rankings = await BenchmarkService.getRankings(benchmarkId);
    return NextResponse.json(rankings);
  } catch (error) {
    console.error("API /api/rankings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
