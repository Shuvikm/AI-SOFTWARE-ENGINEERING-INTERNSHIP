import { prisma } from "@/lib/prisma";
import {
  initialBenchmarks,
  initialModelBenchmarks,
  initialModels,
  initialCompanies,
} from "@/lib/data/mock-data";
import { Benchmark } from "@/types";

export class BenchmarkService {
  static async getAll(): Promise<Benchmark[]> {
    if (prisma) {
      try {
        const dbBenchmarks = await prisma.benchmark.findMany({
          include: {
            models: {
              include: {
                model: true,
              },
            },
          },
        });
        if (dbBenchmarks && dbBenchmarks.length > 0) {
          return dbBenchmarks as unknown as Benchmark[];
        }
      } catch (err) {
        console.warn("DB query failed for benchmarks:", err);
      }
    }
    return initialBenchmarks;
  }

  static async getRankings(benchmarkId?: string) {
    if (prisma) {
      try {
        const where = benchmarkId ? { benchmarkId } : {};
        const rankings = await prisma.modelBenchmark.findMany({
          where,
          include: {
            model: {
              include: {
                company: true,
                provider: true,
              },
            },
            benchmark: true,
          },
          orderBy: {
            score: "desc",
          },
        });
        if (rankings.length > 0) return rankings;
      } catch (err) {
        console.warn("DB getRankings failed:", err);
      }
    }

    let bms = initialModelBenchmarks;
    if (benchmarkId) {
      bms = bms.filter((mb) => mb.benchmarkId === benchmarkId);
    }

    return bms
      .map((mb) => {
        const model = initialModels.find((m) => m.id === mb.modelId);
        const comp = model ? initialCompanies.find((c) => c.id === model.companyId) : undefined;
        return {
          ...mb,
          benchmark: initialBenchmarks.find((b) => b.id === mb.benchmarkId),
          model: model ? { ...model, company: comp } : undefined,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}
