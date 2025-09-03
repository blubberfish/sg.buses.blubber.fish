"use client";

import { useEffect, useRef } from "react";
export function Trigger({ onTrigger }: { onTrigger?: { (): void } }) {
  const observerRef = useRef<IntersectionObserver>(undefined);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = elementRef.current;
    if (!target) return;
    const observer = (observerRef.current =
      observerRef.current ??
      new IntersectionObserver(
        (entries) => {
          const scrolledIntoView = entries.some(
            (entry) => entry.target === target && entry.isIntersecting
          );
          if (!scrolledIntoView) return;
          onTrigger?.();
        },
        {
          threshold: 1,
        }
      ));
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [onTrigger]);

  return <div ref={elementRef}></div>;
}
