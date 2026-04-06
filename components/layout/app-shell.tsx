import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-5">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,rgba(200,144,91,0.3),transparent_68%)]" />
      {children}
      <MobileBottomNav />
    </div>
  );
}
