import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  secondary:
    "border border-white/10 bg-white/5 text-zinc-100 hover:border-cyan-300/40 hover:bg-white/10",
  ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
  danger:
    "border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
