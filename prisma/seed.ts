import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  initialCompanies,
  initialProviders,
  initialBenchmarks,
  initialModels,
  initialModelProviders,
  initialModelPricings,
  initialModelBenchmarks,
} from "../lib/data/mock-data.js";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL in environment for seeding");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting enhanced OneAtlas database seeding...");

  // 1. Seed Companies
  console.log("Upserting companies with data provenance...");
  for (const comp of initialCompanies) {
    await prisma.company.upsert({
      where: { slug: comp.slug },
      update: {
        name: comp.name,
        description: comp.description,
        website: comp.website,
        logo: comp.logo,
        sourceUrl: comp.sourceUrl,
        verified: comp.verified ?? true,
      },
      create: {
        id: comp.id,
        name: comp.name,
        slug: comp.slug,
        description: comp.description,
        website: comp.website,
        logo: comp.logo,
        sourceUrl: comp.sourceUrl,
        verified: comp.verified ?? true,
      },
    });
  }

  // 2. Seed Providers
  console.log("Upserting providers...");
  for (const prov of initialProviders) {
    await prisma.provider.upsert({
      where: { slug: prov.slug },
      update: {
        name: prov.name,
        description: prov.description,
        website: prov.website,
        sourceUrl: prov.sourceUrl,
        verified: prov.verified ?? true,
      },
      create: {
        id: prov.id,
        name: prov.name,
        slug: prov.slug,
        description: prov.description,
        website: prov.website,
        sourceUrl: prov.sourceUrl,
        verified: prov.verified ?? true,
      },
    });
  }

  // 3. Seed Benchmarks
  console.log("Upserting benchmarks...");
  for (const bm of initialBenchmarks) {
    await prisma.benchmark.upsert({
      where: { name: bm.name },
      update: {
        description: bm.description,
        category: bm.category,
        scoringScale: bm.scoringScale,
        sourceUrl: bm.sourceUrl,
      },
      create: {
        id: bm.id,
        name: bm.name,
        description: bm.description,
        category: bm.category,
        scoringScale: bm.scoringScale,
        sourceUrl: bm.sourceUrl,
      },
    });
  }

  // 4. Seed Models
  console.log("Upserting models...");
  for (const mod of initialModels) {
    await prisma.model.upsert({
      where: { slug: mod.slug },
      update: {
        name: mod.name,
        description: mod.description,
        modelType: mod.modelType,
        contextWindow: mod.contextWindow,
        inputPrice: mod.inputPrice,
        outputPrice: mod.outputPrice,
        capabilities: mod.capabilities,
        modalities: mod.modalities,
        releaseDate: mod.releaseDate ? new Date(mod.releaseDate) : null,
        companyId: mod.companyId,
        providerId: mod.providerId,
        sourceUrl: mod.sourceUrl,
        dataStatus: mod.dataStatus || "verified",
      },
      create: {
        id: mod.id,
        name: mod.name,
        slug: mod.slug,
        description: mod.description,
        modelType: mod.modelType,
        contextWindow: mod.contextWindow,
        inputPrice: mod.inputPrice,
        outputPrice: mod.outputPrice,
        capabilities: mod.capabilities,
        modalities: mod.modalities,
        releaseDate: mod.releaseDate ? new Date(mod.releaseDate) : null,
        companyId: mod.companyId,
        providerId: mod.providerId,
        sourceUrl: mod.sourceUrl,
        dataStatus: mod.dataStatus || "verified",
      },
    });
  }

  // 5. Seed ModelProvider (Many-to-Many Hosting)
  console.log("Upserting model hosting providers (many-to-many)...");
  for (const mp of initialModelProviders) {
    await prisma.modelProvider.upsert({
      where: {
        modelId_providerId: {
          modelId: mp.modelId,
          providerId: mp.providerId,
        },
      },
      update: {
        endpointUrl: mp.endpointUrl,
        isPrimary: mp.isPrimary,
        status: mp.status,
        sourceUrl: mp.sourceUrl,
      },
      create: {
        id: mp.id,
        modelId: mp.modelId,
        providerId: mp.providerId,
        endpointUrl: mp.endpointUrl,
        isPrimary: mp.isPrimary,
        status: mp.status,
        sourceUrl: mp.sourceUrl,
      },
    });
  }

  // 6. Seed ModelPricing (Granular token pricing records)
  console.log("Upserting token pricing records...");
  for (const pr of initialModelPricings) {
    await prisma.modelPricing.upsert({
      where: { id: pr.id },
      update: {
        inputPricePerM: pr.inputPricePerM,
        outputPricePerM: pr.outputPricePerM,
        currency: pr.currency,
        pricingUnit: pr.pricingUnit,
        effectiveDate: new Date(pr.effectiveDate),
        sourceUrl: pr.sourceUrl,
        verified: pr.verified,
      },
      create: {
        id: pr.id,
        modelId: pr.modelId,
        providerId: pr.providerId,
        inputPricePerM: pr.inputPricePerM,
        outputPricePerM: pr.outputPricePerM,
        currency: pr.currency,
        pricingUnit: pr.pricingUnit,
        effectiveDate: new Date(pr.effectiveDate),
        sourceUrl: pr.sourceUrl,
        verified: pr.verified,
      },
    });
  }

  // 7. Seed Model Benchmarks (With methodology, scale, and source)
  console.log("Upserting verified model benchmark evaluations...");
  for (const mb of initialModelBenchmarks) {
    await prisma.modelBenchmark.upsert({
      where: {
        modelId_benchmarkId: {
          modelId: mb.modelId,
          benchmarkId: mb.benchmarkId,
        },
      },
      update: {
        score: mb.score,
        rank: mb.rank,
        scoringScale: mb.scoringScale,
        methodology: mb.methodology,
        evalDate: mb.evalDate ? new Date(mb.evalDate) : null,
        sourceUrl: mb.sourceUrl,
        verified: mb.verified ?? true,
      },
      create: {
        id: mb.id,
        modelId: mb.modelId,
        benchmarkId: mb.benchmarkId,
        score: mb.score,
        rank: mb.rank,
        scoringScale: mb.scoringScale,
        methodology: mb.methodology,
        evalDate: mb.evalDate ? new Date(mb.evalDate) : null,
        sourceUrl: mb.sourceUrl,
        verified: mb.verified ?? true,
      },
    });
  }

  console.log("Enhanced OneAtlas seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
