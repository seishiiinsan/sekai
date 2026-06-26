import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo className="text-xl" />
      <div className="space-y-2">
        <p className="text-5xl font-bold tracking-tight">404</p>
        <p className="text-muted-foreground">Cette page n&apos;existe pas.</p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>
        Retour à l&apos;accueil
      </Button>
    </main>
  );
}
