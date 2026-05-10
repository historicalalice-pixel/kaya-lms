"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "panel" | "inset" | "subtle";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  as?: "div" | "article" | "section";
  /** Show subtle hover treatment. Touch devices auto-suppress via .ui-hover gate. */
  interactive?: boolean;
  children?: ReactNode;
};

const base = "rounded-[var(--radius-xl)]";

const variants: Record<Variant, string> = {
  panel:
    "border border-[rgba(201,169,110,0.20)] " +
    "bg-[linear-gradient(180deg,rgba(22,18,16,0.98)_0%,rgba(13,11,12,0.97)_100%)] " +
    "shadow-[0_18px_40px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]",
  inset:
    "border border-[rgba(201,169,110,0.16)] bg-[rgba(23,19,17,0.72)] rounded-[var(--radius-lg)]",
  subtle:
    "border border-[rgba(201,169,110,0.10)] bg-[rgba(201,169,110,0.02)]",
};

const interactiveCls =
  "ui-hover transition-[border-color,background-color] duration-[var(--dur-popover)] ease-[var(--ease-out)] " +
  "hover:border-[rgba(201,169,110,0.34)] hover:bg-[rgba(201,169,110,0.04)]";

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, variant = "panel", as = "article", interactive, ...rest },
  ref
) {
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={cn(base, variants[variant], interactive && interactiveCls, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Card;
