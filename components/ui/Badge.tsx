import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "live" | "gold" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-kora-green/20 text-kora-teal",
        variant === "live" && "bg-kora-alert/20 text-kora-alert",
        variant === "gold" && "bg-kora-gold/20 text-kora-gold",
        variant === "outline" && "border border-kora-green/40 text-kora-teal",
        className
      )}
    >
      {children}
    </span>
  );
}
