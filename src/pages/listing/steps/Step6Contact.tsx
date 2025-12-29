import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'

interface Step6ContactProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const Step6Contact = ({ data, onChange, error }: Step6ContactProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Contact</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">How should people reach you?</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Contact Preference */}
        <div className="w-full">
          <CustomSelect
            label="How should seekers contact you?"
            value={data.contactPreference || ''}
            onValueChange={(value) => handleChange('contactPreference', value)}
            placeholder="Select contact preference"
            options={[
              { value: 'chat', label: 'Chat Only (WhatsApp)' },
              { value: 'call', label: 'Call Only' },
              { value: 'both', label: 'Both Chat & Call' }
            ]}
            error={error}
          />
        </div>

        {/* Contact Number */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              value={data.contactNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                handleChange('contactNumber', value)
              }}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12"
              placeholder="Your phone number"
              maxLength={10}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step6Contact

