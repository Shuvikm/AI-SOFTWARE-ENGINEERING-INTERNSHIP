import { prisma } from "@/lib/prisma";
import { initialProviders, initialModels } from "@/lib/data/mock-data";
import { Provider } from "@/types";

export class ProviderService {
  static async getAll(): Promise<Provider[]> {
    if (prisma) {
      try {
        const dbProviders = await prisma.provider.findMany({
          include: {
            models: {
              include: {
                company: true,
              },
            },
            _count: {
              select: { models: true },
            },
          },
        });
        if (dbProviders && dbProviders.length > 0) {
          return dbProviders as unknown as Provider[];
        }
      } catch (err) {
        console.warn("DB query failed for providers:", err);
      }
    }

    return initialProviders.map((prov) => {
      const associatedModels = initialModels.filter((m) => m.providerId === prov.id);
      return {
        ...prov,
        models: associatedModels,
        _count: {
          models: associatedModels.length,
        },
      };
    });
  }

  static async getBySlug(slug: string): Promise<Provider | null> {
    if (prisma) {
      try {
        const dbProv = await prisma.provider.findUnique({
          where: { slug },
          include: {
            models: {
              include: {
                company: true,
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
        if (dbProv) return dbProv as unknown as Provider;
      } catch (err) {
        console.warn("DB getBySlug failed for provider:", err);
      }
    }

    const prov = initialProviders.find((p) => p.slug === slug);
    if (!prov) return null;

    const associatedModels = initialModels.filter((m) => m.providerId === prov.id);
    return {
      ...prov,
      models: associatedModels,
      _count: {
        models: associatedModels.length,
      },
    };
  }
}
