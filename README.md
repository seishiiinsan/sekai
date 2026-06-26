# Sekai 🌍

Apprends la géographie du monde (pays, capitales, drapeaux) par la répétition
espacée. Boucle d'engagement quotidienne : XP, niveaux, streaks, classement.

MVP vertical slice — voir `CDC-fonctionnel-sekai.md` pour le cahier des charges complet.

## Stack

- **Next.js 16** (App Router, TypeScript) — fullstack, Server Actions pour la
  logique sensible.
- **Supabase** — PostgreSQL, Auth (email/mot de passe, sans confirmation), RLS.
- **Tailwind CSS 4** + **shadcn/ui** (base-ui) — design « outil métier gamifié »
  (slate + un accent indigo).
- **Motion** (Framer Motion) — animations sobres, `prefers-reduced-motion` respecté.

## Périmètre du MVP

- Auth (inscription en 10 s, sans email de confirmation).
- 2 modes × 2 variantes : **Drapeaux** et **Capitales**, direct + inverse.
- Réponses en **QCM** ou **saisie libre** (tolérante aux accents et fautes).
- **XP / niveaux**, **streaks** (avec gel), **répétition espacée** (SM-2 simplifié).
- **Classement global**, **profil** (stats + maîtrise par mode), heatmap d'activité.

Reporté (V1/V2) : modes Carte & Comparaisons, ligues, badges, duels, amis.

## Mise en route

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs Supabase
npm run seed                 # ingère ~250 pays (idempotent)
npm run dev
```

### Variables d'environnement (`.env.local`)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publique (client) |
| `SUPABASE_SECRET_KEY` | Clé `service_role` — **serveur uniquement**, jamais exposée |

## Scripts

- `npm run dev` / `build` / `start`
- `npm test` — tests unitaires du moteur de jeu (XP, SRS, validation)
- `npm run seed` — (ré)ingestion des pays depuis le dataset mledoze + flagcdn

## Architecture & sécurité (anti-triche)

La validation des réponses et toute attribution d'XP/streak/maîtrise se font
**exclusivement côté serveur** (Server Actions), jamais côté client (CDC §11) :

- Les réponses correctes d'une série vivent dans `public.game_sessions`
  (`answer_key` JSON). RLS activée **sans policy** + droits révoqués → aucun accès
  client ; seules les Server Actions (clé `service_role`) y touchent.
- Les colonnes de score de `profiles` (`total_xp`, `level`, `streak`…) ne sont pas
  modifiables par le client (grants au niveau colonne) ; elles ne changent que via
  la fonction `SECURITY DEFINER` `apply_series_result`, réservée à `service_role`.
- `attempts`, `mastery_items`, `daily_activity` : lecture limitée au propriétaire
  (RLS), écriture serveur uniquement.

Moteur de jeu pur et testé : `lib/game/{xp,srs,validation,questions}.ts`.
Données géographiques ingérées une fois en base (CDC §4), rafraîchissables via
`npm run seed`.

### Durcissements recommandés (non bloquants)

- Activer « Leaked password protection » dans Supabase Auth.
- Proxy/obfuscation des URLs de drapeaux (flagcdn expose le code ISO) pour un
  anti-triche solo plus strict.
- Captcha léger / rate-limit renforcé à l'inscription (CDC §5).
