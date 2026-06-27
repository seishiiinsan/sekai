import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { getAtlasData } from "@/lib/data/atlas";
import { AtlasGrid } from "@/components/atlas/atlas-grid";

export const metadata: Metadata = { title: "Atlas" };

export default async function AtlasPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const countries = await getAtlasData(profile.id);

  const discovered = countries.filter(
    (c) => c.mastery.flags !== "unseen" || c.mastery.capitals !== "unseen",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Atlas</h1>
        <p className="text-sm text-muted-foreground">
          {discovered > 0
            ? `${discovered} pays découvert${discovered > 1 ? "s" : ""} sur ${countries.length}.`
            : `${countries.length} pays à explorer.`}
        </p>
      </div>

      <AtlasGrid countries={countries} />
    </div>
  );
}
