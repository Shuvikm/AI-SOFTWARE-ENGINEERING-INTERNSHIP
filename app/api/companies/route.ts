import { NextResponse } from "next/server";
import { CompanyService } from "@/services/company.service";

export async function GET() {
  try {
    const companies = await CompanyService.getAll();
    return NextResponse.json(companies);
  } catch (error) {
    console.error("API /api/companies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
