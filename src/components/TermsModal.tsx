import { useEffect } from 'react'
import { X } from 'lucide-react'
import { PrivacyPolicyContent, TermsOfServiceContent } from './TermsModalContent'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'terms' | 'privacy'
}

const TermsModal = ({ isOpen, onClose, type }: TermsModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      const contentDiv = document.getElementById('modal-content')
      if (contentDiv) {
        contentDiv.scrollTop = 0
      }
    }
  }, [isOpen, type])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mokogo-gray flex-shrink-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div 
          id="modal-content"
          className="flex-1 overflow-y-auto bg-mokogo-off-white"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray m-6">
            {type === 'terms' ? <TermsOfServiceContent /> : <PrivacyPolicyContent />}
          </div>
        </div>

        {/* Footer with link to full page */}
        <div className="p-4 border-t border-mokogo-gray flex-shrink-0 bg-white">
          <a
            href={type === 'terms' ? '/terms-of-service' : '/privacy-policy'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="text-sm text-orange-400 hover:text-orange-500 font-medium inline-flex items-center gap-1"
          >
            View full page in new tab →
          </a>
        </div>
      </div>
    </div>
  )
}

export default TermsModal

