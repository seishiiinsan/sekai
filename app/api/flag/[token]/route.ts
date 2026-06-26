import { NextRequest } from "next/server";
import { verifyFlagToken } from "@/lib/game/flag-token";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Flag proxy (spec §11 anti-cheat). Serves a country's flag behind an opaque,
 * session-scoped token so the URL never reveals the ISO code / answer. The token
 * is decrypted server-side to a country id; the upstream flagcdn image is fetched
 * and streamed back, so flagcdn never appears in the client's network tab either.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const decoded = verifyFlagToken(token);
  if (!decoded) return new Response("Not found", { status: 404 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("countries")
    .select("flag_svg_url")
    .eq("id", decoded.countryId)
    .single();

  const url = data?.flag_svg_url;
  if (!url) return new Response("Not found", { status: 404 });

  const upstream = await fetch(url, { cache: "force-cache" });
  if (!upstream.ok) return new Response("Upstream error", { status: 502 });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/svg+xml",
      // Token is opaque + session-scoped; private caching is safe and avoids
      // re-fetching flagcdn on every render within a series.
      "Cache-Control": "private, max-age=3600, immutable",
    },
  });
}
