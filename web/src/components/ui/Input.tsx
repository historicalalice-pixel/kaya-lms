"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Hide the visible label visually but keep it for screen readers. */
  srOnlyLabel?: boolean;
};

const inputBase =
  "w-full h-[54px] rounded-[var(--radius-md)] " +
  "border border-[rgba(201,169,110,0.22)] bg-[rgba(201,169,110,0.045)] " +
  "px-4 font-sans text-[1rem] text-[rgba(245,239,230,0.94)] " +
  "placeholder:text-[rgba(245,239,230,0.34)] " +
  "outline-none " +
  "transition-[border-color,background-color,box-shadow] duration-[var(--dur-popover)] ease-[var(--ease-out)] " +
  "focus-visible:border-[rgba(227,196,136,0.88)] " +
  "focus-visible:bg-[rgba(201,169,110,0.075)] " +
  "focus-visible:shadow-[0_0_0_4px_rgba(201,169,110,0.08)] " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, srOnlyLabel, id, className, ...rest },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className={cn(
            "block font-sans text-[0.94rem] text-[rgba(245,239,230,0.78)] mb-2",
            srOnlyLabel && "sr-only"
          )}
        >
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          inputBase,
          error && "border-[rgba(220,80,60,0.6)] focus-visible:border-[rgba(220,80,60,0.85)]",
          className
        )}
        {...rest}
      />

      {hint && !error ? (
        <p id={hintId} className="mt-1.5 font-sans text-[0.78rem] text-[rgba(245,239,230,0.5)]">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-1.5 font-sans text-[0.82rem] text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
