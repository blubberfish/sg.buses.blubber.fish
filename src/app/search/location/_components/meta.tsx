export function Meta({
  content,
  skeleton,
}: {
  content?: string | null;
  skeleton?: boolean;
}) {
  if (skeleton) {
    return <p className="text-gray-400">&nbsp;</p>;
  }
  if (!content) {
    return null;
  }
  return <p className="text-gray-400">{content}</p>;
}
