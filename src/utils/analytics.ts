// Google Analytics utility
// Only loads and tracks if user has consented to analytics cookies

const GA_MEASUREMENT_ID = 'G-0SV39SG3DG'
const GA_DISABLE_FLAG = `ga-disable-${GA_MEASUREMENT_ID}` as keyof Window

// Initialize GA disable flag based on consent status
// This MUST be set before any GA script loads
export const initializeGADisableFlag = (): void => {
  if (typeof window === 'undefined') return
  
  const hasConsent = hasAnalyticsConsent()
  // Set to false when consent is given, true when denied/not given
  ;(window as any)[GA_DISABLE_FLAG] = !hasConsent
  
  console.log(`[GA] ${GA_DISABLE_FLAG} set to:`, !hasConsent)
}

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

// Enable or disable GA based on consent
export const setAnalyticsEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return
  
  // CRITICAL: Set the disable flag BEFORE loading/using GA
  ;(window as any)[GA_DISABLE_FLAG] = !enabled
  
  console.log(`[GA] ${GA_DISABLE_FLAG} set to:`, !enabled, `(Analytics ${enabled ? 'ENABLED' : 'DISABLED'})`)
}

// Track if script is fully loaded and ready
let isGAScriptReady = false

// Load Google Analytics script and initialize (matches Google's standard implementation)
export const loadGAScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is undefined'))
      return
    }
    if (!hasAnalyticsConsent()) {
      reject(new Error('No analytics consent'))
      return
    }
    
    // CRITICAL: Ensure GA is enabled BEFORE loading script
    setAnalyticsEnabled(true)
    
    // Check if already initialized and ready
    if (isGAScriptReady && typeof window.gtag === 'function') {
      resolve()
      return
    }

    // Step 1: Initialize dataLayer FIRST (critical - must be before script)
    // This matches Google's exact pattern
    window.dataLayer = window.dataLayer || []
    
    // Step 2: Define gtag function BEFORE script loads (matches Google's exact pattern)
    // This ensures commands are queued in dataLayer before script processes them
    if (typeof window.gtag !== 'function') {
      // Use the exact pattern from Google's documentation
      // Must use function (not arrow) to access arguments object
      // eslint-disable-next-line prefer-rest-params
      function gtag() {
        // Push arguments object directly to dataLayer (matches Google's exact pattern)
        // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
        window.dataLayer.push(arguments as any)
      }
      window.gtag = gtag
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)
    
    if (existingScript && existingScript.getAttribute('data-loaded') === 'true') {
      isGAScriptReady = true
      // Re-initialize config
      if (window.gtag) {
        window.gtag('js', new Date())
        window.gtag('config', GA_MEASUREMENT_ID)
      }
      resolve()
      return
    }

    if (existingScript) {
      // Script is loading, wait for it
      const checkInterval = setInterval(() => {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          clearInterval(checkInterval)
          isGAScriptReady = true
          resolve()
        }
      }, 100)
      return
    }

    // Step 3: Load the async script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    
    script.onload = () => {
      script.setAttribute('data-loaded', 'true')
      
      // The real gtag.js script should now be loaded and should have:
      // 1. Processed all existing dataLayer items
      // 2. Replaced our custom gtag function
      // We need to wait a moment for it to fully initialize
      setTimeout(() => {
        if (window.gtag) {
          isGAScriptReady = true
          
          try {
            // Call js and config - these should trigger actual network requests
            window.gtag('js', new Date())
            window.gtag('config', GA_MEASUREMENT_ID, {
              send_page_view: true,
              page_path: window.location.pathname,
              page_location: window.location.href,
            })
            
            console.log('[GA] ✅ Script loaded and configured:', GA_MEASUREMENT_ID)
            console.log('[GA] DataLayer length after config:', window.dataLayer.length)
            console.log('[GA] Current URL:', window.location.href)
            
            // CRITICAL: Verify GA disable flag is set correctly
            const disableFlag = (window as any)[GA_DISABLE_FLAG]
            console.log(`[GA] ${GA_DISABLE_FLAG}:`, disableFlag, `(should be false/undefined to allow tracking)`)
            
            if (disableFlag === true) {
              console.error('[GA] ❌ ERROR: GA is disabled! Set', GA_DISABLE_FLAG, 'to false or undefined')
            }
            
            // Verify no Consent Mode blocking
            if (window.dataLayer && window.dataLayer.length > 0) {
              const consentCommands = window.dataLayer.filter((item: any) => 
                Array.isArray(item) && item[0] === 'consent' && item[1] === 'default'
              )
              if (consentCommands.length > 0) {
                console.warn('[GA] ⚠️ Found Consent Mode default commands. Ensure they are updated to "granted"')
                console.warn('[GA] Consent commands:', consentCommands)
              }
            }
            
            // Debug: Log gtag function info
            console.log('[GA] Gtag function exists:', typeof window.gtag === 'function')
            console.log('[GA] Gtag function source:', window.gtag?.toString().substring(0, 100))
            
            // Monitor for network requests - they should appear within 1-2 seconds
            let checkCount = 0
            const maxChecks = 10
            const checkInterval = setInterval(() => {
              checkCount++
              const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
              const collectRequests = resources.filter(r => {
                const url = r.name
                return url.includes('/g/collect') || 
                       url.includes('google-analytics.com/g/collect') ||
                       url.includes('analytics.google.com/g/collect')
              })
              
              if (collectRequests.length > 0) {
                console.log('[GA] ✅ Found', collectRequests.length, 'data collection requests!')
                collectRequests.forEach(req => {
                  console.log('[GA]   ✅ Request:', req.name.split('?')[0])
                })
                clearInterval(checkInterval)
              } else if (checkCount >= maxChecks) {
                console.warn('[GA] ⚠️ No data collection requests after', maxChecks * 500, 'ms')
                console.warn('[GA] This could mean:')
                console.warn('[GA]   1. Ad blocker is blocking requests (check Network tab for blocked)')
                console.warn('[GA]   2. Browser privacy settings are blocking tracking')
                console.warn('[GA]   3. CSP headers might be blocking requests')
                console.warn('[GA]   4. The real gtag.js script might not have replaced our function')
                
                // Try to manually trigger a request to see what happens
                console.log('[GA] Attempting manual test request...')
                if (window.gtag) {
                  window.gtag('event', 'debug_test', { debug_mode: true })
                  console.log('[GA] Manual event sent. Check Network tab now for /g/collect requests.')
                }
                
                console.warn('[GA]   📊 Action: Check Network tab → Filter by "collect" → Look for blocked/failed requests')
                clearInterval(checkInterval)
              }
            }, 500)
            
            resolve()
          } catch (error) {
            console.error('[GA] ❌ Error configuring GA:', error)
            reject(error)
          }
        } else {
          console.error('[GA] ❌ Gtag function not found after script load')
          reject(new Error('Gtag function not available'))
        }
      }, 500) // Give the script more time to fully execute and replace our function
    }
    
    script.onerror = () => {
      console.error('[GA] ❌ Failed to load script')
      isGAScriptReady = false
      reject(new Error('Failed to load GA script'))
    }
    
    document.head.appendChild(script)
    console.log('[GA] Loading Google Analytics script...')
  })
}

