import { Heart } from "lucide-react";
import { type PropsWithChildren } from "react";
import { FavoriteButton } from "./favorite-button";

export function Card({ children }: PropsWithChildren) {
  return <div className="bg-gray-800 text-white rounded">{children}</div>;
}

export function CardHeader(
  props:
    | {
        id: string;
        title: string;
        link: string;
        subtitle?: string;
        favorite?: boolean;
        onToggleFavorite?: () => void;
      }
    | { skeleton: true }
) {
  return (
    <header className="flex flex-row items-center-safe gap-1 p-3 border-b border-b-gray-600">
      <div className="flex flex-col flex-1">
        {"skeleton" in props ? (
          <>
            <div className="max-w-full w-sm text-lg bg-neutral-400 rounded animate-pulse">
              &nbsp;
            </div>
            <div className="max-w-full w-xs text-sm bg-neutral-400 rounded animate-pulse">
              &nbsp;
            </div>
          </>
        ) : (
          <>
            <a className="text-lg hover:underline" href={props.link}>
              {props.title}
            </a>
            {!!props.subtitle && (
              <p className="text-sm text-gray-300">{props.subtitle}</p>
            )}
          </>
        )}
      </div>
      <FavoriteButton id={"id" in props ? props.id : undefined} />
    </header>
  );
}

export function CardList({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-1 auto-rows-min">{children}</div>;
}
