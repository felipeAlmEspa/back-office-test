import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
}

const sizeToClass: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-none w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  showCloseButton = true,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  preventScroll = true,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!isOpen) return;

    if (preventScroll) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (active === last || !root.contains(active)) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const to = setTimeout(() => firstFocusableRef.current?.focus(), 0);
    return () => clearTimeout(to);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descId}
      className="fixed inset-0 z-50"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-100 transition-opacity"
        onClick={() => {
          if (closeOnOverlayClick) onClose();
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          className={[
            "w-full",
            sizeToClass[size],
            "bg-white dark:bg-neutral-900 rounded-xl shadow-2xl outline-none",
            "transition-all duration-200",
            "opacity-100 translate-y-0 scale-100",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800">
            {title ? (
              <h2 id={titleId} className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h2>
            ) : (
              <span className="sr-only" id={titleId}>
                Modal
              </span>
            )}
            {showCloseButton && (
              <button
                ref={firstFocusableRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900"
                aria-label="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <div id={descId} className="p-4 text-neutral-700 dark:text-neutral-200">
            {children}
          </div>

          {(actions || !showCloseButton) && (
            <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-200 dark:border-neutral-800">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;