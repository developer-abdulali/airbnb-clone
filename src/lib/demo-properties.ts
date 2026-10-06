import { US_LISTINGS_SEED } from "@/data/us-listings-seed";
import { DemoProperty } from "@/types/demo-property";

export type { DemoProperty } from "@/types/demo-property";

let inMemoryCache: DemoProperty[] | null = null;

export const fetchDemoProperties = async (): Promise<DemoProperty[]> => {
  if (inMemoryCache) return inMemoryCache;
  inMemoryCache = US_LISTINGS_SEED;
  return inMemoryCache;
};