// Initialize Google Analytics (for backward compatibility)
export const initGA = (): void => {
  loadGAScript().catch(err => {
    console.error('[GA] Initialization error:', err)
  })
}

// Track page view
export const trackPageView = (path: string): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Page view not tracked - no consent:', path)
    return
  }
  
  // Ensure script is loaded first, then track
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
      .then(() => {
        if (window.gtag) {
          window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            send_page_view: true,
          })
          console.log('[GA] ✅ Page view tracked:', path)
        }
      })
      .catch(err => {
        console.error('[GA] Failed to track page view:', err)
      })
    return
  }
  
  // Script is ready, track immediately
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    send_page_view: true,
  })
  console.log('[GA] ✅ Page view tracked:', path)
}

// Track custom event
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  if (!hasAnalyticsConsent()) {
    console.log('[GA] Event not tracked - no consent:', eventName)
    return
  }
  
  // Ensure script is loaded first, then track
  if (!isGAScriptReady || !window.gtag) {
    loadGAScript()
      .then(() => {
        if (window.gtag) {
          window.gtag('event', eventName, eventParams)
          console.log('[GA] ✅ Event tracked:', eventName, eventParams)
        }
      })
      .catch(err => {
        console.error('[GA] Failed to track event:', err)
      })
    return
  }
  
  // Script is ready, track immediately
  window.gtag('event', eventName, eventParams)
  console.log('[GA] ✅ Event tracked:', eventName, eventParams)
}

