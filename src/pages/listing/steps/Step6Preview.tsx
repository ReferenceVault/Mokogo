import { useState, useEffect } from 'react'
import { Listing } from '@/types'

interface Step6PreviewProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  onPublish: () => void
}

const Step6Preview = ({ data, onChange }: Step6PreviewProps) => {
  const [title, setTitle] = useState(data.title || '')

  useEffect(() => {
    // Always update title if data changes, even if title exists
    if (data.roomType && data.bhkType && data.locality && data.rent) {
      const furnishingTag = data.furnishingLevel || ''
      const preferenceTag = data.preferredGender || 'Any'
      const roundedRent = Math.round((data.rent || 0) / 1000) + 'k'
      const autoTitle = `${data.roomType} in ${data.bhkType} · ${data.locality} · ₹${roundedRent} · ${furnishingTag} · ${preferenceTag}`
      
      // Only set if title is empty or if it matches the auto-generated pattern
      if (!title || title === data.title || !data.title) {
        setTitle(autoTitle)
        onChange({ title: autoTitle })
      }
    }
  }, [data.roomType, data.bhkType, data.locality, data.rent, data.furnishingLevel, data.preferredGender])

  // Sync title with data.title if it changes externally
  useEffect(() => {
    if (data.title && data.title !== title) {
      setTitle(data.title)
    }
  }, [data.title])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onChange({ title: newTitle })
  }

  const getFurnishingTag = () => {
    return data.furnishingLevel || 'Not specified'
  }

  const getPreferenceTag = () => {
    return data.preferredGender || 'Any'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Preview your listing
      </h1>
      <p className="text-gray-600 mb-8">
        Review all details before publishing. You can go back to edit any step.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Title & Controls */}
        <div className="space-y-6">
          <div className="w-[110%]">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Listing title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium"
              placeholder="Enter listing title"
            />
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">Review your listing details before publishing.</p>
            <p>You can edit any field by going back to previous steps.</p>
          </div>
        </div>

        {/* Right Column - Preview Card */}
        <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {title || 'Your listing title'}
          </h2>
          <p className="text-gray-600 mb-4">
            {data.city} · {data.locality}
            {data.societyName && ` · ${data.societyName}`}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-mokogo-primary/10 text-mokogo-primary rounded-full text-xs font-medium">
              ₹{data.rent?.toLocaleString()}/month
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {data.roomType}
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {getFurnishingTag()}
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {getPreferenceTag()}
            </span>
          </div>

          {/* Photos */}
          {data.photos && data.photos.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2">
                {data.photos.slice(0, 3).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Availability */}
          <div className="mb-4 pb-4 border-b border-mokogo-gray">
            <h3 className="font-semibold text-gray-900 mb-2">Pricing & Availability</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Rent: ₹{data.rent?.toLocaleString()}/month</p>
              {data.deposit && <p>Deposit: ₹{data.deposit.toLocaleString()}</p>}
              {data.moveInDate && (
                <p>Move-in: {new Date(data.moveInDate).toLocaleDateString()}</p>
              )}
              {data.minimumStay && <p>Minimum stay: {data.minimumStay} months</p>}
            </div>
          </div>

          {/* Amenities */}
          {(data.flatAmenities?.length || data.societyAmenities?.length) && (
            <div className="mb-4 pb-4 border-b border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {data.flatAmenities?.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {amenity}
                  </span>
                ))}
                {data.societyAmenities?.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">House Rules</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Food: {data.foodPreference}</p>
              <p>Smoking: {data.smokingAllowed}</p>
              <p>Drinking: {data.drinkingAllowed}</p>
              <p>Guests: {data.guestsAllowed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step6Preview
