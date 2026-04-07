import { redirect } from "next/navigation";
import { isAuthEnabled } from "@/lib/auth/mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams?: Promise<{
    status?: string;
    error?: string;
    email?: string;
  }>;
};

function getErrorMessage(error: string) {
  if (error.includes("rate limit")) {
    return "잠시 후 다시 시도하세요. Supabase 메일 발송 제한에 걸렸을 수 있습니다.";
  }

  if (error.includes("Error sending magic link")) {
    return "매직 링크 발송에 실패했습니다. Supabase Email 설정을 확인하세요.";
  }

  return "로그인 메일을 보내지 못했습니다. 환경변수와 Supabase Auth 설정을 확인하세요.";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!isAuthEnabled()) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = (await searchParams) ?? {};
  const status = params.status;
  const error = params.error;
  const emailHint = params.email;

  if (user) {
    redirect("/");
  }

  async function signIn(formData: FormData) {
    "use server";

    const email = formData.get("email");

    if (typeof email !== "string" || email.length === 0) {
      redirect("/login?error=missing-email");
    }

    const serverClient = await createSupabaseServerClient();
    const { error } = await serverClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    redirect(`/login?status=sent&email=${encodeURIComponent(email)}`);
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
          이메일 로그인으로 인증합니다.
        </p>
        {status === "sent" ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
            {emailHint
              ? `${emailHint} 주소로 로그인 메일을 보냈습니다. 메일함과 스팸함을 확인하세요.`
              : "로그인 메일을 보냈습니다. 메일함과 스팸함을 확인하세요."}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {getErrorMessage(error)}
          </p>
        ) : null}
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
            로그인 메일 보내기
          </button>
        </form>
      </section>
    </main>
  );
}
