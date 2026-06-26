import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Link href="/" aria-label="Accueil Sekai">
        <Logo className="text-xl" />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="text-xs text-muted-foreground">
        Apprends la géographie du monde, un jour à la fois.
      </p>
    </div>
  );
}
