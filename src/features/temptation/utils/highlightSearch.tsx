export const highlightSearch = (text: string, keyword: string) => {
  const trimmed = keyword.trim()
  if (!trimmed) return text

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={index} className="highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
