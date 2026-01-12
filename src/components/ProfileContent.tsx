import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { usersApi, uploadApi } from '@/services/api'
import { User, Mail, Phone, Calendar, Users, Briefcase, Building, MapPin, FileText, Cigarette, Wine, Utensils, HelpCircle, X, Clock, Plus, Copy, Heart } from 'lucide-react'

const ProfileContent = () => {
  const { user, setUser } = useStore()
  
  const getUserName = () => {
    if (!user?.name) return { first: '', last: '' }
    const parts = user.name.split(' ')
    return {
      first: parts[0] || '',
      last: parts.slice(1).join(' ') || ''
    }
  }

  const nameParts = getUserName()
  const userData = user as any
  
  const [formData, setFormData] = useState({
    firstName: nameParts.first,
    lastName: nameParts.last,
    email: user?.email || '',
    phone: userData?.phoneNumber || userData?.phone || '',
    dateOfBirth: userData?.dateOfBirth || '',
    gender: userData?.gender || '',
    occupation: userData?.occupation || '',
    companyName: userData?.companyName || '',
    currentCity: userData?.currentCity || '',
    area: userData?.area || '',
    about: userData?.about || '',
    smoking: userData?.smoking || '',
    drinking: userData?.drinking || '',
    foodPreference: userData?.foodPreference || ''
  })

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(userData?.profileImageUrl || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      
      setLoading(true)
      try {
        const profile = await usersApi.getMyProfile()
        
        // Parse name
        const nameParts = profile.name ? profile.name.split(' ') : ['', '']
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        // Format date of birth if exists
        let dateOfBirth = ''
        if (profile.dateOfBirth) {
          const date = new Date(profile.dateOfBirth)
          dateOfBirth = date.toISOString().split('T')[0]
        }
        
        setFormData({
          firstName,
          lastName,
          email: profile.email || '',
          phone: profile.phoneNumber || '',
          dateOfBirth,
          gender: profile.gender || '',
          occupation: profile.occupation || '',
          companyName: profile.companyName || '',
          currentCity: profile.currentCity || '',
          area: profile.area || '',
          about: profile.about || '',
          smoking: profile.smoking || '',
          drinking: profile.drinking || '',
          foodPreference: profile.foodPreference || ''
        })
        
        if (profile.profileImageUrl) {
          setProfileImageUrl(profile.profileImageUrl)
        }
        
        // Update user in store
        setUser({ ...user, ...profile } as any)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('Image size must be less than 2MB')
      return
    }

    setUploadingImage(true)
    try {
      const url = await uploadApi.uploadProfileImage(file)
      setProfileImageUrl(url)
      
      // Save image URL to profile immediately
      await usersApi.updateMyProfile({ profileImageUrl: url })
      
      // Update user in store
      setUser({ ...user, profileImageUrl: url } as any)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert(error.response?.data?.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required'
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.currentCity.trim()) newErrors.currentCity = 'Current city is required'
    if (!formData.area.trim()) newErrors.area = 'Area is required'
    if (!formData.about.trim()) newErrors.about = 'About you is required'
    if (formData.about.length > 500) newErrors.about = 'About you must be 500 characters or less'
    if (!formData.smoking) newErrors.smoking = 'Smoking preference is required'
    if (!formData.drinking) newErrors.drinking = 'Drinking preference is required'
    if (!formData.foodPreference) newErrors.foodPreference = 'Food preference is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setSaving(true)
    try {
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        occupation: formData.occupation,
        companyName: formData.companyName,
        currentCity: formData.currentCity,
        area: formData.area,
        about: formData.about,
        smoking: formData.smoking,
        drinking: formData.drinking,
        foodPreference: formData.foodPreference,
        ...(profileImageUrl && { profileImageUrl }),
      }

      const updatedProfile = await usersApi.updateMyProfile(updateData)
      
      // Update user in store
      setUser({ ...user, ...updatedProfile } as any)
      
      alert('Profile saved successfully!')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      alert(error.response?.data?.message || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    // Reset form by fetching profile again
    if (!user?.id) return
    
    setLoading(true)
    try {
      const profile = await usersApi.getMyProfile()
      
      const nameParts = profile.name ? profile.name.split(' ') : ['', '']
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      let dateOfBirth = ''
      if (profile.dateOfBirth) {
        const date = new Date(profile.dateOfBirth)
        dateOfBirth = date.toISOString().split('T')[0]
      }
      
      setFormData({
        firstName,
        lastName,
        email: profile.email || '',
        phone: profile.phoneNumber || '',
        dateOfBirth,
        gender: profile.gender || '',
        occupation: profile.occupation || '',
        companyName: profile.companyName || '',
        currentCity: profile.currentCity || '',
        area: profile.area || '',
        about: profile.about || '',
        smoking: profile.smoking || '',
        drinking: profile.drinking || '',
        foodPreference: profile.foodPreference || ''
      })
      
      if (profile.profileImageUrl) {
        setProfileImageUrl(profile.profileImageUrl)
      } else {
        setProfileImageUrl(null)
      }
      
      setErrors({})
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowTemplateModal(false)
      }
    }

    if (showTemplateModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTemplateModal])

  // Template options for About section
  const aboutTemplates = [
    {
      id: 'professional',
      title: 'Professional Background',
      icon: Briefcase,
      content: "I'm a software engineer working at TCS with 5 years of experience in the tech industry. I'm a clean, responsible person with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. I maintain a regular work schedule and value cleanliness and organization in shared spaces."
    },
    {
      id: 'lifestyle',
      title: 'Clean & Quiet Lifestyle',
      icon: Calendar,
      content: "I'm a marketing professional who values cleanliness and a peaceful environment. I have flexible work hours and am very respectful of shared spaces. I maintain a clean, quiet lifestyle and prefer organized living. I'm looking for a roommate who shares similar values of respect and cleanliness."
    },
    {
      id: 'tech-worker',
      title: 'Tech Professional',
      icon: Briefcase,
      content: "I work in the tech industry and maintain a clean, quiet lifestyle. I'm organized, responsible, and prefer a peaceful living environment. I respect shared spaces and believe in open communication with roommates. I enjoy a balanced lifestyle with time for both work and personal interests."
    },
    {
      id: 'creative',
      title: 'Creative Professional',
      icon: Heart,
      content: "I'm a UI/UX designer who loves creativity and tidy living spaces. I'm respectful, enjoy cooking, and maintain a clean environment. I value friendly interactions and mutual respect with roommates. I prefer a calm, organized home where I can focus on my work and hobbies."
    },
    {
      id: 'working-professional',
      title: 'Working Professional',
      icon: Clock,
      content: "I'm a working professional with a steady income and reliable employment. I'm ready to move in and can provide all necessary documents. I maintain a professional lifestyle, respect house rules, and value cleanliness. I'm looking for a comfortable living space with a responsible roommate."
    }
  ]

  const handleUseTemplate = (template: string) => {
    handleChange('about', template)
    setShowTemplateModal(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Profile Photo */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-photo"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            <label
              htmlFor="profile-photo"
              className={`w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-2xl font-semibold cursor-pointer hover:opacity-90 transition-opacity relative group overflow-hidden ${
                uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                formData.firstName[0]?.toUpperCase() || 'U'
              )}
              {uploadingImage ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
                </div>
              )}
            </label>
          </div>
          <div>
            <p className="text-xs text-gray-500">Click on photo to upload</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max size 2MB</p>
            {uploadingImage && (
              <p className="text-xs text-orange-500 mt-1">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Occupation / Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.occupation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
            {errors.occupation && (
              <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your company name"
            />
            {errors.companyName && (
              <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>

        </div>
      </section>

      {/* Location Information */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Current City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentCity}
              onChange={(e) => handleChange('currentCity', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.currentCity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your current city"
            />
            {errors.currentCity && (
              <p className="text-xs text-red-500 mt-1">{errors.currentCity}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.area ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your area/locality"
            />
            {errors.area && (
              <p className="text-xs text-red-500 mt-1">{errors.area}</p>
            )}
          </div>
        </div>
      </section>

      {/* About You */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">About You</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1.5">
              <span>About You <span className="text-red-500">*</span></span>
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="text-xs text-orange-500 hover:text-orange-600 hover:underline transition-colors font-normal"
              >
                Choose from pre-written templates
              </button>
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              rows={5}
              maxLength={500}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${
                errors.about ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about yourself..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.about && (
                <p className="text-xs text-red-500">{errors.about}</p>
              )}
              <p className={`text-xs ml-auto ${formData.about.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.about.length}/500 characters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Preferences */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Lifestyle Preferences</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Cigarette className="w-4 h-4 text-gray-400" />
              Smoking <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.smoking}
              onChange={(e) => handleChange('smoking', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.smoking ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select preference</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            {errors.smoking && (
              <p className="text-xs text-red-500 mt-1">{errors.smoking}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Wine className="w-4 h-4 text-gray-400" />
              Drinking <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.drinking}
              onChange={(e) => handleChange('drinking', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.drinking ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select preference</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            {errors.drinking && (
              <p className="text-xs text-red-500 mt-1">{errors.drinking}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-gray-400" />
              Food Preference <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.foodPreference}
              onChange={(e) => handleChange('foodPreference', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.foodPreference ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select preference</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-vegetarian">Non-vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
            </select>
            {errors.foodPreference && (
              <p className="text-xs text-red-500 mt-1">{errors.foodPreference}</p>
            )}
          </div>
        </div>
      </section>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">About You Templates</h3>
                <p className="text-sm text-gray-600 mt-1">Save time with pre-written templates for common scenarios</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutTemplates.map((template) => {
                  const IconComponent = template.icon
                  return (
                    <div
                      key={template.id}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-orange-400 hover:shadow-md transition-all relative group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{template.title}</h4>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(template.content)
                            // You can add a toast notification here
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-orange-600"
                          title="Copy template"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                        {template.content}
                      </p>
                      <button
                        onClick={() => handleUseTemplate(template.content)}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 group/btn"
                      >
                        Use This Template
                        <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </button>
                    </div>
                  )
                })}
                
                {/* Create Custom Template Card */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-5 hover:border-orange-400 hover:bg-orange-50/50 transition-all flex flex-col items-center justify-center text-center min-h-[200px] cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create Custom</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Write your own personalized "About You" section. Be authentic and share what makes you unique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-orange-400 text-white rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}

export default ProfileContent

