import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CachedCountry {
  id: number;
  name_fr: string;
  name_official: string;
  capital: string[];
  region: string | null;
  subregion: string | null;
  area: number | null;
  cca2: string;
  cca3: string;
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
      .select("id,name_fr,name_official,capital,region,subregion,area,cca2,cca3,flag_svg_url,flag_alt,difficulty,aliases,has_capital");
    return (data ?? []) as CachedCountry[];
  },
  ["countries-all"],
  { revalidate: 86400, tags: ["countries"] },
);
