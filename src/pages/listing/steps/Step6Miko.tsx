import { useMemo } from 'react'
import { Listing, VibeTagId } from '@/types'
import { VIBE_TAG_LABELS } from '@/utils/miko'

interface Step6MikoProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const TAG_GROUPS: { title: string; tags: VibeTagId[] }[] = [
  {
    title: 'Home Vibe',
    tags: ['calm_vibes', 'thoughtfully_social', 'lively'],
  },
  {
    title: 'Home Life',
    tags: ['couch_chill_repeat', 'remote_life', 'community_living'],
  },
  {
    title: 'Priorities',
    tags: ['wallet_friendly', 'feel_good_space', 'well_connected_area'],
  },
  {
    title: 'Move Timing',
    tags: ['asap', 'next_few_weeks', 'no_rush'],
  },
  {
    title: 'Personal Space',
    tags: ['privacy_over_all', 'open_to_sharing', 'either_works'],
  },
  {
    title: 'Hard No',
    tags: ['smoke_free', 'peace_over_noise', 'no_furry_roommates', 'flexible_overall'],
  },
]

const Step6Miko = ({ data, onChange, error }: Step6MikoProps) => {
  const selectedTags = useMemo(() => new Set(data.mikoTags || []), [data.mikoTags])

  const toggleTag = (tag: VibeTagId) => {
    const next = new Set(selectedTags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    onChange({ mikoTags: Array.from(next) })
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">MIKO Vibe Tags</h4>
        <p className="text-sm text-gray-600">
          Optional — add vibe tags to help seekers find your listing through MIKO.
        </p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {TAG_GROUPS.map(group => (
        <div key={group.title} className="space-y-2">
          <h5 className="text-sm font-semibold text-gray-700">{group.title}</h5>
          <div className="flex flex-wrap gap-2">
            {group.tags.map(tag => {
              const isSelected = selectedTags.has(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {VIBE_TAG_LABELS[tag]}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Step6Miko
