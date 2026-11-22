export interface ModelProvider {
  id: string;
  modelId: string;
  providerId: string;
  endpointUrl?: string | null;
  isPrimary: boolean;
  status: string;
  sourceUrl?: string | null;
  provider?: Provider | null;
  model?: Model | null;
}

export interface ModelPricing {
  id: string;
  modelId: string;
  providerId?: string | null;
  inputPricePerM: number;
  outputPricePerM: number;
  currency: string;
  pricingUnit: string;
  effectiveDate: string | Date;
  sourceUrl?: string | null;
  verified: boolean;
  provider?: Provider | null;
  model?: Model | null;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  sourceUrl?: string | null;
  verified?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  models?: Model[];
  _count?: {
    models: number;
  };
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  sourceUrl?: string | null;
  verified?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  models?: Model[];
  hostedModels?: ModelProvider[];
  pricings?: ModelPricing[];
  _count?: {
    models: number;
  };
}

export interface Benchmark {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  scoringScale?: string | null;
  sourceUrl?: string | null;
  createdAt?: string | Date;
}

export interface ModelBenchmark {
  id: string;
  modelId: string;
  benchmarkId: string;
  score: number;
  rank?: number | null;
  scoringScale?: string | null;
  methodology?: string | null;
  evalDate?: string | Date | null;
  sourceUrl?: string | null;
  verified?: boolean;
  benchmark?: Benchmark | null;
  model?: Model | null;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelType: string;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  capabilities: string[];
  modalities: string[];
  releaseDate: string | Date | null;
  companyId: string;
  providerId?: string | null;
  sourceUrl?: string | null;
  dataStatus?: string;
  lastVerifiedAt?: string | Date | null;
  company?: Company | null;
  provider?: Provider | null;
  hostedProviders?: ModelProvider[];
  pricings?: ModelPricing[];
  benchmarks?: ModelBenchmark[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DashboardStats {
  totalModels: number;
  totalProviders: number;
  totalCompanies: number;
  totalBenchmarks: number;
  popularModels: Model[];
  recentlyAddedModels: Model[];
  trendingModels: Model[];
  topPerformingModels: Model[];
}

export interface ModelFilters {
  query?: string;
  provider?: string;
  company?: string;
  category?: string;
  capability?: string;
  sortBy?: "popularity" | "releaseDate" | "contextWindow" | "benchmark";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
