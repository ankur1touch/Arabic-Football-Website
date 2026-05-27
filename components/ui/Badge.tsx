import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "live"
    | "gold"
    | "outline"
    | "wc"
    | "tournament"
    | "muted"
    | "navy"
    | "green"
    | "yellow"
    | "red";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-kora-green/20 text-kora-teal",
        variant === "live" && "animate-pulse-live bg-kora-alert/20 text-kora-alert",
        variant === "gold" && "bg-kora-gold/20 text-kora-gold",
        variant === "outline" && "border border-kora-green/40 text-kora-teal",
        variant === "wc" && "bg-kora-gold/25 text-kora-gold ring-1 ring-kora-gold/30",
        variant === "tournament" && "bg-kora-green/15 text-kora-teal ring-1 ring-kora-green/25",
        variant === "muted" && "bg-white/5 text-slate-400",
        variant === "navy" && "bg-kora-mid text-slate-300 ring-1 ring-white/10",
        variant === "green" && "bg-kora-green/25 text-kora-teal",
        variant === "yellow" && "bg-amber-500/20 text-amber-300",
        variant === "red" && "bg-kora-alert/20 text-kora-alert",
        className
      )}
    >
      {children}
    </span>
  );
}
