import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChipTone = "gold" | "green" | "blue" | "red" | "gray";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: ChipTone;
  children: ReactNode;
};

const tones: Record<ChipTone, string> = {
  gold: "bg-[rgba(201,169,110,0.10)] border-[rgba(201,169,110,0.22)] text-[rgba(230,202,148,0.95)]",
  green: "bg-[rgba(52,168,83,0.12)] border-[rgba(52,168,83,0.24)] text-[rgba(129,221,155,0.95)]",
  blue: "bg-[rgba(52,130,200,0.12)] border-[rgba(52,130,200,0.24)] text-[rgba(144,200,255,0.95)]",
  red: "bg-[rgba(220,80,60,0.12)] border-[rgba(220,80,60,0.24)] text-[rgba(244,150,138,0.96)]",
  gray: "bg-[rgba(150,145,136,0.12)] border-[rgba(150,145,136,0.22)] text-[rgba(206,202,195,0.90)]",
};

export default function Chip({ tone = "gray", children, className, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 " +
          "font-sans text-[0.62rem] tracking-[0.10em] uppercase",
        tones[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
