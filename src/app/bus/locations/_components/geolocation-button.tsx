"use client";

export interface GeolocationButtonProps {
  className?: string;
  onClick?: (position: { latitude: number; longitude: number }) => void;
}

export function GeolocationButton({
  children,
  className,
  onClick,
}: React.PropsWithChildren<GeolocationButtonProps>) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          onClick?.(coords);
        });
      }}
    >
      {children}
    </button>
  );
}
