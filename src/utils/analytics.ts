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

// Initialize dataLayer and gtag function (matches Google's standard implementation)
const initGtagFunction = (): void => {
  if (typeof window === 'undefined') return
  
  // Initialize dataLayer if not already done
  window.dataLayer = window.dataLayer || []
  
  // Initialize gtag function if not already done (matches Google's standard pattern)
  if (typeof window.gtag !== 'function') {
    function gtag(...args: any[]) {
      // Push arguments array to dataLayer (matches Google's pattern: dataLayer.push(arguments))
      window.dataLayer.push(args)
    }
    window.gtag = gtag
  }
}

// Track if script is fully loaded and ready
let isGAScriptReady = false

// Load Google Analytics script and initialize (matches Google's standard implementation)
export const loadGAScript = (): void => {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  
  // Check if already initialized and ready
  if (isGAScriptReady && typeof window.gtag === 'function') {
    return
  }

  // Step 1: Initialize dataLayer and gtag function FIRST (before script loads)
  initGtagFunction()

  // Check if script is already in DOM
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)
  
  if (existingScript) {
    // Script is already in DOM, check if it's loaded
    if (existingScript.getAttribute('data-loaded') === 'true') {
      // Script was previously loaded, reinitialize
      isGAScriptReady = true
      if (window.gtag) {
        window.gtag('js', new Date())
        window.gtag('config', GA_MEASUREMENT_ID)
        console.log('[GA] Reinitialized Google Analytics:', GA_MEASUREMENT_ID)
      }
    }
    return
  }

  // Step 2: Load the async script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  
  script.onload = () => {
    isGAScriptReady = true
    script.setAttribute('data-loaded', 'true')
    
    // Small delay to ensure gtag.js has fully initialized
    setTimeout(() => {
      // The real gtag.js script should now be available
      if (window.gtag) {
        // Call config with the real gtag function
        window.gtag('js', new Date())
        window.gtag('config', GA_MEASUREMENT_ID, {
          send_page_view: true,
          // Allow localhost for testing
          allow_google_signals: true,
        })
        console.log('[GA] Script loaded and configured:', GA_MEASUREMENT_ID)
        
        // Verify dataLayer and check for any queued commands
        console.log('[GA] DataLayer contents:', window.dataLayer)
        console.log('[GA] DataLayer length:', window.dataLayer?.length)
        
        // Check if gtag is the real function (it should process dataLayer)
        console.log('[GA] Gtag function type:', typeof window.gtag)
      }
    }, 50)
  }
  
  script.onerror = () => {
    console.error('[GA] Failed to load script')
    isGAScriptReady = false
  }
  
  document.head.appendChild(script)
  console.log('[GA] Loading Google Analytics script...')
}

// Initialize Google Analytics (for backward compatibility)
export const initGA = (): void => {
  loadGAScript()
}

// Track page view
export const trackPageView = (path: string): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Page view not tracked - no consent:', path)
    return
  }
  
  // Ensure script is loaded first
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
    // Wait a bit for script to load, then track
    setTimeout(() => {
      if (window.gtag && isGAScriptReady) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: path,
        })
        console.log('[GA] Page view tracked:', path)
      }
    }, 100)
    return
  }
  
  // Script is ready, track immediately
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    send_page_view: true,
  })
  console.log('[GA] Page view tracked:', path, '- DataLayer length:', window.dataLayer?.length)
}

// Track custom event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Event not tracked - no consent:', eventName)
    return
  }
  
  // Ensure script is loaded first
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
    // Wait a bit for script to load, then track
    setTimeout(() => {
      if (window.gtag && isGAScriptReady) {
        window.gtag('event', eventName, eventParams)
        console.log('[GA] Event tracked:', eventName, eventParams)
      }
    }, 100)
    return
  }
  
  // Script is ready, track immediately
  window.gtag('event', eventName, eventParams)
  console.log('[GA] Event tracked:', eventName, eventParams)
}

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

