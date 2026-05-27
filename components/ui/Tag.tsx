import { cn } from "@/lib/cn";

const TAG_STYLES: Record<string, string> = {
  "premier-league": "bg-blue-500/15 text-blue-300",
  "la-liga": "bg-orange-500/15 text-orange-300",
  champions: "bg-purple-500/15 text-purple-300",
  transfers: "bg-emerald-500/15 text-emerald-300",
  "world-cup": "bg-kora-gold/20 text-kora-gold",
  national: "bg-kora-green/15 text-kora-teal",
  analysis: "bg-slate-500/15 text-slate-300",
  default: "bg-white/5 text-slate-400",
};

export function Tag({
  label,
  slug,
  className,
}: {
  label: string;
  slug?: string;
  className?: string;
}) {
  const key = slug ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        TAG_STYLES[key] ?? TAG_STYLES.default,
        className
      )}
    >
      {label}
    </span>
  );
}
