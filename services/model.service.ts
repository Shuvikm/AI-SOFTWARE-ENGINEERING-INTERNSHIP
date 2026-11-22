import { prisma } from "@/lib/prisma";
import {
  initialModels,
  initialCompanies,
  initialProviders,
  initialBenchmarks,
  initialModelBenchmarks,
  initialModelProviders,
  initialModelPricings,
} from "@/lib/data/mock-data";
import { Model, ModelFilters, DashboardStats } from "@/types";

export class ModelService {
  static async getAll(filters: ModelFilters = {}): Promise<{
    models: Model[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      query,
      provider,
      company,
      category,
      capability,
      sortBy = "popularity",
      order = "desc",
      page = 1,
      limit = 12,
    } = filters;

    // Try Prisma DB if live database is connected and populated
    if (prisma) {
      try {
        const where: Record<string, unknown> = {};
        if (query) {
          where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ];
        }
        if (provider) {
          where.OR = [
            { provider: { slug: provider } },
            { hostedProviders: { some: { provider: { slug: provider } } } },
          ];
        }
        if (company) {
          where.company = { slug: company };
        }
        if (category) {
          where.modelType = category;
        }
        if (capability) {
          where.capabilities = { has: capability };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const total = await (prisma.model as any).count({ where });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbModels = await (prisma.model as any).findMany({
          where,
          include: {
            company: true,
            provider: true,
            hostedProviders: {
              include: { provider: true },
            },
            pricings: {
              include: { provider: true },
            },
            benchmarks: {
              include: { benchmark: true },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy:
            sortBy === "releaseDate"
              ? { releaseDate: order }
              : sortBy === "contextWindow"
              ? { contextWindow: order }
              : { createdAt: "desc" },
        });

        if (dbModels.length > 0 || total > 0) {
          return {
            models: dbModels as unknown as Model[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          };
        }
      } catch (err) {
        console.warn("DB query failed, fallback to repository data:", err);
      }
    }

    // High fidelity fallback data layer
    let result = [...initialModels].map((model) => {
      const comp = initialCompanies.find((c) => c.id === model.companyId);
      const prov = initialProviders.find((p) => p.id === model.providerId);
      const hosted = initialModelProviders
        .filter((mp) => mp.modelId === model.id)
        .map((mp) => ({
          ...mp,
          provider: initialProviders.find((p) => p.id === mp.providerId),
        }));
      const prices = initialModelPricings
        .filter((pr) => pr.modelId === model.id)
        .map((pr) => ({
          ...pr,
          provider: initialProviders.find((p) => p.id === pr.providerId),
        }));
      const bmList = initialModelBenchmarks
        .filter((mb) => mb.modelId === model.id)
        .map((mb) => ({
          ...mb,
          benchmark: initialBenchmarks.find((b) => b.id === mb.benchmarkId),
        }));
      return {
        ...model,
        company: comp,
        provider: prov,
        hostedProviders: hosted,
        pricings: prices,
        benchmarks: bmList,
      };
    });

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          m.company?.name.toLowerCase().includes(q) ||
          m.provider?.name.toLowerCase().includes(q)
      );
    }

    if (provider) {
      result = result.filter(
        (m) =>
          m.provider?.slug === provider ||
          m.providerId === provider ||
          m.hostedProviders?.some((hp) => hp.provider?.slug === provider)
      );
    }

    if (company) {
      result = result.filter(
        (m) => m.company?.slug === company || m.companyId === company
      );
    }

    if (category) {
      result = result.filter((m) => m.modelType === category);
    }

    if (capability) {
      result = result.filter((m) => m.capabilities.includes(capability));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "releaseDate") {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === "contextWindow") {
        return order === "asc"
          ? a.contextWindow - b.contextWindow
          : b.contextWindow - a.contextWindow;
      }
      if (sortBy === "benchmark") {
        const topScoreA = Math.max(...(a.benchmarks?.map((bm) => bm.score) || [0]), 0);
        const topScoreB = Math.max(...(b.benchmarks?.map((bm) => bm.score) || [0]), 0);
        return order === "asc" ? topScoreA - topScoreB : topScoreB - topScoreA;
      }
      const scoreA = (a.benchmarks?.length || 0) * 10 + (a.contextWindow > 500000 ? 5 : 0);
      const scoreB = (b.benchmarks?.length || 0) * 10 + (b.contextWindow > 500000 ? 5 : 0);
      return order === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });

    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);

    return {
      models: paginated,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  static async getBySlug(slug: string): Promise<Model | null> {
    if (prisma) {
      try {
        const dbModel = await prisma.model.findUnique({
          where: { slug },
          include: {
            company: true,
            provider: true,
            hostedProviders: {
              include: { provider: true },
            },
            pricings: {
              include: { provider: true },
            },
            benchmarks: {
              include: { benchmark: true },
            },
          },
        });
        if (dbModel) return dbModel as unknown as Model;
      } catch (err) {
        console.warn("DB getBySlug failed:", err);
      }
    }

    const model = initialModels.find((m) => m.slug === slug);
    if (!model) return null;

    const hosted = initialModelProviders
      .filter((mp) => mp.modelId === model.id)
      .map((mp) => ({
        ...mp,
        provider: initialProviders.find((p) => p.id === mp.providerId),
      }));

    const prices = initialModelPricings
      .filter((pr) => pr.modelId === model.id)
      .map((pr) => ({
        ...pr,
        provider: initialProviders.find((p) => p.id === pr.providerId),
      }));

    return {
      ...model,
      company: initialCompanies.find((c) => c.id === model.companyId),
      provider: initialProviders.find((p) => p.id === model.providerId),
      hostedProviders: hosted,
      pricings: prices,
      benchmarks: initialModelBenchmarks
        .filter((mb) => mb.modelId === model.id)
        .map((mb) => ({
          ...mb,
          benchmark: initialBenchmarks.find((b) => b.id === mb.benchmarkId),
        })),
    };
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const all = await this.getAll({ limit: 100 });
    const models = all.models;

    return {
      totalModels: models.length,
      totalProviders: initialProviders.length,
      totalCompanies: initialCompanies.length,
      totalBenchmarks: initialBenchmarks.length,
      popularModels: models.slice(0, 4),
      recentlyAddedModels: [...models].sort((a, b) => {
        const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return db - da;
      }).slice(0, 4),
      trendingModels: models.filter(m => m.capabilities.includes("multimodal-reasoning") || m.capabilities.includes("chain-of-thought")).slice(0, 4),
      topPerformingModels: [...models].sort((a, b) => {
        const avgA = (a.benchmarks?.reduce((acc, curr) => acc + curr.score, 0) || 0) / (a.benchmarks?.length || 1);
        const avgB = (b.benchmarks?.reduce((acc, curr) => acc + curr.score, 0) || 0) / (b.benchmarks?.length || 1);
        return avgB - avgA;
      }).slice(0, 4),
    };
  }

  // Token cost calculation across models
  static calculateTokenCosts(inputTokens: number, outputTokens: number, models: Model[]) {
    return models.map((m) => {
      const inputCost = (inputTokens / 1000000) * m.inputPrice;
      const outputCost = (outputTokens / 1000000) * m.outputPrice;
      const totalCost = inputCost + outputCost;
      return {
        modelId: m.id,
        name: m.name,
        slug: m.slug,
        company: m.company?.name,
        inputPrice: m.inputPrice,
        outputPrice: m.outputPrice,
        inputCost: Number(inputCost.toFixed(4)),
        outputCost: Number(outputCost.toFixed(4)),
        totalCost: Number(totalCost.toFixed(4)),
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }

  // Recommendations engine
  static getRecommendations(useCase: string, budget: string = "unlimited") {
    let candidates = [...initialModels];

    if (useCase === "coding") {
      candidates = candidates.filter((m) =>
        m.capabilities.includes("frontier-coding") ||
        m.capabilities.includes("code-generation") ||
        m.capabilities.includes("fill-in-the-middle")
      );
    } else if (useCase === "reasoning") {
      candidates = candidates.filter((m) =>
        m.capabilities.includes("chain-of-thought") ||
        m.capabilities.includes("complex-reasoning")
      );
    } else if (useCase === "multimodal") {
      candidates = candidates.filter((m) =>
        m.modalities.length > 1 || m.capabilities.includes("multimodal-reasoning")
      );
    } else if (useCase === "fast-inference") {
      candidates = candidates.filter((m) =>
        m.capabilities.includes("fast-inference") || m.capabilities.includes("ultra-fast")
      );
    }

    if (budget === "low") {
      candidates = candidates.filter((m) => m.inputPrice <= 1.0);
    } else if (budget === "medium") {
      candidates = candidates.filter((m) => m.inputPrice <= 4.0);
    }

    return candidates.map((model) => ({
      ...model,
      company: initialCompanies.find((c) => c.id === model.companyId),
      provider: initialProviders.find((p) => p.id === model.providerId),
      benchmarks: initialModelBenchmarks
        .filter((mb) => mb.modelId === model.id)
        .map((mb) => ({
          ...mb,
          benchmark: initialBenchmarks.find((b) => b.id === mb.benchmarkId),
        })),
    }));
  }
}
