/**
 * Seeds public.countries (spec §4: ingest once, store in DB). Idempotent —
 * upserts on cca3, so it doubles as the periodic refresh job.
 *
 *   npm run seed
 *
 * Source: mledoze/countries (the open dataset restcountries is built from — no
 * API key, stable, includes FR translations). restcountries' own API moved to a
 * key-gated v5, so we read the upstream data directly. Flag images come from
 * flagcdn.com, keyed by ISO alpha-2.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "../lib/supabase/database.types";
import { normalize } from "../lib/text";

config({ path: ".env.local" });

const SOURCE_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

// Below this area (km²), or any non-UN / non-independent territory, is tagged
// difficulty = 2 and excluded from play unless the player opts into micro-states.
const MICRO_AREA_KM2 = 500;

interface NameBlock {
  official: string;
  common: string;
}

interface MledozeCountry {
  name: {
    common: string;
    official: string;
    native?: Record<string, NameBlock>;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region?: string;
  subregion?: string;
  area?: number;
  latlng?: [number, number];
  independent?: boolean;
  unMember?: boolean;
  status?: string;
  altSpellings?: string[];
  translations?: Record<string, NameBlock>;
}

function flagUrls(cca2: string): { svg: string; png: string } {
  const code = cca2.toLowerCase();
  return {
    svg: `https://flagcdn.com/${code}.svg`,
    png: `https://flagcdn.com/w320/${code}.png`,
  };
}

function buildAliases(c: MledozeCountry, nameFr: string): string[] {
  const raw: string[] = [
    c.name.common,
    c.name.official,
    nameFr,
    c.translations?.fra?.official ?? "",
    ...(c.altSpellings ?? []),
  ];
  for (const native of Object.values(c.name.native ?? {})) {
    raw.push(native.common, native.official);
  }
  const seen = new Set<string>();
  const aliases: string[] = [];
  for (const value of raw) {
    const n = normalize(value);
    // Drop empties and the 2-letter ISO codes restcountries/mledoze list in altSpellings.
    if (n.length < 3 || seen.has(n)) continue;
    seen.add(n);
    aliases.push(n);
  }
  return aliases;
}

function isMicroState(c: MledozeCountry): boolean {
  if (c.unMember === false) return true;
  if (c.independent === false) return true;
  if (c.area != null && c.area < MICRO_AREA_KM2) return true;
  return false;
}

function toRow(c: MledozeCountry): TablesInsert<"countries"> {
  const nameFr = c.translations?.fra?.common ?? c.name.common;
  const flags = flagUrls(c.cca2);
  return {
    cca2: c.cca2,
    cca3: c.cca3,
    name_common: c.name.common,
    name_official: c.name.official,
    name_fr: nameFr,
    capital: c.capital ?? [],
    // population is not in the upstream dataset; reserved for the comparisons
    // mode (V1) and backfilled later. Kept at 0 for now.
    population: 0,
    area: c.area ?? null,
    region: c.region ?? null,
    subregion: c.subregion ?? null,
    flag_svg_url: flags.svg,
    flag_png_url: flags.png,
    flag_alt: `Drapeau de ${nameFr}`,
    lat: c.latlng?.[0] ?? null,
    lng: c.latlng?.[1] ?? null,
    difficulty: isMicroState(c) ? 2 : 1,
    aliases: buildAliases(c, nameFr),
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  }

  console.log("Fetching country dataset …");
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Source returned ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as MledozeCountry[];
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape (expected an array of countries).");
  }
  console.log(`Fetched ${data.length} countries.`);

  const rows = data
    .filter((c) => c.cca2 && c.cca3 && c.name?.common)
    .map(toRow);

  const core = rows.filter((r) => r.difficulty === 1).length;
  console.log(
    `Prepared ${rows.length} rows (${core} core, ${rows.length - core} micro-states/territories).`,
  );

  const supabase = createClient<Database>(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const CHUNK = 100;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("countries")
      .upsert(chunk, { onConflict: "cca3" });
    if (error) throw new Error(`Upsert failed at row ${i}: ${error.message}`);
    console.log(`Upserted ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }

  console.log("✅ Seed complete.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
