"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "./use-focus-trap";

type Side = "right" | "left" | "bottom" | "top";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: Side;
  title?: ReactNode;
  description?: ReactNode;
  width?: number | string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
};

/**
 * Edge-anchored panel (drawer). Side defaults to 'right'.
 *
 * Animation:
 *   - enter: translate(0) ease-out 320ms (off-screen → in place)
 *   - exit:  translate(100%) ease-out 200ms (faster on system response)
 *
 * Accessibility: role="dialog", aria-modal, focus trap, ESC, scroll lock.
 *
 * Note: this implementation renders only while open, so the enter
 * animation runs once via @keyframes. For exit-while-mounting, wrap with
 * an animation library or upgrade later — for now we accept instant unmount.
 */
export default function Sheet({
  open,
  onClose,
  children,
  side = "right",
  title,
  description,
  width = 360,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onBackdropClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!closeOnBackdrop) return;
      if (e.target === e.currentTarget) onClose();
    },
    [closeOnBackdrop, onClose]
  );

  if (!open) return null;

  const fromTransform: Record<Side, string> = {
    right: "translateX(100%)",
    left: "translateX(-100%)",
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
  };

  const sidePosition: Record<Side, string> = {
    right: "right-0 top-0 h-full",
    left: "left-0 top-0 h-full",
    top: "left-0 top-0 w-full",
    bottom: "left-0 bottom-0 w-full",
  };

  // Inline keyframes via animation property. We use explicit keyframes so
  // each side gets a translation appropriate to it.
  const animationName = `sheet-in-${side}`;

  // Width handling: vertical sheets get full width; horizontal get `width`.
  const sizing =
    side === "left" || side === "right"
      ? { width: typeof width === "number" ? `${width}px` : width, maxWidth: "100vw" }
      : { height: typeof width === "number" ? `${width}px` : width, maxHeight: "100vh" };

  return (
    <div
      onMouseDown={onBackdropClick}
      className={cn(
        "fixed inset-0 z-[100] bg-[rgba(0,0,0,0.7)] backdrop-blur-[4px]"
      )}
      style={{ animation: `fadeIn var(--dur-modal) var(--ease-out) forwards` }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "absolute overflow-auto border-[rgba(201,169,110,0.16)] bg-[rgba(8,7,8,0.97)]",
          side === "right" && "border-l",
          side === "left" && "border-r",
          side === "top" && "border-b",
          side === "bottom" && "border-t",
          "shadow-[0_-12px_60px_rgba(0,0,0,0.5)]",
          sidePosition[side],
          className
        )}
        style={{
          ...sizing,
          animationName,
          animationDuration: "var(--dur-sheet)",
          animationTimingFunction: "var(--ease-drawer)",
          animationFillMode: "forwards",
        }}
      >
        <style>{`
          @keyframes ${animationName} {
            from { transform: ${fromTransform[side]}; opacity: 0.6; }
            to   { transform: translate(0, 0); opacity: 1; }
          }
        `}</style>

        <div className="flex items-center justify-between gap-3 border-b border-[rgba(201,169,110,0.08)] px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2
                id={titleId}
                className="font-serif text-[1.2rem] text-[rgba(240,232,218,0.95)] truncate"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id={descId}
                className="mt-1 font-sans text-[0.78rem] text-[rgba(229,222,210,0.6)]"
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className={cn(
              "press ui-hover inline-flex h-9 w-9 items-center justify-center rounded-full",
              "text-[rgba(229,222,210,0.6)]",
              "transition-[color,background-color] duration-[var(--dur-popover)] ease-[var(--ease-out)]",
              "hover:bg-[rgba(201,169,110,0.08)] hover:text-[var(--gold-light)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.6)]"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
