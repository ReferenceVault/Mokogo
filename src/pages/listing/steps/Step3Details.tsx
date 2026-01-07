import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'
import AmenitiesSelector from '@/components/AmenitiesSelector'

interface Step3DetailsProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const Step3Details = ({ data, onChange, error }: Step3DetailsProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Details</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">Room and apartment details</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Room Type - First */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Room Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {['Private Room', 'Shared Room', 'Master Room'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('roomType', type)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  data.roomType === type
                    ? 'bg-orange-400 text-white border-orange-400'
                    : 'bg-white/30 text-gray-700 border border-stone-200 hover:border-orange-400 hover:text-orange-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Apartment Type, Furnishing, and Bathroom Type - Single Line */}
        <div className="flex flex-wrap gap-4">
          {/* BHK Type */}
          <div className="flex-1 min-w-[200px]">
            <CustomSelect
              label="Apartment Type"
              value={data.bhkType || ''}
              onValueChange={(value) => handleChange('bhkType', value)}
              placeholder="Select BHK type"
              options={[
                { value: '1BHK', label: '1 BHK' },
                { value: '2BHK', label: '2 BHK' },
                { value: '3BHK', label: '3 BHK' },
                { value: '4BHK+', label: '4 BHK or more' }
              ]}
              error={error}
            />
          </div>

          {/* Furnishing */}
          <div className="flex-1 min-w-[200px]">
            <CustomSelect
              label="Furnishing"
              value={data.furnishingLevel || ''}
              onValueChange={(value) => handleChange('furnishingLevel', value)}
              placeholder="Select furnishing status"
              options={[
                { value: 'Fully Furnished', label: 'Fully Furnished' },
                { value: 'Semi-furnished', label: 'Semi Furnished' },
                { value: 'Unfurnished', label: 'Unfurnished' }
              ]}
            />
          </div>

          {/* Bathroom Type */}
          <div className="flex-1 min-w-[200px]">
            <CustomSelect
              label="Bathroom Type"
              value={data.bathroomType || ''}
              onValueChange={(value) => handleChange('bathroomType', value)}
              placeholder="Select bathroom type"
              options={[
                { value: 'Attached', label: 'Attached Bathroom' },
                { value: 'Common', label: 'Common Bathroom' }
              ]}
            />
          </div>
        </div>

        {/* Amenities */}
        <AmenitiesSelector
          selected={[
            ...(data.flatAmenities || []).filter(a => ['WiFi', 'Washing machine', 'AC', 'Geyser', 'Balcony', 'Fridge', 'TV', 'Kitchen', 'Sofa', 'Bed'].includes(a)),
            ...(data.societyAmenities || []).filter(a => ['Gym', 'Pool', 'Security', 'Parking'].includes(a))
          ]}
          onChange={(amenities) => {
            // Split amenities into flat and society based on their categories
            const flatAmenitiesList = amenities.filter(a => ['WiFi', 'Washing machine', 'AC', 'Geyser', 'Balcony', 'Fridge', 'TV', 'Kitchen', 'Sofa', 'Bed'].includes(a))
            const societyAmenitiesList = amenities.filter(a => ['Gym', 'Pool', 'Security', 'Parking'].includes(a))
            
            // Preserve other amenities that aren't in the selector
            const otherFlatAmenities = (data.flatAmenities || []).filter(a => !['WiFi', 'Washing machine', 'AC', 'Geyser', 'Balcony', 'Fridge', 'TV', 'Kitchen', 'Sofa', 'Bed'].includes(a))
            const otherSocietyAmenities = (data.societyAmenities || []).filter(a => !['Gym', 'Pool', 'Security', 'Parking'].includes(a))
            
            onChange({ 
              flatAmenities: [...flatAmenitiesList, ...otherFlatAmenities],
              societyAmenities: [...societyAmenitiesList, ...otherSocietyAmenities]
            })
          }}
          label="Amenities (Optional)"
        />
      </div>
    </div>
  )
}

export default Step3Details

