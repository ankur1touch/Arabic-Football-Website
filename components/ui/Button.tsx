import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" && "bg-kora-green text-white hover:bg-kora-green-dark",
        variant === "secondary" && "bg-white/10 text-white hover:bg-white/15",
        variant === "ghost" && "text-slate-300 hover:bg-white/5",
        variant === "outline" && "border border-white/20 text-white hover:border-kora-green",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
