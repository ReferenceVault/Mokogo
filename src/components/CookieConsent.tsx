import { useState, useEffect } from 'react'
import { X, Settings, Shield, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { loadGAScript } from '@/utils/analytics'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always on
    analytics: false, // Off by default
  })

  // Check if user has already made a choice
  useEffect(() => {
    const consent = localStorage.getItem('mokogo_cookie_consent')
    if (!consent) {
      // First visit - show banner
      setShowBanner(true)
    } else {
      // User has made a choice - load preferences
      try {
        const savedPrefs = JSON.parse(consent)
        setPreferences({
          essential: true,
          analytics: savedPrefs.analytics || false,
        })
        
        // Load GA if analytics was accepted
        if (savedPrefs.analytics) {
          loadGAScript()
        }
      } catch {
        setShowBanner(true)
      }
    }
  }, [])

  // Handle opening modal from external trigger (e.g., footer link)
  useEffect(() => {
    const handleOpenModal = () => {
      setShowModal(true)
      setShowBanner(false)
    }
    
    window.addEventListener('openCookieSettings', handleOpenModal)
    return () => window.removeEventListener('openCookieSettings', handleOpenModal)
  }, [])

  const savePreferences = (analyticsEnabled: boolean) => {
    const consentData = {
      analytics: analyticsEnabled,
      timestamp: new Date().toISOString(),
    }
    
    localStorage.setItem('mokogo_cookie_consent', JSON.stringify(consentData))
    
    setPreferences({
      essential: true,
      analytics: analyticsEnabled,
    })
    
    if (analyticsEnabled) {
      loadGAScript()
    }
    
    setShowBanner(false)
    setShowModal(false)
  }

  const handleAcceptAll = () => {
    savePreferences(true)
  }

  const handleRejectNonEssential = () => {
    savePreferences(false)
  }

  const handleCustomize = () => {
    setShowModal(true)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences.analytics)
  }

  const handleCancel = () => {
    // Restore previous preferences
    const consent = localStorage.getItem('mokogo_cookie_consent')
    if (consent) {
      try {
        const savedPrefs = JSON.parse(consent)
        setPreferences({
          essential: true,
          analytics: savedPrefs.analytics || false,
        })
      } catch {
        setPreferences({
          essential: true,
          analytics: false,
        })
      }
    }
    setShowModal(false)
    // Show banner again if no consent was saved
    if (!consent) {
      setShowBanner(true)
    }
  }

  if (!showBanner && !showModal) return null

  return (
    <>
      {/* Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Your privacy matters to us
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies to make Mokogo work properly and to understand how people use our site.
                  You can choose whether to allow analytics cookies.{' '}
                  <Link
                    to="/cookie-policy"
                    className="text-orange-500 hover:text-orange-600 underline"
                  >
                    Learn more in our Privacy Policy.
                  </Link>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRejectNonEssential}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={handleCustomize}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cookie preferences</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Cookies help us provide a better experience and understand how Mokogo is used. You're in control of what you allow.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Essential cookies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Required for core features like login, security, and saving your preferences.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500 cursor-not-allowed opacity-60">
                      <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-[52px]">
                  Always ON (cannot be disabled)
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Analytics cookies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Help us understand website usage so we can improve Mokogo.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.analytics ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 ml-[52px]">
                  {preferences.analytics ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CookieConsent

