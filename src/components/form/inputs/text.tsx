"use client";

import { useContext } from "react";
import { FormContext } from "../context";

export function Text({
  name,
  className,
  disabled,
  placeholder,
  required,
}: {
  name: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}) {
  const { data, set } = useContext(FormContext);
  return (
    <input
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      name={name}
      onChange={(event) => {
        set(name, event.target.value);
      }}
      required={required}
      type="text"
      value={(data[name] as string) || ""}
    />
  );
}
