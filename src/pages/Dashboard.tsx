import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'
import { 
  LayoutGrid, 
  Home, 
  MessageSquare, 
  Bookmark, 
  Calendar,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  CalendarCheck,
  Plus,
  Search,
  Bell,
  Heart as HeartIcon,
  Pen,
  MoreHorizontal,
  Settings,
  Users
} from 'lucide-react'

type ViewType = 'overview' | 'listings'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, currentListing, setCurrentListing, setUser, allListings } = useStore()
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeView, setActiveView] = useState<ViewType>('overview')

  const handleCreateListing = () => {
    if (currentListing && currentListing.status === 'live') {
      return
    }
    // Clear any draft listing to start fresh
    if (currentListing && currentListing.status === 'draft') {
      setCurrentListing(null)
      localStorage.removeItem('mokogo-listing')
    }
    // Navigate directly - user is already authenticated (they're on dashboard)
    navigate('/listing/wizard')
  }

  const handleContinueDraft = () => {
    navigate('/listing/wizard')
  }

  const handleEditListing = () => {
    navigate('/listing/wizard')
  }

  const handleArchive = () => {
    if (currentListing) {
      const updated = { ...currentListing, status: 'archived' as const }
      setCurrentListing(updated)
      setShowArchiveModal(false)
    }
  }

  const handleDelete = () => {
    if (currentListing) {
      setCurrentListing(null)
      localStorage.removeItem('mokogo-listing')
      setShowDeleteModal(false)
    }
  }

  const handleBoost = () => {
    if (currentListing) {
      const updated = { ...currentListing, boostEnabled: true }
      setCurrentListing(updated)
      setShowBoostModal(false)
    }
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mokogo-user')
    navigate('/')
  }

  const activeListings = allListings.filter(l => l.status === 'live')
  const userName = user?.name || 'User'
  const userInitial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Lister Dashboard Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Logo />
              
              <nav className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => setActiveView('overview')}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    activeView === 'overview'
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveView('listings')}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    activeView === 'listings'
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  My Listings
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
                  onClick={() => setActiveView('overview')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'overview'
                      ? 'text-white bg-orange-400'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 mr-3" />
                  <span>Overview</span>
                </button>
                <button 
                  onClick={() => setActiveView('listings')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === 'listings'
                      ? 'text-white bg-orange-400'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Home className="w-4 h-4 mr-3" />
                  <span>My Listings</span>
                  {activeListings.length > 0 && (
                    <span className="ml-auto text-xs bg-orange-400/20 text-orange-600 px-2 py-1 rounded-full">
                      {activeListings.length}
                    </span>
                  )}
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  <span>Conversations</span>
                  <span className="ml-auto text-xs bg-orange-400/20 text-orange-600 px-2 py-1 rounded-full">12</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <Bookmark className="w-4 h-4 mr-3" />
                  <span>Saved Properties</span>
                </button>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Viewings</span>
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Quick Filters</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <MapPin className="w-3 h-3 mr-3" />
                  <span>Near Me</span>
                </button>
                <button className="w-full flex items-center px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <DollarSign className="w-3 h-3 mr-3" />
                  <span>Budget Friendly</span>
                </button>
                <button className="w-full flex items-center px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <Star className="w-3 h-3 mr-3" />
                  <span>Top Rated</span>
                </button>
                <button className="w-full flex items-center px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200">
                  <Clock className="w-3 h-3 mr-3" />
                  <span>Recently Added</span>
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
                    onClick={handleCreateListing}
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
        <main className="flex-1">
          {activeView === 'overview' ? (
            <>
              {/* Hero Stats Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}</h1>
                    <p className="text-gray-500">Here's what's happening with your listings today</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600">+12.5%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">2,847</h3>
                      <p className="text-sm text-gray-500">Total Views</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600">+8.2%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">342</h3>
                      <p className="text-sm text-gray-500">Interested Users</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-green-600">+23.1%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">89</h3>
                      <p className="text-sm text-gray-500">New Messages</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                          <CalendarCheck className="w-6 h-6 text-orange-400" />
                        </div>
                        <span className="text-xs font-medium text-orange-400">Today</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
                      <p className="text-sm text-gray-500">Scheduled Viewings</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Active Listings Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Active Listings</h2>
                      <p className="text-sm text-gray-500">Manage and track your property listings</p>
                    </div>
                    <button 
                      onClick={handleCreateListing}
                      className="px-6 py-3 bg-orange-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      New Listing
                    </button>
                  </div>
                  
                  {activeListings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {activeListings.slice(0, 3).map((listing) => (
                        <Link
                          key={listing.id}
                          to={`/listings/${listing.id}`}
                          className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/35 overflow-hidden shadow-lg hover:shadow-xl transition-all block cursor-pointer"
                        >
                          <div className="h-48 overflow-hidden relative">
                            {listing.photos && listing.photos.length > 0 ? (
                              <img 
                                className="w-full h-full object-cover" 
                                src={listing.photos[0]} 
                                alt={listing.title} 
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                            <div className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                              Active
                            </div>
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/85 backdrop-blur-md rounded-full text-xs font-medium text-gray-900 border border-white/35">
                              <Eye className="w-3 h-3 inline mr-1" />
                              847 views
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {listing.locality}, {listing.city}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Home className="w-4 h-4 mr-1" /> {listing.bhkType}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rent per month</p>
                                <p className="text-xl font-bold text-gray-900">₹{listing.rent?.toLocaleString()}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEditListing()
                                  }}
                                  className="w-9 h-9 rounded-lg border border-stone-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all duration-200 flex items-center justify-center"
                                >
                                  <Pen className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    navigate(`/listings/${listing.id}`)
                                  }}
                                  className="w-9 h-9 rounded-lg border border-stone-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-all duration-200 flex items-center justify-center"
                                  title="View listing"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 text-center border border-white/35 shadow-lg">
                      <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No active listings</h3>
                      <p className="text-gray-500 mb-6">Create your first listing to get started</p>
                      <button 
                        onClick={handleCreateListing}
                        className="px-6 py-3 bg-orange-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create Listing
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Actions Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Quick Actions</h2>
                    <p className="text-sm text-gray-500">Manage your MOKOGO account efficiently</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button 
                      onClick={handleCreateListing}
                      className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 text-left hover:shadow-xl transition-all duration-200 group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors duration-200">
                        <Plus className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Post New Listing</h4>
                      <p className="text-sm text-gray-500">Add a new property to attract roommates</p>
                    </button>
                    
                    <Link 
                      to="/"
                      className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 text-left hover:shadow-xl transition-all duration-200 group shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors duration-200">
                        <Search className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Browse Listings</h4>
                      <p className="text-sm text-gray-500">Discover available properties nearby</p>
                    </Link>
                    
                    <button className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 text-left hover:shadow-xl transition-all duration-200 group shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors duration-200">
                        <Users className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Find Roommates</h4>
                      <p className="text-sm text-gray-500">Connect with potential roommates</p>
                    </button>
                    
                    <button className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/35 text-left hover:shadow-xl transition-all duration-200 group shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center mb-4 group-hover:bg-orange-400/20 transition-colors duration-200">
                        <Settings className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Account Settings</h4>
                      <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* My Listings View - Current listings management */
            <section className="px-8 py-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                  Your listings
                </h1>

                {/* One Active Listing Rule Banner */}
                {currentListing && currentListing.status === 'live' && (
                  <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-mokogo-info-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-mokogo-info-text mb-1">You already have an active listing</h3>
                        <p className="text-sm text-mokogo-info-text">
                          You can keep only one listing live at a time. Archive or delete your current listing to create a new one.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!currentListing ? (
                  /* State A - No listing yet */
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      You don't have any listings yet.
                    </h2>
                    <p className="text-gray-600 mb-6">It takes less than 4 minutes.</p>
                    <button onClick={handleCreateListing} className="btn-primary inline-block">
                      Create your first listing
                    </button>
                  </div>
                ) : currentListing.status === 'draft' ? (
                  /* State B - Draft listing */
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {currentListing.title || 'Draft listing'}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {currentListing.city && currentListing.locality && (
                            <span>{currentListing.city} · {currentListing.locality}</span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            Draft
                          </span>
                          {currentListing.updatedAt && (
                            <span>Last updated {formatLastUpdated(currentListing.updatedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      We saved your progress. You can finish your listing anytime.
                    </p>
                    <div className="flex gap-3">
                      <button onClick={handleContinueDraft} className="btn-primary">
                        Continue draft
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete draft
                      </button>
                    </div>
                  </div>
                ) : (
                  /* State C/D - Live/Archived listing */
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      {currentListing.photos && currentListing.photos.length > 0 && (
                        <div className="w-32 h-32 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src={currentListing.photos[0]}
                            alt="Listing"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Link 
                              to={`/listings/${currentListing.id}`}
                              className="block hover:text-orange-400 transition-colors"
                            >
                              <h2 className="text-xl font-semibold text-gray-900">
                                {currentListing.title}
                              </h2>
                            </Link>
                            <p className="text-gray-600 mt-1">
                              {currentListing.city} · {currentListing.locality}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentListing.boostEnabled && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                Boosted
                              </span>
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                currentListing.status === 'live'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {currentListing.status.charAt(0).toUpperCase() + currentListing.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {currentListing.status === 'archived' && (
                          <p className="text-sm text-gray-600 mb-4">
                            This listing is not visible to seekers.
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {currentListing.status === 'live' ? (
                            <>
                              <Link to={`/listings/${currentListing.id}`} className="btn-primary">
                                View listing
                              </Link>
                              <button onClick={handleEditListing} className="btn-secondary">
                                Edit listing
                              </button>
                              <Link to="/requests" className="btn-secondary">
                                View requests
                              </Link>
                              <button
                                onClick={() => setShowBoostModal(true)}
                                className="btn-secondary"
                              >
                                Boost visibility
                              </button>
                              <button
                                onClick={() => setShowArchiveModal(true)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                Archive listing
                              </button>
                            </>
                          ) : (
                            <>
                              <Link to={`/listings/${currentListing.id}`} className="btn-secondary">
                                View listing
                              </Link>
                              <button
                                onClick={() => {
                                  const updated = { ...currentListing, status: 'live' as const }
                                  setCurrentListing(updated)
                                }}
                                className="btn-primary"
                              >
                                Re-publish
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Delete listing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost visibility</h3>
            <p className="text-gray-600 mb-4">
              Boost is coming soon. For now, we'll mark this listing as Boosted in your account.
            </p>
            <div className="flex gap-3">
              <button onClick={handleBoost} className="btn-primary flex-1">
                Confirm
              </button>
              <button
                onClick={() => setShowBoostModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Archive listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to archive this listing? It will no longer be visible to seekers.
            </p>
            <div className="flex gap-3">
              <button onClick={handleArchive} className="btn-primary flex-1">
                Archive
              </button>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 flex-1">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      <Footer />
    </div>
  )
}

export default Dashboard
