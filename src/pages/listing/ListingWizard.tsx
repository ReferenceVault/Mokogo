import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'

import { listingsApi, CreateListingRequest } from '@/services/api'
import { handleLogout as handleLogoutUtil } from '@/utils/auth'
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
  const { currentListing, setCurrentListing, allListings, addListing, setAllListings, user } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])) // Only first section expanded by default
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(new Set())

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U'


  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return ''
    if (typeof date === 'string') {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
      // If it's an ISO string, extract the date part
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split('T')[0]
      }
      return date
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return ''
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setCurrentListing(null)
      setAllListings([])
      setRequests([])
      localStorage.removeItem('mokogo-user')
      localStorage.removeItem('mokogo-listing')
      localStorage.removeItem('mokogo-all-listings')
      localStorage.removeItem('mokogo-requests')
      localStorage.removeItem('mokogo-access-token')
      localStorage.removeItem('mokogo-refresh-token')
      navigate('/auth')
    }
  }
  
  // Check if we're editing an existing listing (has real ID and not a draft)
  const isEditing = currentListing?.id && !currentListing.id.startsWith('listing-') && currentListing.status !== 'draft'
  
  const listingDataRef = useRef<Partial<Listing>>(
    currentListing && (currentListing.status === 'draft' || isEditing)
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

  // Load listing data when editing or determine starting step based on draft data
  useEffect(() => {
    if (isEditing && currentListing) {
      // Editing mode: load all data and mark all steps as validated
      // Format date for HTML input
      const formattedListing = {
        ...currentListing,
        moveInDate: formatDateForInput(currentListing.moveInDate),
      }
      listingDataRef.current = formattedListing
      setListingData(formattedListing)
      // Mark all steps as validated since we're editing a complete listing
      setValidatedSteps(new Set([0, 1, 2, 3, 4]))
      // Start at first step
      setCurrentStep(0)
      setExpandedSections(new Set([0]))
    } else if (currentListing && currentListing.status === 'draft') {
      // Format date for HTML input
      const formattedListing = {
        ...currentListing,
        moveInDate: formatDateForInput(currentListing.moveInDate),
      }
      listingDataRef.current = formattedListing
      setListingData(formattedListing)
      // Draft mode: determine starting step based on what's filled
      let step = 0
      if (currentListing.photos && currentListing.photos.length >= 3) step = 1
      if (currentListing.city && currentListing.locality) step = 2
      if (currentListing.bhkType && currentListing.roomType && currentListing.furnishingLevel) step = 3
      if (currentListing.rent && currentListing.moveInDate) step = 4
      if (currentListing.preferredGender) step = 5
      setCurrentStep(step)
      setExpandedSections(new Set([step]))
    } else if (!currentListing) {
      // New listing mode: reset everything to start fresh
      const newListingData: Partial<Listing> = {
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
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      listingDataRef.current = newListingData
      setListingData(newListingData)
      setValidatedSteps(new Set())
      setCurrentStep(0)
      setExpandedSections(new Set([0]))
      setErrors({})
    }
  }, [isEditing, currentListing])

  /**
   * Saves listing as DRAFT
   * When skipValidation is true (Save Draft button), saves any entered data
   * When skipValidation is false (Continue button), only includes fields from validated steps
   * Excludes defaults like rent:0, deposit:0
   */
  const saveDraft = async (showNotification = false, skipValidation = false) => {
    const dataToSave = listingDataRef.current
    
    // When editing, allow saving without strict validation (user is updating existing listing)
    if (!isEditing && !skipValidation) {
      // Only save if at least the photos step has been validated (when called from Continue button)
      if (validatedSteps.size === 0) {
        return
      }
      
      // Don't save if photos step isn't validated or doesn't have enough photos
      if (!validatedSteps.has(0) || !dataToSave.photos || dataToSave.photos.length < 3) {
        return
      }
    }

    setIsSaving(true)
    try {
      // Build draft data
      // When editing, include all fields that have values
      // When creating, ONLY include fields from validated steps
      const draftData: Partial<CreateListingRequest> = {
        title: dataToSave.title || generateTitle(),
      }

      // When editing, preserve the original status, otherwise use 'draft'
      if (isEditing && currentListing?.status) {
        draftData.status = currentListing.status
      } else {
        draftData.status = 'draft'
      }

      // When editing, include all fields that have values
      if (isEditing) {
        if (dataToSave.photos && dataToSave.photos.length > 0) {
          draftData.photos = dataToSave.photos
        }
        if (dataToSave.city && dataToSave.city.trim()) {
          draftData.city = dataToSave.city
        }
        if (dataToSave.locality && dataToSave.locality.trim()) {
          draftData.locality = dataToSave.locality
        }
        if (dataToSave.societyName && dataToSave.societyName.trim()) {
          draftData.societyName = dataToSave.societyName
        }
        if (dataToSave.bhkType && dataToSave.bhkType.trim()) {
          draftData.bhkType = dataToSave.bhkType
        }
        if (dataToSave.roomType && dataToSave.roomType.trim()) {
          draftData.roomType = dataToSave.roomType
        }
        if (dataToSave.furnishingLevel && dataToSave.furnishingLevel.trim()) {
          draftData.furnishingLevel = dataToSave.furnishingLevel
        }
        if (dataToSave.bathroomType && dataToSave.bathroomType.trim()) {
          draftData.bathroomType = dataToSave.bathroomType
        }
        if (dataToSave.flatAmenities && dataToSave.flatAmenities.length > 0) {
          draftData.flatAmenities = dataToSave.flatAmenities
        }
        if (dataToSave.societyAmenities && dataToSave.societyAmenities.length > 0) {
          draftData.societyAmenities = dataToSave.societyAmenities
        }
        if (dataToSave.rent && dataToSave.rent > 0) {
          draftData.rent = dataToSave.rent
        }
        if (dataToSave.deposit && dataToSave.deposit > 0) {
          draftData.deposit = dataToSave.deposit
        }
        if (dataToSave.moveInDate && dataToSave.moveInDate.trim()) {
          draftData.moveInDate = dataToSave.moveInDate
        }
        if (dataToSave.preferredGender && dataToSave.preferredGender.trim()) {
          draftData.preferredGender = dataToSave.preferredGender
        }
        if (dataToSave.description && dataToSave.description.trim()) {
          draftData.description = dataToSave.description
        }
      } else {
        // When creating, include fields based on skipValidation flag
        if (skipValidation) {
          // Save Draft button: include any data that has been entered
          if (dataToSave.photos && dataToSave.photos.length > 0) {
            draftData.photos = dataToSave.photos
          }
          if (dataToSave.city && dataToSave.city.trim()) {
            draftData.city = dataToSave.city
          }
          if (dataToSave.locality && dataToSave.locality.trim()) {
            draftData.locality = dataToSave.locality
          }
          if (dataToSave.societyName && dataToSave.societyName.trim()) {
            draftData.societyName = dataToSave.societyName
          }
          if (dataToSave.bhkType && dataToSave.bhkType.trim()) {
            draftData.bhkType = dataToSave.bhkType
          }
          if (dataToSave.roomType && dataToSave.roomType.trim()) {
            draftData.roomType = dataToSave.roomType
          }
          if (dataToSave.furnishingLevel && dataToSave.furnishingLevel.trim()) {
            draftData.furnishingLevel = dataToSave.furnishingLevel
          }
          if (dataToSave.bathroomType && dataToSave.bathroomType.trim()) {
            draftData.bathroomType = dataToSave.bathroomType
          }
          if (dataToSave.flatAmenities && dataToSave.flatAmenities.length > 0) {
            draftData.flatAmenities = dataToSave.flatAmenities
          }
          if (dataToSave.societyAmenities && dataToSave.societyAmenities.length > 0) {
            draftData.societyAmenities = dataToSave.societyAmenities
          }
          if (dataToSave.rent && dataToSave.rent > 0) {
            draftData.rent = dataToSave.rent
          }
          if (dataToSave.deposit && dataToSave.deposit > 0) {
            draftData.deposit = dataToSave.deposit
          }
          if (dataToSave.moveInDate && dataToSave.moveInDate.trim()) {
            draftData.moveInDate = dataToSave.moveInDate
          }
          if (dataToSave.preferredGender && dataToSave.preferredGender.trim()) {
            draftData.preferredGender = dataToSave.preferredGender
          }
          if (dataToSave.description && dataToSave.description.trim()) {
            draftData.description = dataToSave.description
          }
        } else {
          // Continue button: ONLY include fields from validated steps
          // Only include photos if photos step is validated
          if (validatedSteps.has(0) && dataToSave.photos && dataToSave.photos.length >= 3) {
            draftData.photos = dataToSave.photos
          }

          // Only include location fields if location step (step 1) is validated
          if (validatedSteps.has(1)) {
            if (dataToSave.city && dataToSave.city.trim()) {
              draftData.city = dataToSave.city
            }
            if (dataToSave.locality && dataToSave.locality.trim()) {
              draftData.locality = dataToSave.locality
            }
            if (dataToSave.societyName && dataToSave.societyName.trim()) {
              draftData.societyName = dataToSave.societyName
            }
          }

          // Only include details fields if details step (step 2) is validated
          if (validatedSteps.has(2)) {
            if (dataToSave.bhkType && dataToSave.bhkType.trim()) {
              draftData.bhkType = dataToSave.bhkType
            }
            if (dataToSave.roomType && dataToSave.roomType.trim()) {
              draftData.roomType = dataToSave.roomType
            }
            if (dataToSave.furnishingLevel && dataToSave.furnishingLevel.trim()) {
              draftData.furnishingLevel = dataToSave.furnishingLevel
            }
            if (dataToSave.bathroomType && dataToSave.bathroomType.trim()) {
              draftData.bathroomType = dataToSave.bathroomType
            }
            if (dataToSave.flatAmenities && dataToSave.flatAmenities.length > 0) {
              draftData.flatAmenities = dataToSave.flatAmenities
            }
            if (dataToSave.societyAmenities && dataToSave.societyAmenities.length > 0) {
              draftData.societyAmenities = dataToSave.societyAmenities
            }
          }

          // Only include pricing fields if pricing step (step 3) is validated
          // Do NOT send defaults like rent:0 or deposit:0
          if (validatedSteps.has(3)) {
            if (dataToSave.rent && dataToSave.rent > 0) {
              draftData.rent = dataToSave.rent
            }
            if (dataToSave.deposit && dataToSave.deposit > 0) {
              draftData.deposit = dataToSave.deposit
            }
            if (dataToSave.moveInDate && dataToSave.moveInDate.trim()) {
              draftData.moveInDate = dataToSave.moveInDate
            }
          }

          // Only include preferences fields if preferences step (step 4) is validated
          if (validatedSteps.has(4)) {
            if (dataToSave.preferredGender && dataToSave.preferredGender.trim()) {
              draftData.preferredGender = dataToSave.preferredGender
            }
          }

          // Description can be included if provided (not step-specific)
          if (dataToSave.description && dataToSave.description.trim()) {
            draftData.description = dataToSave.description
          }
        }
      }

      let savedListing
      // Check if we're editing an existing listing (has real ID from backend)
      if (isEditing && currentListing?.id) {
        // Update existing listing (draft or live)
        savedListing = await listingsApi.update(currentListing.id, draftData)
      } else if (currentListing?.id && !currentListing.id.startsWith('listing-')) {
        // Update existing draft from backend
        savedListing = await listingsApi.update(currentListing.id, draftData)
      } else {
        // Create new draft
        savedListing = await listingsApi.create(draftData)
      }

      // Map API response to frontend format
      const mappedListing: Listing = {
        id: savedListing._id || savedListing.id,
        title: savedListing.title,
        city: savedListing.city,
        locality: savedListing.locality,
        societyName: savedListing.societyName,
        bhkType: savedListing.bhkType,
        roomType: savedListing.roomType,
        rent: savedListing.rent,
        deposit: savedListing.deposit,
        moveInDate: savedListing.moveInDate,
        furnishingLevel: savedListing.furnishingLevel,
        bathroomType: savedListing.bathroomType,
        flatAmenities: savedListing.flatAmenities,
        societyAmenities: savedListing.societyAmenities,
        preferredGender: savedListing.preferredGender,
        description: savedListing.description,
        photos: savedListing.photos,
        status: savedListing.status,
        createdAt: savedListing.createdAt,
        updatedAt: savedListing.updatedAt,
      }

      listingDataRef.current = mappedListing
      setListingData(mappedListing)
      setCurrentListing(mappedListing)
      setLastSaved(new Date())
      
      if (showNotification) {
        setShowToast(true)
      }
    } catch (error: any) {
      console.error('Error saving draft:', error)
      // Don't show error to user for autosave, just log it
    } finally {
      setIsSaving(false)
    }
  }

  // Update ref when listingData changes (local state only, NO API calls)
  useEffect(() => {
    listingDataRef.current = listingData
    // NO API calls here - only update local ref
    // API calls happen when photos are uploaded or Continue button is clicked
  }, [listingData])

  /**
   * Validates ONLY the specified step's fields
   * Does NOT validate other steps
   * Returns true if step is valid, false otherwise
   */
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}
    const stepId = STEPS[stepIndex].id
    
    // Use the latest data from ref to ensure we validate current state
    const dataToValidate = listingDataRef.current
    
    // Clear previous errors for this step only
    const stepErrors: Record<string, string> = {}
    
    // Validate ONLY this step's fields
    switch (stepId) {
      case 'photos':
        if (!dataToValidate.photos || dataToValidate.photos.length < 3) {
          stepErrors.photos = 'Please add at least 3 photos'
          newErrors[stepId] = 'Please add at least 3 photos to continue'
        }
        break
      case 'location':
        // Both city AND locality must be filled
        if (!dataToValidate.city || dataToValidate.city.trim() === '') {
          stepErrors.city = 'City is required'
          newErrors[stepId] = 'City is required'
        }
        if (!dataToValidate.locality || dataToValidate.locality.trim() === '') {
          stepErrors.locality = 'Locality is required'
          newErrors[stepId] = newErrors[stepId] || 'Locality is required'
        }
        break
      case 'details':
        if (!dataToValidate.bhkType || dataToValidate.bhkType.trim() === '') {
          stepErrors.bhkType = 'BHK type is required'
          newErrors[stepId] = 'BHK type is required'
        }
        if (!dataToValidate.roomType || dataToValidate.roomType.trim() === '') {
          stepErrors.roomType = 'Room type is required'
          newErrors[stepId] = newErrors[stepId] || 'Room type is required'
        }
        if (!dataToValidate.furnishingLevel || dataToValidate.furnishingLevel.trim() === '') {
          stepErrors.furnishingLevel = 'Furnishing status is required'
          newErrors[stepId] = newErrors[stepId] || 'Furnishing status is required'
        }
        break
      case 'pricing':
        if (!dataToValidate.rent || dataToValidate.rent <= 0) {
          stepErrors.rent = 'Rent is required'
          newErrors[stepId] = 'Rent is required'
        }
        if (!dataToValidate.deposit || dataToValidate.deposit <= 0) {
          stepErrors.deposit = 'Deposit is required'
          newErrors[stepId] = newErrors[stepId] || 'Deposit is required'
        }
        if (!dataToValidate.moveInDate || dataToValidate.moveInDate.trim() === '') {
          stepErrors.moveInDate = 'Available date is required'
          newErrors[stepId] = newErrors[stepId] || 'Available date is required'
        }
        break
      case 'preferences':
        if (!dataToValidate.preferredGender || dataToValidate.preferredGender.trim() === '') {
          stepErrors.preferredGender = 'Gender preference is required'
          newErrors[stepId] = 'Gender preference is required'
        }
        break
    }

    // Update errors: clear this step's errors, then add new ones
    setErrors(prev => {
      const updated = { ...prev }
      // Remove all errors for this step
      delete updated[stepId]
      Object.keys(stepErrors).forEach(key => delete updated[key])
      // Add new errors
      return { ...updated, ...newErrors, ...stepErrors }
    })
    
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

  /**
   * Handles Continue button click for a specific step
   * 1. Validates ONLY that step's fields
   * 2. If valid: updates listing via UPDATE API and moves to next step
   * 3. If invalid: shows errors scoped to that step only
   */
  const handleSectionContinue = async (stepIndex: number) => {
    // Validate ONLY this step (not future steps)
    if (validateStep(stepIndex)) {
      // Create updated validatedSteps set that includes current step (since setState is async)
      const updatedValidatedSteps = new Set(validatedSteps)
      updatedValidatedSteps.add(stepIndex)
      
      // Mark this step as validated in state
      setValidatedSteps(updatedValidatedSteps)
      
      // Update listing with current step's data via UPDATE API
      // Only proceed if we have a listing ID (created after photo upload)
      const listingId = currentListing?.id || listingDataRef.current.id
      if (!listingId || listingId.startsWith('listing-')) {
        // No listing created yet, wait for photo upload
        return
      }
      
      try {
        setIsSaving(true)
        const dataToSave = listingDataRef.current
        
        // Build update data - include current step and all previously validated steps
        const updateData: Partial<CreateListingRequest> = {
          status: 'draft', // Keep as draft
        }
        
        // Include photos if photos step (step 0) is validated
        if (updatedValidatedSteps.has(0) && dataToSave.photos && dataToSave.photos.length >= 3) {
          updateData.photos = dataToSave.photos
        }
        
        // Include location fields if location step (step 1) is validated
        if (updatedValidatedSteps.has(1)) {
          if (dataToSave.city && dataToSave.city.trim()) updateData.city = dataToSave.city
          if (dataToSave.locality && dataToSave.locality.trim()) updateData.locality = dataToSave.locality
          if (dataToSave.societyName && dataToSave.societyName.trim()) updateData.societyName = dataToSave.societyName
        }
        
        // Include details fields if details step (step 2) is validated
        if (updatedValidatedSteps.has(2)) {
          if (dataToSave.bhkType && dataToSave.bhkType.trim()) updateData.bhkType = dataToSave.bhkType
          if (dataToSave.roomType && dataToSave.roomType.trim()) updateData.roomType = dataToSave.roomType
          if (dataToSave.furnishingLevel && dataToSave.furnishingLevel.trim()) updateData.furnishingLevel = dataToSave.furnishingLevel
          if (dataToSave.bathroomType && dataToSave.bathroomType.trim()) updateData.bathroomType = dataToSave.bathroomType
          if (dataToSave.flatAmenities && dataToSave.flatAmenities.length > 0) updateData.flatAmenities = dataToSave.flatAmenities
          if (dataToSave.societyAmenities && dataToSave.societyAmenities.length > 0) updateData.societyAmenities = dataToSave.societyAmenities
        }
        
        // Include pricing fields if pricing step (step 3) is validated
        if (updatedValidatedSteps.has(3)) {
          if (dataToSave.rent && dataToSave.rent > 0) updateData.rent = dataToSave.rent
          if (dataToSave.deposit && dataToSave.deposit > 0) updateData.deposit = dataToSave.deposit
          if (dataToSave.moveInDate && dataToSave.moveInDate.trim()) updateData.moveInDate = dataToSave.moveInDate
        }
        
        // Include preferences fields if preferences step (step 4) is validated
        if (updatedValidatedSteps.has(4)) {
          if (dataToSave.preferredGender && dataToSave.preferredGender.trim()) updateData.preferredGender = dataToSave.preferredGender
        }
        
        // Include description if provided
        if (dataToSave.description && dataToSave.description.trim()) {
          updateData.description = dataToSave.description
        }
        
        // Update listing via UPDATE API
        const savedListing = await listingsApi.update(listingId, updateData)
        
        // Map API response to frontend format, but merge with current local state to preserve all fields
        const mappedListing: Listing = {
          id: savedListing._id || savedListing.id,
          title: savedListing.title || dataToSave.title || '',
          city: savedListing.city || dataToSave.city || '',
          locality: savedListing.locality || dataToSave.locality || '',
          societyName: savedListing.societyName || dataToSave.societyName,
          bhkType: savedListing.bhkType || dataToSave.bhkType || '',
          roomType: savedListing.roomType || dataToSave.roomType || '',
          rent: savedListing.rent ?? dataToSave.rent ?? 0,
          deposit: savedListing.deposit ?? dataToSave.deposit ?? 0,
          moveInDate: formatDateForInput(savedListing.moveInDate) || dataToSave.moveInDate || '',
          furnishingLevel: savedListing.furnishingLevel || dataToSave.furnishingLevel || '',
          bathroomType: savedListing.bathroomType || dataToSave.bathroomType,
          flatAmenities: savedListing.flatAmenities || dataToSave.flatAmenities || [],
          societyAmenities: savedListing.societyAmenities || dataToSave.societyAmenities || [],
          preferredGender: savedListing.preferredGender || dataToSave.preferredGender || '',
          description: savedListing.description || dataToSave.description,
          photos: savedListing.photos || dataToSave.photos || [],
          status: savedListing.status || dataToSave.status || 'draft',
          createdAt: savedListing.createdAt || dataToSave.createdAt || new Date().toISOString(),
          updatedAt: savedListing.updatedAt || dataToSave.updatedAt || new Date().toISOString(),
        }
        
        // Update state with merged data
        listingDataRef.current = mappedListing
        setListingData(mappedListing)
        setCurrentListing(mappedListing)
        setLastSaved(new Date())
        
        // Show toast notification after successful update
        setShowToast(true)
      } catch (error) {
        console.error('Error updating listing:', error)
      } finally {
        setIsSaving(false)
      }
      
      // Collapse current section
      setExpandedSections(prev => {
        const newSet = new Set(prev)
        newSet.delete(stepIndex)
        return newSet
      })
      
      if (stepIndex < STEPS.length - 1) {
        // Move to next step
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
        // Last section - validate ALL steps and publish listing
        handleCreateListing()
      }
    }
    // If validation fails, errors are already set by validateStep (scoped to this step only)
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

  /**
   * Handles final "Create Listing" button click
   * 1. Validates ALL steps (not just current step)
   * 2. Shows all errors from all invalid steps
   * 3. If all valid: submits full data and publishes listing
   */
  const handleCreateListing = async () => {
    // Validate ALL steps before creating (collect all errors, don't stop at first)
    const invalidSteps: number[] = []
    
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        invalidSteps.push(i)
      }
    }

    if (invalidSteps.length > 0) {
      // Expand all invalid steps so user can see all errors at once
      setExpandedSections(prev => {
        const newSet = new Set(prev)
        invalidSteps.forEach(stepIndex => newSet.add(stepIndex))
        return newSet
      })
      
      // Scroll to first invalid step
      setTimeout(() => {
        document.getElementById(`section-${invalidSteps[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      
      return
    }
    
    // All steps are valid - proceed to create listing

    setIsCreating(true)
    try {
      // Generate title
      const title = generateTitle()
      
      const listingDataToSave: CreateListingRequest = {
        title,
        city: listingData.city || '',
        locality: listingData.locality || '',
        societyName: listingData.societyName,
        bhkType: listingData.bhkType || '',
        roomType: listingData.roomType || '',
        rent: listingData.rent || 0,
        deposit: listingData.deposit || 0,
        moveInDate: listingData.moveInDate || '',
        furnishingLevel: listingData.furnishingLevel || '',
        bathroomType: listingData.bathroomType,
        flatAmenities: listingData.flatAmenities || [],
        societyAmenities: listingData.societyAmenities || [],
        preferredGender: listingData.preferredGender || '',
        description: listingData.description,
        photos: listingData.photos || [],
        status: 'live',
      }

      // Always use UPDATE API to change status from draft to live
      // The listing should already exist (created after photo upload)
      const listingId = currentListing?.id || listingDataRef.current.id
      if (!listingId || listingId.startsWith('listing-')) {
        throw new Error('Listing not found. Please upload photos first.')
      }
      
      // Update listing with status='live' - backend will validate all required fields
      const savedListing = await listingsApi.update(listingId, listingDataToSave)

      // Map API response to frontend format
      const publishedListing: Listing = {
        id: savedListing._id || savedListing.id,
        title: savedListing.title,
        city: savedListing.city,
        locality: savedListing.locality,
        societyName: savedListing.societyName,
        bhkType: savedListing.bhkType,
        roomType: savedListing.roomType,
        rent: savedListing.rent,
        deposit: savedListing.deposit,
        moveInDate: formatDateForInput(savedListing.moveInDate),
        furnishingLevel: savedListing.furnishingLevel,
        bathroomType: savedListing.bathroomType,
        flatAmenities: savedListing.flatAmenities,
        societyAmenities: savedListing.societyAmenities,
        preferredGender: savedListing.preferredGender,
        description: savedListing.description,
        photos: savedListing.photos,
        status: savedListing.status,
        createdAt: savedListing.createdAt,
        updatedAt: savedListing.updatedAt,
      }

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
    } catch (error: any) {
      console.error('Error creating listing:', error)
      
      // Parse backend validation errors
      const backendErrors = error.response?.data?.message || []
      const newErrors: Record<string, string> = {}
      
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((errMsg: string) => {
          // Map backend errors to step IDs
          if (errMsg.includes('photos') || errMsg.includes('At least 3 photos')) {
            newErrors.photos = 'Please add at least 3 photos'
          } else if (errMsg.includes('city')) {
            newErrors.location = 'City is required'
            newErrors.city = 'City is required'
          } else if (errMsg.includes('locality')) {
            newErrors.location = newErrors.location || 'Locality is required'
            newErrors.locality = 'Locality is required'
          } else if (errMsg.includes('bhkType')) {
            newErrors.details = 'BHK type is required'
            newErrors.bhkType = 'BHK type is required'
          } else if (errMsg.includes('roomType')) {
            newErrors.details = newErrors.details || 'Room type is required'
            newErrors.roomType = 'Room type is required'
          } else if (errMsg.includes('furnishingLevel')) {
            newErrors.details = newErrors.details || 'Furnishing level is required'
            newErrors.furnishingLevel = 'Furnishing level is required'
          } else if (errMsg.includes('rent')) {
            newErrors.pricing = 'Rent is required'
            newErrors.rent = 'Rent is required'
          } else if (errMsg.includes('deposit')) {
            newErrors.pricing = newErrors.pricing || 'Deposit is required'
            newErrors.deposit = 'Deposit is required'
          } else if (errMsg.includes('moveInDate')) {
            newErrors.pricing = newErrors.pricing || 'Move-in date is required'
            newErrors.moveInDate = 'Move-in date is required'
          } else if (errMsg.includes('preferredGender')) {
            newErrors.preferences = 'Gender preference is required'
            newErrors.preferredGender = 'Gender preference is required'
          }
        })
      } else {
        newErrors.general = typeof backendErrors === 'string' ? backendErrors : 'Failed to create listing. Please try again.'
      }
      
      setErrors(newErrors)
      setShowToast(true)
      
      // Expand the first section with errors
      const errorStep = STEPS.findIndex(step => newErrors[step.id])
      if (errorStep >= 0) {
        setExpandedSections(prev => {
          const newSet = new Set(prev)
          newSet.add(errorStep)
          return newSet
        })
        setTimeout(() => {
          document.getElementById(`section-${errorStep}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * Handles data changes from form inputs
   * ONLY updates local state - NO API calls
   * API calls happen ONLY when Continue button is clicked
   */
  const handleDataChange = async (updates: Partial<Listing>) => {
    const updated = { ...listingData, ...updates }
    listingDataRef.current = updated
    setListingData(updated)
    
    // If photos are being updated and we have >= 3 photos, create listing immediately
    if (updates.photos && updates.photos.length >= 3 && !currentListing?.id) {
      // Create listing with photos and draft status only
      try {
        setIsSaving(true)
        const draftData: CreateListingRequest = {
          title: generateTitle(),
          photos: updates.photos,
          status: 'draft',
        }
        
        const savedListing = await listingsApi.create(draftData)
        
        // Map API response to frontend format
        const mappedListing: Listing = {
          id: savedListing._id || savedListing.id,
          title: savedListing.title,
          city: savedListing.city || '',
          locality: savedListing.locality || '',
          societyName: savedListing.societyName,
          bhkType: savedListing.bhkType || '',
          roomType: savedListing.roomType || '',
          rent: savedListing.rent || 0,
          deposit: savedListing.deposit || 0,
          moveInDate: formatDateForInput(savedListing.moveInDate) || '',
          furnishingLevel: savedListing.furnishingLevel || '',
          bathroomType: savedListing.bathroomType,
          flatAmenities: savedListing.flatAmenities || [],
          societyAmenities: savedListing.societyAmenities || [],
          preferredGender: savedListing.preferredGender || '',
          description: savedListing.description,
          photos: savedListing.photos,
          status: savedListing.status,
          createdAt: savedListing.createdAt,
          updatedAt: savedListing.updatedAt,
        }
        
        // Update state with the created listing
        listingDataRef.current = { ...updated, ...mappedListing }
        setListingData({ ...updated, ...mappedListing })
        setCurrentListing(mappedListing)
        setValidatedSteps(prev => new Set(prev).add(0)) // Mark photos step as validated
        setLastSaved(new Date())
      } catch (error) {
        console.error('Error creating listing with photos:', error)
      } finally {
        setIsSaving(false)
      }
    }
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
                  {isEditing ? 'Update Listing' : 'Create Listing'}
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
            <h1 className="text-[1.375rem] font-bold text-gray-900 mb-0.5">
              {isEditing ? 'Edit Your Listing' : 'List Your Space'}
            </h1>
            <p className="text-[0.825rem] text-gray-600">
              {isEditing ? 'Update your listing details below' : 'Find your perfect flatmate in under 5 minutes'}
            </p>
          </div>

          {/* Edit Mode Banner */}
          {isEditing && currentListing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-[0.825rem] text-blue-800">
                  You're editing an existing listing. Changes will update the current listing without creating a duplicate.
                </p>
              </div>
            </div>
          )}

          {/* Resume Banner */}
          {currentListing && currentListing.status === 'draft' && !isEditing && (
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
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => saveDraft(true, true)}
                          disabled={isCreating || isSaving}
                          className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Draft
                        </button>
                        <button
                          onClick={() => handleSectionContinue(index)}
                          disabled={isCreating || isSaving}
                          className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-1.5">
                            {isCreating ? (isEditing ? 'Updating...' : 'Creating...') : isSaving ? 'Saving...' : index === STEPS.length - 1 ? (isEditing ? 'Update Listing' : 'Create Listing') : 'Continue'}
                            {!isCreating && !isSaving && index < STEPS.length - 1 && (
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
