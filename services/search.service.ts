import { ModelService } from "./model.service";
import { CompanyService } from "./company.service";
import { ProviderService } from "./provider.service";

export class SearchService {
  static async searchGlobal(query: string) {
    if (!query || query.trim() === "") {
      return { models: [], companies: [], providers: [] };
    }

    const q = query.trim().toLowerCase();

    const [allModels, allCompanies, allProviders] = await Promise.all([
      ModelService.getAll({ query: q, limit: 10 }),
      CompanyService.getAll(),
      ProviderService.getAll(),
    ]);

    const matchingCompanies = allCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchingProviders = allProviders.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 5);

    return {
      models: allModels.models.slice(0, 6),
      companies: matchingCompanies,
      providers: matchingProviders,
    };
  }
}
