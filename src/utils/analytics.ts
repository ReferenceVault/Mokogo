// Google Analytics utility
// Only loads and tracks if user has consented to analytics cookies

const GA_MEASUREMENT_ID = 'G-0SV39SG3DG'

// Check if analytics consent is given
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const consent = localStorage.getItem('mokogo_cookie_consent')
  if (!consent) return false
  
  try {
    const consentData = JSON.parse(consent)
    return consentData.analytics === true
  } catch {
    return false
  }
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  
  // Check if gtag is already initialized
  if (typeof window.gtag === 'function') {
    return
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID)
}

// Load Google Analytics script
export const loadGAScript = (): void => {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  
  // Check if script is already loaded
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)
  if (existingScript) return

  // Load the gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialize GA after script loads
  script.onload = () => {
    initGA()
  }
}

// Track page view
export const trackPageView = (path: string): void => {
  if (!hasAnalyticsConsent()) return
  if (!window.gtag) {
    loadGAScript()
    return
  }
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}

// Track custom event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!hasAnalyticsConsent()) return
  if (!window.gtag) {
    loadGAScript()
    return
  }
  
  window.gtag('event', eventName, eventParams)
}

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

