"use client";

import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          suppressHydrationWarning
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            active === tab.id
              ? "bg-kora-green text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
