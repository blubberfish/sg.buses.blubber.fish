export function Meta({ content }: {content?: string | null}) {
  if (!content) {
    return null
  }
  return <p className="text-gray-400">{content}</p>
}