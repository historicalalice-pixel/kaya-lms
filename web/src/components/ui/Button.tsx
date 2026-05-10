"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

/**
 * Press feedback follows Emil's rule:
 *   - transition: transform var(--dur-press) var(--ease-out)
 *   - :active { transform: scale(0.97) }
 *
 * Hover effects use plain Tailwind `hover:` utilities and are
 * gated globally for touch devices via the `.ui-hover` class
 * (see globals.css "HOVER GATE" block).
 */

const base =
  "press ui-hover relative inline-flex select-none items-center justify-center gap-2 " +
  "font-sans uppercase tracking-[0.18em] rounded-[12px] " +
  "outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.6)] " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 " +
  "whitespace-nowrap " +
  "transition-[color,border-color,background-color,box-shadow] duration-[var(--dur-popover)] ease-[var(--ease-out)]";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[0.66rem]",
  md: "h-11 px-5 text-[0.72rem]",
  lg: "h-14 px-8 text-[0.78rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.05)] text-[rgba(245,239,230,0.96)] " +
    "hover:border-[rgba(227,196,136,0.92)] hover:bg-[rgba(201,169,110,0.09)] " +
    "hover:shadow-[0_10px_26px_rgba(201,169,110,0.08)]",
  secondary:
    "border border-[rgba(201,169,110,0.22)] bg-[rgba(255,255,255,0.02)] text-[rgba(223,217,207,0.85)] " +
    "hover:border-[rgba(227,196,136,0.7)] hover:bg-[rgba(201,169,110,0.06)]",
  ghost:
    "border border-transparent bg-transparent text-[rgba(229,222,210,0.8)] " +
    "hover:bg-[rgba(201,169,110,0.06)] hover:text-[var(--gold-light)]",
  danger:
    "border border-[rgba(220,80,60,0.4)] bg-[rgba(220,80,60,0.06)] text-[rgba(244,150,138,0.95)] " +
    "hover:border-[rgba(220,80,60,0.7)] hover:bg-[rgba(220,80,60,0.10)]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading,
    leftIcon,
    rightIcon,
    fullWidth,
    type = "button",
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
      <span className={cn(isLoading && "opacity-70")}>{children}</span>
      {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </button>
  );
});

export default Button;
