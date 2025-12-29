import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'

const LandingPage = () => {
  const navigate = useNavigate()
  const { allListings, setAllListings } = useStore()
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    moveInDate: '',
    maxRent: ''
  })

  const searchCities = [
    'Mumbai', 'Bangalore', 'Pune', 'Delhi NCR', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 
    'Nagpur', 'Coimbatore', 'Kochi'
  ]

  // Initialize with mock listings if none exist
  useEffect(() => {
    if (allListings.length === 0) {
      const mockListings: Listing[] = [
        {
          id: '1',
          title: 'Private Room in 2BHK · Kothrud · ₹15,000',
          city: 'Pune',
          locality: 'Kothrud',
          societyName: 'Green Valley',
          bhkType: '2BHK',
          roomType: 'Private Room',
          rent: 15000,
          deposit: 30000,
          moveInDate: '2024-02-01',
          furnishingLevel: 'Furnished',
          flatAmenities: ['WiFi', 'AC', 'Geyser', 'Washing machine'],
          societyAmenities: ['Lift', 'Gym', 'Parking'],
          preferredGender: 'Any',
          foodPreference: 'No preference',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'Weekends only',
          photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Shared Room in 3BHK · Hinjewadi · ₹8,000',
          city: 'Pune',
          locality: 'Hinjewadi',
          bhkType: '3BHK',
          roomType: 'Shared Room',
          rent: 8000,
          deposit: 16000,
          moveInDate: '2024-01-15',
          furnishingLevel: 'Semi-furnished',
          flatAmenities: ['WiFi', 'Geyser'],
          societyAmenities: ['Lift', 'Parking'],
          preferredGender: 'Male',
          foodPreference: 'Veg only',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'No',
          photos: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Master Room in 2BHK · Viman Nagar · ₹18,000',
          city: 'Pune',
          locality: 'Viman Nagar',
          bhkType: '2BHK',
          roomType: 'Master Room',
          rent: 18000,
          deposit: 36000,
          moveInDate: '2024-02-10',
          furnishingLevel: 'Furnished',
          flatAmenities: ['WiFi', 'AC', 'Geyser', 'Washing machine', 'TV'],
          societyAmenities: ['Lift', 'Gym', 'Pool', 'Parking'],
          preferredGender: 'Any',
          foodPreference: 'Non-veg ok',
          smokingAllowed: 'Balcony only',
          drinkingAllowed: 'Occasionally',
          guestsAllowed: 'Yes',
          photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Private Room in 1BHK · Baner · ₹12,000',
          city: 'Pune',
          locality: 'Baner',
          bhkType: '1BHK',
          roomType: 'Private Room',
          rent: 12000,
          deposit: 24000,
          moveInDate: '2024-01-20',
          furnishingLevel: 'Unfurnished',
          flatAmenities: ['WiFi', 'Geyser'],
          societyAmenities: ['Lift'],
          preferredGender: 'Female',
          foodPreference: 'Veg only',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'No',
          photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Shared Room in 4BHK · Aundh · ₹7,000',
          city: 'Pune',
          locality: 'Aundh',
          bhkType: '4BHK',
          roomType: 'Shared Room',
          rent: 7000,
          deposit: 14000,
          moveInDate: '2024-01-25',
          furnishingLevel: 'Semi-furnished',
          flatAmenities: ['WiFi', 'AC', 'Washing machine'],
          societyAmenities: ['Lift', 'Gym', 'Parking'],
          preferredGender: 'Any',
          foodPreference: 'No preference',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'Weekends only',
          photos: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          title: 'Private Room in 3BHK · Wakad · ₹14,000',
          city: 'Pune',
          locality: 'Wakad',
          bhkType: '3BHK',
          roomType: 'Private Room',
          rent: 14000,
          deposit: 28000,
          moveInDate: '2024-02-05',
          furnishingLevel: 'Furnished',
          flatAmenities: ['WiFi', 'AC', 'Geyser', 'Washing machine', 'Fridge'],
          societyAmenities: ['Lift', 'Gym', 'Parking', 'CCTV'],
          preferredGender: 'Any',
          foodPreference: 'Non-veg ok',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'Yes',
          photos: ['https://images.unsplash.com/photo-1560448075-cbc16bb4af33?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '7',
          title: 'Master Room in 2BHK · Koregaon Park · ₹20,000',
          city: 'Pune',
          locality: 'Koregaon Park',
          bhkType: '2BHK',
          roomType: 'Master Room',
          rent: 20000,
          deposit: 40000,
          moveInDate: '2024-02-15',
          furnishingLevel: 'Luxury',
          flatAmenities: ['WiFi', 'AC', 'Geyser', 'Washing machine', 'TV', 'Microwave'],
          societyAmenities: ['Lift', 'Gym', 'Pool', 'Parking', 'Clubhouse'],
          preferredGender: 'Any',
          foodPreference: 'No preference',
          smokingAllowed: 'Balcony only',
          drinkingAllowed: 'Occasionally',
          guestsAllowed: 'Yes',
          photos: ['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '8',
          title: 'Private Room in 2BHK · Hadapsar · ₹11,000',
          city: 'Pune',
          locality: 'Hadapsar',
          bhkType: '2BHK',
          roomType: 'Private Room',
          rent: 11000,
          deposit: 22000,
          moveInDate: '2024-01-30',
          furnishingLevel: 'Semi-furnished',
          flatAmenities: ['WiFi', 'Geyser'],
          societyAmenities: ['Lift', 'Parking'],
          preferredGender: 'Any',
          foodPreference: 'Veg only',
          smokingAllowed: 'No',
          drinkingAllowed: 'No',
          guestsAllowed: 'No',
          photos: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe35?w=400'],
          status: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setAllListings(mockListings)
    }
  }, [allListings.length, setAllListings])

  const handleSearch = () => {
    // Navigate to browse page with filters (we'll create this later)
    const params = new URLSearchParams()
    if (searchFilters.city) params.set('city', searchFilters.city)
    if (searchFilters.moveInDate) params.set('date', searchFilters.moveInDate)
    if (searchFilters.maxRent) params.set('maxRent', searchFilters.maxRent)
    // For now, just navigate to auth
    navigate('/auth')
  }

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const stats = [
    { value: '2,500+', label: 'Live Listings', icon: '📈' },
    { value: '10,000+', label: 'Happy Users', icon: '👥' },
    { value: '100+', label: 'Cities', icon: '📍' },
    { value: '24hrs', label: 'Avg Response', icon: '⏰' }
  ]

  const cities = [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', listings: 245 },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400', listings: 189 },
    { name: 'Pune', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400', listings: 156 },
    { name: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', listings: 134 }
  ]

  const safetyFeatures = [
    {
      icon: '🛡️',
      title: 'ID Verified Profiles',
      description: 'All users go through a strict ID verification process for your safety and security.'
    },
    {
      icon: '✅',
      title: 'Verified Property Listings',
      description: 'We ensure every property listing is legitimate and verified by our team before going live.'
    },
    {
      icon: '👥',
      title: 'Trusted Community',
      description: 'Our users rate each other to build trust. See ratings and reviews before connecting.'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'Found my perfect flatmate within 3 days! The platform is so easy to use and everyone is verified.'
    },
    {
      name: 'Rahul Verma',
      role: 'Marketing Manager',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'No brokers, no hassle. Direct contact with the owner saved me so much time and money!'
    },
    {
      name: 'Ananya Das',
      role: 'Designer',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'The best roommate finding platform in India. Loved the safety features and verification process.'
    }
  ]

  const displayedListings = allListings.filter(l => l.status === 'live').slice(0, 8)

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Search - Full Width Background */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden">
              <div className="relative max-w-[1177px] mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Find Your Perfect <span className="text-mokogo-primary">Room & Roommate</span>
                  </h1>
                  <p className="text-gray-700 text-lg max-w-[773px] mx-auto">
                    Search from 1000+ verified listings across India. Direct contact with owners. Zero brokerage.
                  </p>
                </div>

                {/* Search Card */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/80">
                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="[&_button]:h-[52px] [&_button]:py-0">
                      <CustomSelect
                        label="City"
                        value={searchFilters.city}
                        onValueChange={(value) => setSearchFilters({ ...searchFilters, city: value })}
                        placeholder="Select your city"
                        options={searchCities.map(city => ({ value: city, label: city }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Move-in Date
                      </label>
                      <input
                        type="date"
                        value={searchFilters.moveInDate}
                        onChange={(e) => setSearchFilters({ ...searchFilters, moveInDate: e.target.value })}
                        className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Max Rent (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 20000"
                        value={searchFilters.maxRent}
                        onChange={(e) => setSearchFilters({ ...searchFilters, maxRent: e.target.value })}
                        className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2 opacity-0">
                        Search
                      </label>
                      <button
                        onClick={handleSearch}
                        className="w-full h-[52px] btn-primary flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <p className="text-sm text-gray-700">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-16 py-12 px-6 md:px-12">
          {/* Listings Grid */}
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">6,789+ Available Properties</h2>
              <button className="text-mokogo-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 block"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-mokogo-gray" />
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Handle save/favorite
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <span className="absolute top-3 left-3 px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md">
                      {listing.roomType === 'Private Room' ? 'Private' : listing.roomType === 'Master Room' ? 'Master' : 'Shared'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1 text-mokogo-primary shrink-0">
                        <svg className="w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{formatRent(listing.rent)}</p>
                        <p className="text-xs text-gray-600">per month</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          // Navigation handled by Link parent
                        }}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link to="/explore">
                <button className="btn-secondary">
                  Load More Listings
                </button>
              </Link>
            </div>
          </section>

          {/* Popular Areas */}
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Explore Properties</h2>
              <p className="text-gray-600">
                Explore the most sought-after locations for finding your perfect room
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  to={`/city/${encodeURIComponent(city.name)}`}
                  className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all border border-white/40 block"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm text-white/80">{city.listings}+ Properties</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Safety Section */}
          <section className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Your Safety Is Our Priority</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We understand finding a flatmate involves trust. That's why we've built multiple safety layers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {safetyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="text-center space-y-4 h-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-mokogo-primary/20 flex items-center justify-center mx-auto">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Success Stories */}
          <section className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
              <p className="text-gray-600">
                See what our happy users have to say about their experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl p-6"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden">
              <div className="relative max-w-[1177px] mx-auto">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Stay Updated!</h2>
                  <p className="text-gray-700">
                    Subscribe to get updates on new listings in your area and exclusive deals
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/90 backdrop-blur-sm border border-mokogo-gray"
                    />
                    <button className="px-6 py-3.5 rounded-xl bg-mokogo-primary text-white font-medium hover:bg-mokogo-primary-dark transition-colors shadow-md">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
