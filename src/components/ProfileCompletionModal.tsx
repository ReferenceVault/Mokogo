import { useNavigate } from 'react-router-dom'
import { X, User } from 'lucide-react'

interface ProfileCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  action: 'list' | 'contact'
}

const ProfileCompletionModal = ({ isOpen, onClose, action }: ProfileCompletionModalProps) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGoToProfile = () => {
    onClose()
    navigate('/dashboard?view=profile')
  }

  const actionText = action === 'list' 
    ? 'list a property' 
    : 'contact a property lister'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Please complete your personal profile before you can {actionText}.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            This helps us ensure a safe and trustworthy community for everyone.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGoToProfile}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompletionModal
