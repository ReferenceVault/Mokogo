import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { User, Mail, Phone, Calendar, Users, Briefcase, Building, MapPin, FileText, Cigarette, Wine, Utensils } from 'lucide-react'

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
    phone: userData?.phone || user?.phone || '',
    dateOfBirth: userData?.dateOfBirth || '',
    gender: userData?.gender || '',
    occupation: userData?.occupation || '',
    companyName: userData?.companyName || '',
    industry: userData?.industry || '',
    currentCity: userData?.currentCity || '',
    about: userData?.about || '',
    smoking: userData?.smoking || '',
    drinking: userData?.drinking || '',
    foodPreference: userData?.foodPreference || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required'
    if (!formData.currentCity.trim()) newErrors.currentCity = 'Current city is required'
    if (!formData.about.trim()) newErrors.about = 'About you is required'
    if (formData.about.length > 300) newErrors.about = 'About you must be 300 characters or less'
    if (!formData.smoking) newErrors.smoking = 'Smoking preference is required'
    if (!formData.drinking) newErrors.drinking = 'Drinking preference is required'
    if (!formData.foodPreference) newErrors.foodPreference = 'Food preference is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      // Update user in store
      const updatedUser = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim() || user?.name,
        phone: formData.phone,
        ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.occupation && { occupation: formData.occupation }),
        ...(formData.companyName && { companyName: formData.companyName }),
        ...(formData.industry && { industry: formData.industry }),
        ...(formData.currentCity && { currentCity: formData.currentCity }),
        ...(formData.about && { about: formData.about }),
        ...(formData.smoking && { smoking: formData.smoking }),
        ...(formData.drinking && { drinking: formData.drinking }),
        ...(formData.foodPreference && { foodPreference: formData.foodPreference })
      } as any
      setUser(updatedUser)
      // In a real app, you would save to backend here
      alert('Profile saved successfully!')
    }
  }

  const handleCancel = () => {
    // Reset form to original user data
    const nameParts = getUserName()
    setFormData({
      firstName: nameParts.first,
      lastName: nameParts.last,
      email: user?.email || '',
      phone: (user as any)?.phone || '',
      dateOfBirth: (user as any)?.dateOfBirth || '',
      gender: (user as any)?.gender || '',
      occupation: (user as any)?.occupation || '',
      companyName: (user as any)?.companyName || '',
      industry: (user as any)?.industry || '',
      currentCity: (user as any)?.currentCity || '',
      about: (user as any)?.about || '',
      smoking: (user as any)?.smoking || '',
      drinking: (user as any)?.drinking || '',
      foodPreference: (user as any)?.foodPreference || ''
    })
    setErrors({})
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
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-photo"
            />
            <label
              htmlFor="profile-photo"
              className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-2xl font-semibold cursor-pointer hover:opacity-90 transition-opacity relative group"
            >
              {formData.firstName[0]?.toUpperCase() || 'U'}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Upload</span>
              </div>
            </label>
          </div>
          <div>
            <p className="text-xs text-gray-500">Click on photo to upload</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max size 2MB</p>
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
                <option value="Prefer not to say">Prefer not to say</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Industry <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Technology, Finance, Healthcare"
            />
            {errors.industry && (
              <p className="text-xs text-red-500 mt-1">{errors.industry}</p>
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              About You <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              rows={5}
              maxLength={300}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${
                errors.about ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about yourself..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.about && (
                <p className="text-xs text-red-500">{errors.about}</p>
              )}
              <p className={`text-xs ml-auto ${formData.about.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.about.length}/300 characters
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
          className="px-6 py-2.5 bg-orange-400 text-white rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-400/30"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ProfileContent

