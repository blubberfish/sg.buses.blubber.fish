export default function Spinner() {
  return (
    <div className="isolate relative overflow-visible h-min w-min">
      <div className="absolute -inset-4 top-2 rounded-full overflow-hidden bg-orange-700 box-content animate-spin anim" />
      <div className="absolute -inset-3 bottom-2 rounded-full overflow-hidden bg-orange-700 box-content animate-spin" />
      <div className="absolute -inset-4 left-1 rounded-full overflow-hidden bg-orange-700 box-content animate-spin anim" />
      <div className="absolute -inset-3 right-2 rounded-full overflow-hidden bg-orange-700 box-content animate-spin" />
      <div className="absolute -inset-3 left-1 rounded-full overflow-hidden bg-orange-500 box-content animate-spin" />
      <div className="absolute -inset-2 right-2 rounded-full overflow-hidden bg-orange-500 box-content animate-spin" />
      <div className="relative aspect-square rounded-full overflow-hidden p-1 h-16 bg-amber-300">
        <div className="h-full w-full rounded-full overflow-hidden bg-amber-100 shadow shadow-amber-50" />
      </div>
    </div>
  );
}
