import { Listing } from '@/types'
import { MoveInDateField } from '@/components/MoveInDateField'

interface Step4PricingProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
}

const Step4Pricing = ({ data, onChange, error }: Step4PricingProps) => {
  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <div>
      <h2 className="text-[1.375rem] font-semibold text-gray-900 mb-1">Pricing</h2>
      <p className="text-[0.9625rem] text-gray-600 mb-4">Rent and deposit</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {/* Rent */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Monthly Rent (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <span className="text-lg font-semibold text-mokogo-primary">₹</span>
            </div>
            <input
              type="number"
              value={data.rent || ''}
              onChange={(e) => handleChange('rent', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g., 12000"
              min="0"
            />
          </div>
        </div>

        {/* Deposit */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <span className="text-lg font-semibold text-mokogo-primary">₹</span>
            </div>
            <input
              type="number"
              value={data.deposit || ''}
              onChange={(e) => handleChange('deposit', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/30 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-mokogo-primary/50 focus:border-mokogo-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300/70 text-gray-700 font-medium pl-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="e.g., 24000"
              min="0"
            />
          </div>
        </div>

        {/* Available From */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Available From <span className="text-red-500">*</span>
          </label>
          <div className="[&_button]:!px-4 [&_button]:!py-3 [&_button]:!bg-gradient-to-br [&_button]:!from-white [&_button]:!via-white [&_button]:!to-orange-50/40 [&_button]:!border-2 [&_button]:!border-orange-300/60 [&_button]:!rounded-xl [&_button]:!focus:ring-2 [&_button]:!focus:ring-orange-400/60 [&_button]:!focus:border-orange-400 [&_button]:!shadow-md hover:[&_button]:!shadow-lg hover:[&_button]:!border-orange-400 [&_button]:!text-gray-900 [&_button]:!font-medium [&_button]:!h-[52px]">
            <MoveInDateField
              value={data.moveInDate || ''}
              onChange={(date) => handleChange('moveInDate', date)}
              min={tomorrow}
              hideLabel={true}
              numberOfMonths={1}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step4Pricing

