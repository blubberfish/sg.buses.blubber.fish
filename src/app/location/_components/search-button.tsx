"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useRef } from "react";

export function SearchButton({
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  return (
    <button
      ref={buttonRef}
      onClick={(event) => {
        const target = buttonRef.current
          ?.closest("[data-context-root]")
          ?.querySelector("input")?.value;
        if (target) {
          const url = new URL(document.location.href);
          url.searchParams.set("place", target);
          router.push(url.href);
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
