export function Notification({ content }: { content: string }) {
  return (
    <div className="px-3 py-1 flex flex-row flex-nowrap items-center gap-x-3 bg-gray-600 text-neutral-100 rounded">
      <div className="size-3 border-2 border-purple-400 border-t-violet-300 rounded-full animate-spin" />
      <p>{content}</p>
    </div>
  );
}
