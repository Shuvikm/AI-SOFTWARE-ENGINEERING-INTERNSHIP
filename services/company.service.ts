import { prisma } from "@/lib/prisma";
import { initialCompanies, initialModels } from "@/lib/data/mock-data";
import { Company } from "@/types";

export class CompanyService {
  static async getAll(): Promise<Company[]> {
    if (prisma) {
      try {
        const dbCompanies = await prisma.company.findMany({
          include: {
            models: true,
            _count: {
              select: { models: true },
            },
          },
        });
        if (dbCompanies && dbCompanies.length > 0) {
          return dbCompanies as unknown as Company[];
        }
      } catch (err) {
        console.warn("DB query failed for companies:", err);
      }
    }

    return initialCompanies.map((c) => {
      const associatedModels = initialModels.filter((m) => m.companyId === c.id);
      return {
        ...c,
        models: associatedModels,
        _count: {
          models: associatedModels.length,
        },
      };
    });
  }

  static async getBySlug(slug: string): Promise<Company | null> {
    if (prisma) {
      try {
        const dbCompany = await prisma.company.findUnique({
          where: { slug },
          include: {
            models: {
              include: {
                provider: true,
                benchmarks: {
                  include: { benchmark: true },
                },
              },
            },
            _count: {
              select: { models: true },
            },
          },
        });
        if (dbCompany) return dbCompany as unknown as Company;
      } catch (err) {
        console.warn("DB getBySlug failed for company:", err);
      }
    }

    const company = initialCompanies.find((c) => c.slug === slug);
    if (!company) return null;

    const associatedModels = initialModels.filter((m) => m.companyId === company.id);
    return {
      ...company,
      models: associatedModels,
      _count: {
        models: associatedModels.length,
      },
    };
  }
}
