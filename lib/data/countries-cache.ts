import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CachedCountry {
  id: number;
  name_fr: string;
  capital: string[];
  region: string | null;
  flag_svg_url: string | null;
  flag_alt: string | null;
  difficulty: number;
  aliases: string[];
  has_capital: boolean;
}

export const getAllCountries = unstable_cache(
  async (): Promise<CachedCountry[]> => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("countries")
      .select("id,name_fr,capital,region,flag_svg_url,flag_alt,difficulty,aliases,has_capital");
    return (data ?? []) as CachedCountry[];
  },
  ["countries-all"],
  { revalidate: 86400, tags: ["countries"] },
);
