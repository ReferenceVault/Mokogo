import { VibeTagId } from '@/types'
import { VIBE_TAG_LABELS } from '@/utils/miko'

interface MikoTagPillsProps {
  tags: VibeTagId[]
  max?: number
  className?: string
}

const MikoTagPills = ({ tags, max = 3, className = '' }: MikoTagPillsProps) => {
  if (!tags.length) return null
  const uniqueTags = Array.from(new Set(tags)).slice(0, max)

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {uniqueTags.map(tag => (
        <span
          key={tag}
          className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200"
        >
          {VIBE_TAG_LABELS[tag]}
        </span>
      ))}
    </div>
  )
}

export default MikoTagPills
