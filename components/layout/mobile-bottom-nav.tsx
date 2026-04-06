"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-20 mx-auto flex w-[calc(100%-1.5rem)] max-w-md items-center justify-between rounded-[28px] border border-[var(--line)] bg-[rgba(255,252,247,0.9)] px-3 py-2 shadow-[0_18px_40px_rgba(71,55,38,0.16)] backdrop-blur">
      {APP_ROUTES.map((route) => {
        const isActive =
          route.href === "/"
            ? pathname === route.href
            : pathname === route.href || pathname.startsWith(`${route.href}/`);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-medium tracking-[0.02em] transition",
              isActive
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)]",
            )}
          >
            <span>{route.shortLabel}</span>
            <span className="mt-0.5 truncate text-[10px] opacity-80">
              {route.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
