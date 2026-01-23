import { X, AlertCircle } from 'lucide-react'

interface ListingLimitModalProps {
  isOpen: boolean
  onClose: () => void
  savedAsDraft?: boolean
}

const ListingLimitModal = ({ isOpen, onClose, savedAsDraft = false }: ListingLimitModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {savedAsDraft ? 'Saved as Draft' : 'Active Listing Limit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {savedAsDraft ? (
            <>
              <p className="text-gray-700 mb-4">
                Your listing has been saved as a draft because you already have an active listing.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                You can only have one active listing at a time. To activate this listing, please archive or fulfill your current active listing first.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                You already have an active listing. Please archive or fulfill your current listing before activating a new one.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                You can only have one active listing at a time.
              </p>
            </>
          )}

          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-orange-400 text-white rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors"
            >
              {savedAsDraft ? 'Got it' : 'Understood'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingLimitModal
