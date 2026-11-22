import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/services/company.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const company = await CompanyService.getBySlug(slug);
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(company);
  } catch (error) {
    console.error("API /api/companies/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
