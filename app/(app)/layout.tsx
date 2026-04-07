import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { isAuthEnabled } from "@/lib/auth/mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isAuthEnabled()) {
    return <AppShell>{children}</AppShell>;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
