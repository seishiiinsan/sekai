import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getAllCountries, type CachedCountry } from "@/lib/data/countries-cache";
import { MASTERED_BOX } from "@/lib/game/srs";

export type MasteryStatus = "unseen" | "learning" | "mastered";

export interface CountryMastery {
  flags: MasteryStatus;
  capitals: MasteryStatus;
}

export interface AtlasCountry extends CachedCountry {
  mastery: CountryMastery;
}

function toStatus(level: number | undefined): MasteryStatus {
  if (level == null) return "unseen";
  return level >= MASTERED_BOX ? "mastered" : "learning";
}

export async function getAtlasData(userId: string): Promise<AtlasCountry[]> {
  const supabase = await createClient();

  const [countries, { data: rows }] = await Promise.all([
    getAllCountries(),
    supabase
      .from("mastery_items")
      .select("country_id,mode,srs_level")
      .eq("user_id", userId),
  ]);

  const masteryMap = new Map<number, Partial<Record<"flags" | "capitals", number>>>();
  for (const row of rows ?? []) {
    const entry = masteryMap.get(row.country_id) ?? {};
    entry[row.mode as "flags" | "capitals"] = row.srs_level;
    masteryMap.set(row.country_id, entry);
  }

  return countries.map((c) => {
    const m = masteryMap.get(c.id) ?? {};
    return {
      ...c,
      mastery: {
        flags: toStatus(m.flags),
        capitals: toStatus(m.capitals),
      },
    };
  });
}
