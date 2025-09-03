import { Star } from "@deemlol/next-icons";

export function StarButton({
  active,
  onClick,
}: {
  active?: boolean;
  onClick?(): void;
}) {
  return (
    <button
      type="button"
      className={`flex flex-row items-center gap-1 disabled:opacity-50 px-3 py-1 rounded border bg-white/8 hover:text-emerald-400 hover:border-emerald-400 ${active ? "text-violet-400 border-violet-400" : " border-white/15"}`}
      onClick={onClick}
    >
      <Star className="size-4" />
      <span className="text-sm">Star</span>
    </button>
  );
}
