/**
 * Predefined avatar bank (spec §13.4 — banque d'avatars prédéfinis for the MVP,
 * upload/generative deferred). Stored as a short key on the profile; rendered as
 * an emoji on a tinted disc, so no Storage round-trips are needed.
 */
export const AVATARS = [
  { key: "globe", emoji: "🌍", label: "Globe" },
  { key: "compass", emoji: "🧭", label: "Boussole" },
  { key: "map", emoji: "🗺️", label: "Carte" },
  { key: "mountain", emoji: "⛰️", label: "Montagne" },
  { key: "volcano", emoji: "🌋", label: "Volcan" },
  { key: "island", emoji: "🏝️", label: "Île" },
  { key: "city", emoji: "🏙️", label: "Ville" },
  { key: "desert", emoji: "🏜️", label: "Désert" },
  { key: "snow", emoji: "🏔️", label: "Sommet" },
  { key: "rocket", emoji: "🚀", label: "Fusée" },
  { key: "satellite", emoji: "🛰️", label: "Satellite" },
  { key: "flag", emoji: "🚩", label: "Drapeau" },
] as const;

export type AvatarKey = (typeof AVATARS)[number]["key"];

export const AVATAR_KEYS: string[] = AVATARS.map((a) => a.key);
export const DEFAULT_AVATAR: AvatarKey = "globe";

export function avatarEmoji(key: string | null | undefined): string {
  return AVATARS.find((a) => a.key === key)?.emoji ?? "🌍";
}
