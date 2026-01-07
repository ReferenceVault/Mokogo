import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'

interface Step2LocationProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const cities = [
  'Mumbai', 'Bangalore', 'Pune', 'Delhi NCR', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 
  'Nagpur', 'Coimbatore', 'Kochi'
]

const Step2Location = ({ data, onChange, error }: Step2LocationProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Location</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">Where is the room located?</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* City */}
        <div className="w-full">
          <CustomSelect
            label="City"
            value={data.city || ''}
            onValueChange={(value) => handleChange('city', value)}
            placeholder="Select your city"
            options={cities.map(city => ({ value: city, label: city }))}
            error={error}
          />
        </div>

        {/* Locality */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Locality / Area <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={data.locality || ''}
              onChange={(e) => handleChange('locality', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300 text-stone-900 font-medium pl-12"
              placeholder="e.g., Koramangala, Baner, Powai"
            />
          </div>
        </div>

        {/* Society/Building Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Society / Building Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <input
              type="text"
              value={data.societyName || ''}
              onChange={(e) => handleChange('societyName', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300 text-stone-900 font-medium pl-12"
              placeholder="e.g., Green Valley Apartments, Sunrise Towers"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Location

