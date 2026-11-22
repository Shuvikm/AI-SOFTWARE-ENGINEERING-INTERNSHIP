import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

async function runMigration() {
  console.log('Upgrading schema in Neon PostgreSQL...');
  await pool.query(`
    ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
    ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT true;

    ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
    ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT true;

    ALTER TABLE "Model" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
    ALTER TABLE "Model" ADD COLUMN IF NOT EXISTS "dataStatus" TEXT NOT NULL DEFAULT 'verified';
    ALTER TABLE "Model" ADD COLUMN IF NOT EXISTS "lastVerifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE "Benchmark" ADD COLUMN IF NOT EXISTS "scoringScale" TEXT DEFAULT '0-100 percentage';
    ALTER TABLE "Benchmark" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;

    ALTER TABLE "ModelBenchmark" ADD COLUMN IF NOT EXISTS "scoringScale" TEXT DEFAULT '0-100 percentage';
    ALTER TABLE "ModelBenchmark" ADD COLUMN IF NOT EXISTS "methodology" TEXT;
    ALTER TABLE "ModelBenchmark" ADD COLUMN IF NOT EXISTS "evalDate" TIMESTAMP(3);
    ALTER TABLE "ModelBenchmark" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
    ALTER TABLE "ModelBenchmark" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT true;

    CREATE TABLE IF NOT EXISTS "ModelProvider" (
      "id" TEXT NOT NULL,
      "modelId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "endpointUrl" TEXT,
      "isPrimary" BOOLEAN NOT NULL DEFAULT false,
      "status" TEXT NOT NULL DEFAULT 'active',
      "sourceUrl" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "ModelPricing" (
      "id" TEXT NOT NULL,
      "modelId" TEXT NOT NULL,
      "providerId" TEXT,
      "inputPricePerM" DOUBLE PRECISION NOT NULL,
      "outputPricePerM" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'USD',
      "pricingUnit" TEXT NOT NULL DEFAULT '1M tokens',
      "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "sourceUrl" TEXT,
      "verified" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ModelPricing_pkey" PRIMARY KEY ("id")
    );

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ModelProvider_modelId_providerId_key') THEN
        ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_providerId_key" UNIQUE ("modelId", "providerId");
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ModelProvider_modelId_fkey') THEN
        ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ModelProvider_providerId_fkey') THEN
        ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ModelPricing_modelId_fkey') THEN
        ALTER TABLE "ModelPricing" ADD CONSTRAINT "ModelPricing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ModelPricing_providerId_fkey') THEN
        ALTER TABLE "ModelPricing" ADD CONSTRAINT "ModelPricing_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      END IF;
    END $$;
  `);
  console.log('Successfully upgraded schema in Neon PostgreSQL!');
  await pool.end();
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
