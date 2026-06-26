import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileHeader } from "@/components/app/mobile-header";
import { MobileNav } from "@/components/app/nav-links";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <AppSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader profile={profile} />
        <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