// Helper function to diagnose GA issues (run in console after accepting cookies)
export const diagnoseGA = (): void => {
  if (typeof window === 'undefined') return
  
  console.log('=== GA DIAGNOSTICS ===')
  
  // 1. Check disable flag
  const disableFlag = (window as any)[GA_DISABLE_FLAG]
  console.log(`1. ${GA_DISABLE_FLAG}:`, disableFlag)
  if (disableFlag === true) {
    console.error('   ❌ GA IS DISABLED! Set this to false or undefined')
  } else {
    console.log('   ✅ Flag is OK')
  }
  
  // 2. Check gtag function
  console.log('2. window.gtag:', typeof window.gtag)
  if (typeof window.gtag === 'function') {
    console.log('   ✅ Gtag function exists')
  } else {
    console.error('   ❌ Gtag function missing!')
  }
  
  // 3. Check dataLayer
  console.log('3. window.dataLayer:', window.dataLayer)
  console.log('   Length:', window.dataLayer?.length || 0)
  
  // 4. Check for Consent Mode
  if (window.dataLayer && window.dataLayer.length > 0) {
    const consentCommands = window.dataLayer.filter((item: any) => 
      Array.isArray(item) && item[0] === 'consent'
    )
    if (consentCommands.length > 0) {
      console.warn('4. Consent Mode commands found:', consentCommands)
      console.warn('   ⚠️ If analytics_storage is "denied", GA won\'t send requests')
    } else {
      console.log('4. ✅ No Consent Mode commands (OK if not using Consent Mode)')
    }
  }
  
  // 5. Check for network requests
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const collectRequests = resources.filter(r => 
    r.name.includes('/g/collect') || 
    r.name.includes('google-analytics.com/g/collect')
  )
  const scriptRequests = resources.filter(r => 
    r.name.includes('googletagmanager.com/gtag/js')
  )
  
  console.log('5. Network requests:')
  console.log('   Script loaded:', scriptRequests.length > 0 ? '✅' : '❌')
  console.log('   Data collection requests:', collectRequests.length)
  
  if (collectRequests.length > 0) {
    collectRequests.forEach(req => {
      console.log(`   ✅ ${req.name.split('?')[0]} - Status: ${req.responseStatus || 'pending'}`)
    })
  } else {
    console.warn('   ❌ No /g/collect requests found')
    console.warn('   📊 Check Network tab → Filter by "collect"')
    console.warn('   📊 Look for blocked/failed requests (red entries)')
  }
  
  // 6. Check CSP (if available)
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  if (metaCSP) {
    console.warn('6. CSP meta tag found. Check if connect-src allows google-analytics.com')
    console.warn('   CSP:', metaCSP.getAttribute('content')?.substring(0, 100))
  } else {
    console.log('6. ✅ No CSP meta tag (check HTTP headers separately)')
  }
  
  // 7. Manual test
  console.log('7. Manual test:')
  if (window.gtag) {
    try {
      window.gtag('event', 'diagnostic_test', { test: true })
      console.log('   ✅ Manual event sent. Check Network tab now.')
    } catch (error) {
      console.error('   ❌ Error sending manual event:', error)
    }
  }
  
  console.log('=== END DIAGNOSTICS ===')
  console.log('💡 If no requests appear, check:')
  console.log('   1. Network tab for blocked requests')
  console.log('   2. Console for CSP errors')
  console.log('   3. Browser extensions (ad blockers)')
}

// Legacy function name (backwards compatibility)
export const checkGANetworkRequests = diagnoseGA

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

