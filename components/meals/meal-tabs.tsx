"use client";

import { cn } from "@/lib/utils/cn";

const tabs = ["Today", "History", "Templates", "Foods"] as const;

type MealTabsProps = {
  activeTab: (typeof tabs)[number];
  onChange: (tab: (typeof tabs)[number]) => void;
};

export function MealTabs({ activeTab, onChange }: MealTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            activeTab === tab
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--muted)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
