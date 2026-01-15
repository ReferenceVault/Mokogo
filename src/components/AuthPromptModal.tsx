import { Link } from 'react-router-dom'

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath: string
}

const AuthPromptModal = ({ isOpen, onClose, redirectPath }: AuthPromptModalProps) => {
  if (!isOpen) return null

  const redirectParam = encodeURIComponent(redirectPath)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-orange-200/60 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Save this property</h3>
        <p className="text-sm text-gray-600 mb-6">
          Create an account to save listings and access them anytime.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to={`/auth?mode=signup&redirect=${redirectParam}`}
            className="w-full text-center px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Sign up
          </Link>
          <Link
            to={`/auth?mode=signin&redirect=${redirectParam}`}
            className="w-full text-center px-4 py-2 rounded-xl border border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
          >
            Log in
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPromptModal
