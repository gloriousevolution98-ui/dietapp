import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  async function signIn(formData: FormData) {
    "use server";

    const email = formData.get("email");

    if (typeof email !== "string" || email.length === 0) {
      return;
    }

    const serverClient = await createSupabaseServerClient();
    await serverClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
      },
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <section className="rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(71,55,38,0.12)] backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--accent)]">
          Body OS
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          로그인
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Supabase magic link로 MVP 인증을 먼저 연결합니다.
        </p>
        <form action={signIn} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              이메일
            </span>
            <input
              required
              type="email"
              name="email"
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-base outline-none ring-0"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-base font-medium text-white"
          >
            매직 링크 보내기
          </button>
        </form>
      </section>
    </main>
  );
}
