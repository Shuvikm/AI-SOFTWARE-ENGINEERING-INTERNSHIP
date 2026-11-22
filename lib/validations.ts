import { z } from "zod";

export const modelFilterSchema = z.object({
  query: z.string().optional(),
  provider: z.string().optional(),
  company: z.string().optional(),
  category: z.string().optional(),
  capability: z.string().optional(),
  sortBy: z.enum(["popularity", "releaseDate", "contextWindow", "benchmark"]).default("popularity"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export const searchSchema = z.object({
  q: z.string().max(100).default(""),
});

export const recommendationSchema = z.object({
  useCase: z.enum(["coding", "reasoning", "multimodal", "fast-inference", "creative-writing", "enterprise-search"]),
  budget: z.enum(["low", "medium", "unlimited"]).default("unlimited"),
  contextRequirement: z.enum(["standard", "long", "massive"]).default("standard"),
});

export const calculatorSchema = z.object({
  inputTokens: z.coerce.number().nonnegative().default(1000000),
  outputTokens: z.coerce.number().nonnegative().default(200000),
  modelSlug: z.string().optional(),
});
