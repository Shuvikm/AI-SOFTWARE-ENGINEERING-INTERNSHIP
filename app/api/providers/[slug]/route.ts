import { NextRequest, NextResponse } from "next/server";
import { ProviderService } from "@/services/provider.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const provider = await ProviderService.getBySlug(slug);
    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(provider);
  } catch (error) {
    console.error("API /api/providers/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider" },
      { status: 500 }
    );
  }
}
