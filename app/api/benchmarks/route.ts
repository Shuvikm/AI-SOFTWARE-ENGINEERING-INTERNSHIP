import { NextResponse } from "next/server";
import { BenchmarkService } from "@/services/benchmark.service";

export async function GET() {
  try {
    const benchmarks = await BenchmarkService.getAll();
    return NextResponse.json(benchmarks);
  } catch (error) {
    console.error("API /api/benchmarks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}
