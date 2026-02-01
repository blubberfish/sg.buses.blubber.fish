import { HTMLAttributes, useEffect, useRef } from "react";

export function InfiniteScroll({
  children,
  disabled,
  onScrolledToEnd,
  ...props
}: {
  disabled?: boolean;
  onScrolledToEnd?: { (): void };
} & HTMLAttributes<HTMLDivElement>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const trigger = triggerRef.current;
    if (disabled || !root || !trigger) {
      return;
    }
    let cancel = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (cancel) return;
        const triggerEntry = entries.find(
          (entry) => entry.target === trigger && entry.isIntersecting
        );
        if (!disabled && triggerEntry) {
          onScrolledToEnd?.();
        }
      },
      { root }
    );
    observer.observe(trigger);
    return () => {
      cancel = true;
      observer.disconnect();
    };
  }, [disabled, onScrolledToEnd]);

  return (
    <div ref={rootRef} {...props}>
      {children}
      <div ref={triggerRef} />
    </div>
  );
}
