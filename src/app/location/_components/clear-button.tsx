"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useRef } from "react";

export function ClearButton({
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  return (
    <button
      ref={buttonRef}
      onClick={(event) => {
        const url = new URL(document.location.href);
        url.searchParams.delete("place");
        router.push(url.href);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
