import { NextResponse } from "next/server";
import { ProviderService } from "@/services/provider.service";

export async function GET() {
  try {
    const providers = await ProviderService.getAll();
    return NextResponse.json(providers);
  } catch (error) {
    console.error("API /api/providers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
