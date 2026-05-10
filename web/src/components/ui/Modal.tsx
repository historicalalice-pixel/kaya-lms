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

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Click on backdrop closes modal. Default: true. */
  closeOnBackdrop?: boolean;
  /** ESC closes modal. Default: true. */
  closeOnEsc?: boolean;
  /** Custom width in px or any CSS length. Default: 480. */
  width?: number | string;
  /** Hide the default close button (X). */
  hideCloseButton?: boolean;
  className?: string;
};

/**
 * Centered modal with backdrop.
 *
 * Animation: scale(0.95) + opacity 0 → scale(1) + opacity 1, ease-out, 250ms.
 * Per Emil: never start from scale(0); modals stay centred (no origin shift).
 *
 * Accessibility: role="dialog", aria-modal, focus trap, ESC, scroll lock,
 * focus restoration, labeled by title/description when provided.
 */
export default function Modal({
  open,
  onClose,
  children,
  title,
  description,
  closeOnBackdrop = true,
  closeOnEsc = true,
  width = 480,
  hideCloseButton = false,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useFocusTrap(dialogRef, open);

  // ESC handler
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

  // Body scroll lock while open
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

  return (
    <div
      onMouseDown={onBackdropClick}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center px-4",
        "bg-[rgba(0,0,0,0.7)] backdrop-blur-[4px]",
        "transition-opacity duration-[var(--dur-modal)] ease-[var(--ease-out)]",
        // @starting-style would be cleaner, but Tailwind v4 doesn't expose it as a utility yet.
      )}
      // Fade in via inline keyframes-equivalent: rely on animate-fade-in class (defined in globals)
      // but trim duration for modals:
      style={{ animation: `fadeIn var(--dur-modal) var(--ease-out) forwards` }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "calc(100vw - 32px)",
          animation: `fadeScale var(--dur-modal) var(--ease-out) forwards`,
          transformOrigin: "center", // modals stay centered
        }}
        className={cn(
          "relative max-h-[calc(100vh-32px)] overflow-auto",
          "rounded-[var(--radius-xl)] border border-[rgba(201,169,110,0.22)]",
          "bg-[#0d0b08] p-6 sm:p-8",
          "shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]",
          className
        )}
      >
        {!hideCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className={cn(
              "press ui-hover absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center",
              "rounded-full border border-transparent text-[rgba(229,222,210,0.6)]",
              "transition-[color,background-color,border-color] duration-[var(--dur-popover)] ease-[var(--ease-out)]",
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
        ) : null}

        {title ? (
          <h2
            id={titleId}
            className="font-serif text-[1.6rem] leading-tight text-[rgba(245,239,230,0.96)]"
          >
            {title}
          </h2>
        ) : null}

        {description ? (
          <p
            id={descId}
            className="mt-2 font-sans text-[0.88rem] text-[rgba(245,239,230,0.66)]"
          >
            {description}
          </p>
        ) : null}

        <div className={cn(title || description ? "mt-6" : undefined)}>{children}</div>
      </div>
    </div>
  );
}
