import Link from "next/link";
import {
  Flag,
  Building2,
  Map,
  BarChart3,
  TrendingUp,
  Flame,
  Trophy,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroFlags } from "@/components/marketing/hero-flags";

const MODES = [
  { icon: Flag, title: "Drapeaux", desc: "Reconnais le drapeau, retrouve le pays — et inversement." },
  { icon: Building2, title: "Capitales", desc: "Associe chaque pays à sa capitale, dans les deux sens." },
  { icon: Map, title: "Carte", desc: "Localise les pays sur la carte du monde.", soon: true },
  { icon: BarChart3, title: "Comparaisons", desc: "Le plus peuplé ? Le plus grand ? Le « plus ou moins ».", soon: true },
];

const FEATURES = [
  { icon: TrendingUp, title: "XP & niveaux", desc: "Gagne de l'XP à chaque bonne réponse et grimpe les paliers." },
  { icon: Flame, title: "Streak quotidien", desc: "Une heatmap d'activité qui te donne envie de revenir chaque jour." },
  { icon: Brain, title: "Répétition espacée", desc: "Les notions fragiles reviennent au bon moment, pour mémoriser durablement." },
  { icon: Trophy, title: "Classements", desc: "Mesure-toi aux autres joueurs sur le classement global." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
              Se connecter
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href="/signup" />}>
              Commencer
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Apprends en 3 minutes par jour
            </span>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Maîtrise la géographie du monde, un jour à la fois.
            </h1>
            <p className="text-balance text-lg text-muted-foreground">
              Pays, capitales et drapeaux — appris durablement grâce à la répétition
              espacée. Progresse, garde ton streak, grimpe dans le classement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
                Créer mon compte gratuit
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/login" />}>
                J&apos;ai déjà un compte
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Inscription en 10 secondes · Aucune carte bancaire
            </p>
          </div>
          <HeroFlags />
        </section>

        {/* Modes */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Quatre façons de jouer</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Des séries courtes, une variante directe et inverse pour chaque mode.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MODES.map(({ icon: Icon, title, desc, soon }) => (
                <Card key={title} className="relative">
                  <CardContent className="space-y-3 py-5">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{title}</h3>
                      {soon && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Bientôt
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gamification */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Conçu pour revenir chaque jour
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La gamification s&apos;exprime à travers ta progression, pas le clinquant.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="space-y-2">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-balance text-3xl font-bold tracking-tight">
              Prêt à faire le tour du monde ?
            </h2>
            <p className="mt-3 text-balance text-muted-foreground">
              Rejoins Sekai et commence ta première série en moins d&apos;une minute.
            </p>
            <Button size="lg" className="mt-6" nativeButton={false} render={<Link href="/signup" />}>
              Commencer maintenant
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo className="text-base" />
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Mentions légales</a>
            <a href="mailto:contact@sekai.app" className="hover:text-foreground">Contact</a>
          </div>
          <span>© {new Date().getFullYear()} Sekai</span>
        </div>
      </footer>
    </div>
  );
}
