import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import { Search, Bell, Heart as HeartIcon, LayoutGrid, Home, MessageSquare, Bookmark, Calendar, Plus, MoreHorizontal } from 'lucide-react'
import Step1Photos from './steps/Step1Photos'
import Step2Location from './steps/Step2Location'
import Step3Details from './steps/Step3Details'
import Step4Pricing from './steps/Step4Pricing'
import Step5Preferences from './steps/Step5Preferences'

const STEPS = [
  { 
    id: 'photos', 
    title: 'Photos', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: 'location', 
    title: 'Location', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    id: 'details', 
    title: 'Details', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    id: 'pricing', 
    title: 'Pricing', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'preferences', 
    title: 'Preferences', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
]

const ListingWizard = () => {
  const navigate = useNavigate()
  const { currentListing, setCurrentListing, allListings, addListing, setAllListings, user, setUser } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])) // Only first section expanded by default
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showUserMenu, setShowUserMenu] = useState(false)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U'

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mokogo-user')
    navigate('/')
  }
  
  const listingDataRef = useRef<Partial<Listing>>(
    currentListing && currentListing.status === 'draft'
      ? currentListing
      : {
          id: `listing-${Date.now()}`,
          title: '',
          city: '',
          locality: '',
          bhkType: '',
          roomType: '',
          rent: 0,
          deposit: 0,
          moveInDate: '',
          furnishingLevel: '',
          flatAmenities: [],
          societyAmenities: [],
          preferredGender: '',
          description: '',
          photos: [],
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
  )
  const [listingData, setListingData] = useState<Partial<Listing>>(listingDataRef.current)

  // Determine starting step based on draft data
  useEffect(() => {
    if (currentListing && currentListing.status === 'draft') {
      let step = 0
      if (currentListing.photos && currentListing.photos.length >= 3) step = 1
      if (currentListing.city && currentListing.locality) step = 2
      if (currentListing.bhkType && currentListing.roomType && currentListing.furnishingLevel) step = 3
      if (currentListing.rent && currentListing.moveInDate) step = 4
      if (currentListing.preferredGender) step = 5
      setCurrentStep(step)
      setExpandedSections(new Set([step]))
    }
  }, [])

  // Autosave functionality
  const saveDraft = (showNotification = false) => {
    const dataToSave = listingDataRef.current
    const updatedListing: Partial<Listing> = {
      ...dataToSave,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }
    listingDataRef.current = updatedListing
    setListingData(updatedListing)
    setCurrentListing(updatedListing as Listing)
    setLastSaved(new Date())
    if (showNotification) {
      setShowToast(true)
    }
  }

  // Autosave on data change (debounced)
  useEffect(() => {
    listingDataRef.current = listingData
    
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (listingData.city || listingData.locality || listingData.rent || listingData.photos?.length) {
        saveDraft(true)
      }
    }, 1000) // Debounce autosave

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [listingData.city, listingData.locality, listingData.bhkType, listingData.roomType, listingData.rent, listingData.moveInDate, listingData.furnishingLevel, listingData.preferredGender, listingData.photos?.length])

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (STEPS[stepIndex].id) {
      case 'photos':
        if (!listingData.photos || listingData.photos.length < 3) {
          newErrors.photos = 'Please add at least 3 photos'
        }
        break
      case 'location':
        if (!listingData.city) newErrors.city = 'City is required'
        if (!listingData.locality) newErrors.locality = 'Locality is required'
        break
      case 'details':
        if (!listingData.bhkType) newErrors.bhkType = 'BHK type is required'
        if (!listingData.roomType) newErrors.roomType = 'Room type is required'
        if (!listingData.furnishingLevel) newErrors.furnishingLevel = 'Furnishing status is required'
        break
      case 'pricing':
        if (!listingData.rent) newErrors.rent = 'Rent is required'
        if (!listingData.deposit) newErrors.deposit = 'Deposit is required'
        if (!listingData.moveInDate) newErrors.moveInDate = 'Available date is required'
        break
      case 'preferences':
        if (!listingData.preferredGender) newErrors.preferredGender = 'Gender preference is required'
        break
    }

    setErrors(prev => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleSectionContinue = (stepIndex: number) => {
    if (validateStep(stepIndex)) {
      // Collapse current section
      setExpandedSections(prev => {
        const newSet = new Set(prev)
        newSet.delete(stepIndex)
        return newSet
      })
      
      if (stepIndex < STEPS.length - 1) {
        // Expand next section
        const nextStep = stepIndex + 1
        setCurrentStep(nextStep)
        setExpandedSections(prev => {
          const newSet = new Set(prev)
          newSet.add(nextStep)
          return newSet
        })
        // Scroll to next section
        setTimeout(() => {
          document.getElementById(`section-${nextStep}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      } else {
        // Last section - create listing
        handleCreateListing()
      }
    }
  }

  const isSectionComplete = (stepIndex: number): boolean => {
    switch (STEPS[stepIndex].id) {
      case 'photos':
        return !!(listingData.photos && listingData.photos.length >= 3)
      case 'location':
        return !!(listingData.city && listingData.locality)
      case 'details':
        return !!(listingData.bhkType && listingData.roomType && listingData.furnishingLevel)
      case 'pricing':
        return !!(listingData.rent && listingData.deposit && listingData.moveInDate)
      case 'preferences':
        return !!listingData.preferredGender
      default:
        return false
    }
  }

  const generateTitle = (): string => {
    const roomType = listingData.roomType === 'Private Room' ? 'Private Room' : listingData.roomType === 'Shared Room' ? 'Shared Room' : 'Room'
    const bhk = listingData.bhkType || ''
    const locality = listingData.locality || listingData.city || ''
    const rent = listingData.rent ? `₹${listingData.rent.toLocaleString()}` : ''
    const furnishing = listingData.furnishingLevel || ''
    
    return `${roomType} in ${bhk} · ${locality} · ${rent} · ${furnishing}`
  }

  const handleCreateListing = () => {
    // Generate title
    const title = generateTitle()
    
    const publishedListing: Listing = {
      ...listingData,
      title,
      status: 'live',
      updatedAt: new Date().toISOString(),
    } as Listing

    setCurrentListing(publishedListing)
    
    // Add to all listings if not already present
    const existingIndex = allListings.findIndex(l => l.id === publishedListing.id)
    if (existingIndex >= 0) {
      const updatedListings = [...allListings]
      updatedListings[existingIndex] = publishedListing
      setAllListings(updatedListings)
    } else {
      addListing(publishedListing)
    }
    
    navigate('/dashboard')
  }

  const handleDataChange = (updates: Partial<Listing>) => {
    setListingData((prev) => {
      const updated = { ...prev, ...updates }
      return updated
    })
  }

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
    if (diff < 60) return 'Saved just now'
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)} min ago`
    return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const renderStepContent = (stepIndex: number) => {
    const stepError = errors[STEPS[stepIndex].id]
    
    switch (STEPS[stepIndex].id) {
      case 'photos':
        return <Step1Photos data={listingData} onChange={handleDataChange} />
      case 'location':
        return <Step2Location data={listingData} onChange={handleDataChange} error={stepError} />
      case 'details':
        return <Step3Details data={listingData} onChange={handleDataChange} error={stepError} />
      case 'pricing':
        return <Step4Pricing data={listingData} onChange={handleDataChange} error={stepError} />
      case 'preferences':
        return <Step5Preferences data={listingData} onChange={handleDataChange} error={stepError} />
      default:
        return null
    }
  }


  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Dashboard-style Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Logo />
              
              <nav className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50"
                >
                  Dashboard
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-900"
                >
                  Create Listing
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center bg-white/85 backdrop-blur-md rounded-xl px-4 py-2 border border-stone-200">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search listings, areas..." 
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64" 
                />
              </div>
              
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <HeartIcon className="w-5 h-5" />
              </button>
              
              <div 
                className="flex items-center gap-3 cursor-pointer relative"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center border-2 border-orange-400">
                  <span className="text-white font-medium text-sm">
                    {userInitial}
                  </span>
                </div>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen bg-white/70 backdrop-blur-md border-r border-stone-200 sticky top-16">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Workspace</h3>
                <button className="text-gray-500 hover:text-orange-400 transition-colors duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-1">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-white/50"
                >
                  <LayoutGrid className="w-4 h-4 mr-3" />
                  <span>Overview</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-white/50"
                >
                  <Home className="w-4 h-4 mr-3" />
                  <span>My Listings</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-white/50">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  <span>Conversations</span>
                  <span className="ml-auto text-xs bg-orange-400/20 text-orange-600 px-2 py-1 rounded-full">12</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-white/50">
                  <Bookmark className="w-4 h-4 mr-3" />
                  <span>Saved Properties</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-white/50">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Viewings</span>
                </button>
              </div>
            </div>
            
            <div className="bg-orange-400/8 rounded-2xl p-4 border border-stone-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-orange-400 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Post Your Listing</h4>
                  <p className="text-xs text-gray-500 mb-3">Find your perfect roommate in minutes</p>
                  <button 
                    onClick={() => navigate('/listing/wizard')}
                    className="text-xs font-medium text-orange-400 hover:underline"
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-stone-100">
          <div className="max-w-[900px] mx-auto px-8 py-4">
          {/* Page Header */}
          <div className="mb-3">
            <h1 className="text-[1.375rem] font-bold text-gray-900 mb-0.5">List Your Space</h1>
            <p className="text-[0.825rem] text-gray-600">Find your perfect flatmate in under 5 minutes</p>
          </div>

          {/* Resume Banner */}
          {currentListing && currentListing.status === 'draft' && (
            <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-2 mb-3">
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-mokogo-info-text mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[0.825rem] text-mokogo-info-text">
                  You're continuing a saved draft. Review your details and publish when ready.
                </p>
              </div>
            </div>
          )}

          {/* Accordion Sections */}
          <div className="space-y-2">
            {STEPS.map((step, index) => {
              const isExpanded = expandedSections.has(index)
              const isComplete = isSectionComplete(index)
              const stepError = errors[step.id]
              
              return (
                <div 
                  key={step.id} 
                  id={`section-${index}`}
                  className="bg-white/70 backdrop-blur-md rounded-lg shadow-sm border border-white/35 overflow-visible transition-all"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isComplete
                            ? 'bg-green-500 text-white' 
                            : index === currentStep
                              ? 'bg-orange-400 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isComplete ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="text-[10px]">
                            {step.icon}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-[0.9625rem] font-semibold text-gray-900">{step.title}</h3>
                        {stepError && (
                          <p className="text-[0.825rem] text-red-600 mt-0.5">{stepError}</p>
                        )}
                      </div>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                      {renderStepContent(index)}
                      
                      {/* Section Navigation */}
                      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleSectionContinue(index)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          <div className="flex items-center gap-1.5">
                            {index === STEPS.length - 1 ? 'Create Listing' : 'Continue'}
                            {index < STEPS.length - 1 && (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Autosave indicator */}
          {lastSaved && (
            <div className="mt-4 text-[0.825rem] text-gray-500 text-center">
              {formatLastSaved()}
            </div>
          )}
          </div>
        </main>
      </div>

      <Footer />
      {showToast && <Toast message="Draft saved" onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default ListingWizard
