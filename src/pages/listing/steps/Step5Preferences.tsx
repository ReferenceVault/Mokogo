import { Listing } from '@/types'

interface Step5PreferencesProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const Step5Preferences = ({ data, onChange, error }: Step5PreferencesProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Preferences</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">Who are you looking for?</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Gender Preference */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Gender Preference <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {['Male Only', 'Female Only', 'Any Gender'].map((pref) => {
              const value = pref === 'Male Only' ? 'Male' : pref === 'Female Only' ? 'Female' : 'Any'
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handleChange('preferredGender', value)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    data.preferredGender === value
                      ? 'bg-orange-400 text-white border-orange-400'
                      : 'bg-white/30 text-gray-700 border border-stone-200 hover:border-orange-400 hover:text-orange-500'
                  }`}
                >
                  {pref}
                </button>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={data.description || data.notes || ''}
            onChange={(e) => {
              handleChange('description', e.target.value)
              handleChange('notes', e.target.value)
            }}
            className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium min-h-[120px] resize-none"
            placeholder="Tell potential flatmates about the room, house rules, current occupants, etc."
          />
        </div>
      </div>
    </div>
  )
}

export default Step5Preferences

