import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import RequestsContent from '@/components/RequestsContent'
import ListingDetailContent from '@/components/ListingDetailContent'
import MessagesContent from '@/components/MessagesContent'
import ProfileContent from '@/components/ProfileContent'
import { useStore } from '@/store/useStore'
import { 
  LayoutGrid, 
  Home, 
  MessageSquare, 
  Bookmark, 
  Calendar,
  MapPin,
  Eye,
  Heart,
  MessageCircle,
  CalendarCheck,
  Plus,
  Search,
  Pen,
  Settings,
  Users
} from 'lucide-react'

type ViewType = 'overview' | 'listings' | 'requests' | 'listing-detail' | 'messages' | 'profile'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, currentListing, setCurrentListing, setUser, allListings } = useStore()
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeView, setActiveView] = useState<ViewType>('overview')
  const [viewingListingId, setViewingListingId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check if we're viewing a listing from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const listingParam = urlParams.get('listing')
    if (listingParam) {
      setViewingListingId(listingParam)
      setActiveView('listing-detail')
      // Scroll to top when viewing a listing
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Scroll to top when activeView changes to listing-detail
  useEffect(() => {
    if (activeView === 'listing-detail' && viewingListingId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeView, viewingListingId])

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 flex flex-col">
      {/* Right Side Social Sidebar */}
      <SocialSidebar position="right" />
      
      {/* Dashboard Header */}
      <DashboardHeader
        activeView={activeView === 'overview' ? 'overview' : activeView === 'listings' ? 'listings' : 'overview'}
        onViewChange={(view) => {
          if (view === 'overview' || view === 'listings') {
            setActiveView(view as ViewType)
          }
        }}
        menuItems={[
          { label: 'Dashboard', view: 'overview' },
          { label: 'My Listings', view: 'listings' }
        ]}
        userName={userName}
        userEmail={user?.email || ''}
        userInitial={userInitial}
        onProfile={() => setActiveView('profile')}
        onLogout={handleLogout}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar
          title="Workspace"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          menuItems={[
            {
              id: 'overview',
              label: 'Overview',
              icon: LayoutGrid,
              onClick: () => setActiveView('overview')
            },
            {
              id: 'listings',
              label: 'My Listings',
              icon: Home,
              badge: activeListings.length > 0 ? activeListings.length : undefined,
              onClick: () => setActiveView('listings')
            },
            {
              id: 'messages',
              label: 'Conversations',
              icon: MessageSquare,
              badge: 12,
              onClick: () => setActiveView('messages')
            },
            {
              id: 'saved',
              label: 'Saved Properties',
              icon: Bookmark,
              onClick: () => {} // No action for saved properties yet
            },
            {
              id: 'requests',
              label: 'Requests',
              icon: Calendar,
              onClick: () => setActiveView('requests')
            }
          ]}
          quickFilters={[]}
          ctaSection={
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_55%)]" />
              <div className="relative flex items-start space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Post Your Listing</h4>
                  <p className="text-xs text-gray-600 mb-3">Find your perfect roommate in minutes</p>
                  <button 
                    onClick={handleCreateListing}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 group-hover:gap-2"
                  >
                    Get Started
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </>
          }
          collapsedCtaButton={{
            icon: Plus,
            onClick: handleCreateListing,
            title: 'Post Your Listing'
          }}
        />

        {/* Main Content */}
        <main className="flex-1 pr-11 lg:pr-14">
          {activeView === 'listing-detail' && viewingListingId ? (
            <ListingDetailContent 
              listingId={viewingListingId} 
              onBack={() => {
                setActiveView('listings')
                setViewingListingId(null)
              }}
            />
          ) : activeView === 'messages' ? (
            <MessagesContent />
          ) : activeView === 'profile' ? (
            <ProfileContent />
          ) : activeView === 'requests' ? (
            <RequestsContent />
          ) : activeView === 'overview' ? (
            <>
              {/* Hero Stats Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Welcome back, <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{userName}</span>
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your listings today</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: Eye, value: '2,847', label: 'Total Views', change: '+12.5%', changeColor: 'text-green-600' },
                      { icon: Heart, value: '342', label: 'Interested Users', change: '+8.2%', changeColor: 'text-green-600' },
                      { icon: MessageCircle, value: '89', label: 'New Messages', change: '+23.1%', changeColor: 'text-green-600' },
                      { icon: CalendarCheck, value: '5', label: 'Scheduled Requests', change: 'Today', changeColor: 'text-orange-500' }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
                            {stat.value}
                          </h3>
                          <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Active Listings Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Your Active Listings</h2>
                      <p className="text-sm text-gray-600">Manage and track your property listings</p>
                    </div>
                    <button 
                      onClick={handleCreateListing}
                      className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Listing
                    </button>
                  </div>
                  
                  {activeListings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {activeListings.slice(0, 3).map((listing, index) => (
                        <Link
                          key={listing.id}
                          to={`/dashboard?listing=${listing.id}`}
                          className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 block cursor-pointer group"
                          style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="h-48 overflow-hidden relative">
                            {listing.photos && listing.photos.length > 0 ? (
                              <img 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                src={listing.photos[0]} 
                                alt={listing.title} 
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50" />
                            )}
                            <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
                              Active
                            </div>
                            <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-900 border border-orange-200/50 shadow-sm flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              847 views
                            </div>
                          </div>
                          <div className="p-5 relative">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{listing.title}</h3>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                                  {listing.locality}, {listing.city}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Home className="w-4 h-4 mr-1.5 text-orange-500" /> {listing.bhkType}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-orange-200/50">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rent per month</p>
                                <p className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">₹{listing.rent?.toLocaleString()}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEditListing()
                                  }}
                                  className="w-9 h-9 rounded-lg border border-orange-200 bg-white text-gray-600 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                                >
                                  <Pen className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setViewingListingId(listing.id)
                                    setActiveView('listing-detail')
                                  }}
                                  className="w-9 h-9 rounded-lg border border-orange-200 bg-white text-gray-600 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
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
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-orange-200/50 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent" />
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Home className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No active listings</h3>
                        <p className="text-gray-600 mb-6">Create your first listing to get started</p>
                        <button 
                          onClick={handleCreateListing}
                          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Create Listing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Actions Section */}
              <section className="px-8 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Quick Actions</h2>
                    <p className="text-sm text-gray-600">Manage your MOKOGO account efficiently</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Plus, title: 'Post New Listing', description: 'Add a new property to attract roommates', onClick: handleCreateListing },
                      { icon: Search, title: 'Browse Listings', description: 'Discover available properties nearby', to: '/' },
                      { icon: Users, title: 'Find Roommates', description: 'Connect with potential roommates', onClick: () => {} },
                      { icon: Settings, title: 'Account Settings', description: 'Manage your profile and preferences', onClick: () => {} }
                    ].map((action, index) => {
                      const content = (
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-orange-200/50 text-left hover:shadow-xl hover:scale-105 transition-all duration-300 group shadow-lg cursor-pointer h-full flex flex-col">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex flex-col h-full">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1.5 text-sm group-hover:text-orange-600 transition-colors flex-shrink-0">{action.title}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed flex-grow">{action.description}</p>
                          </div>
                        </div>
                      )
                      
                      if (action.to) {
                        return <Link key={index} to={action.to} className="h-full">{content}</Link>
                      }
                      return (
                        <button key={index} onClick={action.onClick} className="h-full text-left">
                          {content}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* My Listings View - Current listings management */
            <section className="px-8 py-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Your listings
                </h1>

                {/* One Active Listing Rule Banner */}
                {currentListing && currentListing.status === 'live' && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-6 mb-6 shadow-2xl shadow-orange-500/30 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)]" />
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">You already have an active listing</h3>
                        <p className="text-sm text-white/90 leading-relaxed">
                          You can keep only one listing live at a time. Archive or delete your current listing to create a new one.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!currentListing ? (
                  /* State A - No listing yet */
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 text-center py-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent" />
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Plus className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        You don't have any listings yet.
                      </h2>
                      <p className="text-gray-600 mb-6">It takes less than 4 minutes.</p>
                      <button 
                        onClick={handleCreateListing} 
                        className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300 inline-block"
                      >
                        Create your first listing
                      </button>
                    </div>
                  </div>
                ) : currentListing.status === 'draft' ? (
                  /* State B - Draft listing */
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent" />
                    <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {currentListing.title || 'Draft listing'}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {currentListing.city && currentListing.locality && (
                            <span>{currentListing.city} · {currentListing.locality}</span>
                          )}
                          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
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
                      <button 
                        onClick={handleContinueDraft} 
                        className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Continue draft
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-semibold transition-all duration-300"
                      >
                        Delete draft
                      </button>
                    </div>
                    </div>
                  </div>
                ) : (
                  /* State C/D - Live/Archived listing */
                  <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white rounded-2xl shadow-xl border-2 border-orange-200/60 p-6 hover:shadow-2xl hover:border-orange-300 transition-all duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.08),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.05),transparent_60%)]" />
                    <div className="relative flex items-start gap-5">
                      {currentListing.photos && currentListing.photos.length > 0 && (
                        <div className="w-36 h-36 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-lg border-2 border-orange-200/50 group">
                          <img
                            src={currentListing.photos[0]}
                            alt="Listing"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link 
                              to={`/dashboard?listing=${currentListing.id}`}
                              className="block hover:text-orange-600 transition-colors group"
                            >
                              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {currentListing.title}
                              </h2>
                            </Link>
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="text-gray-700 font-medium flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                {currentListing.city} · {currentListing.locality}
                              </p>
                              <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                ₹{currentListing.rent?.toLocaleString()}/month
                              </span>
                              <span className="text-sm text-gray-600">
                                {currentListing.furnishingLevel}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {currentListing.boostEnabled && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-xs font-bold border border-yellow-300 shadow-lg">
                                ⚡ Boosted
                              </span>
                            )}
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                                currentListing.status === 'live'
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {currentListing.status.charAt(0).toUpperCase() + currentListing.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {currentListing.status === 'archived' && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                              ⚠️ This listing is not visible to seekers.
                            </p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2.5 mt-5">
                          {currentListing.status === 'live' ? (
                            <>
                              <button
                                onClick={() => {
                                  setViewingListingId(currentListing.id)
                                  setActiveView('listing-detail')
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View listing
                              </button>
                              <button 
                                onClick={handleEditListing} 
                                className="px-5 py-2.5 bg-white border-2 border-orange-300 text-orange-600 rounded-lg font-bold hover:bg-orange-50 hover:border-orange-400 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-md"
                              >
                                <Pen className="w-4 h-4" />
                                Edit listing
                              </button>
                              <button
                                onClick={() => setActiveView('requests')}
                                className="px-5 py-2.5 bg-white border-2 border-orange-300 text-orange-600 rounded-lg font-bold hover:bg-orange-50 hover:border-orange-400 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-md"
                              >
                                <MessageCircle className="w-4 h-4" />
                                View requests
                              </button>
                              <button
                                onClick={() => setShowBoostModal(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                              >
                                ⚡ Boost visibility
                              </button>
                              <button
                                onClick={() => setShowArchiveModal(true)}
                                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                              >
                                Archive listing
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setViewingListingId(currentListing.id)
                                  setActiveView('listing-detail')
                                }}
                                className="px-5 py-2.5 bg-white border-2 border-orange-300 text-orange-600 rounded-lg font-bold hover:bg-orange-50 hover:border-orange-400 transition-all duration-300"
                              >
                                View listing
                              </button>
                              <button
                                onClick={() => {
                                  const updated = { ...currentListing, status: 'live' as const }
                                  setCurrentListing(updated)
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                              >
                                Re-publish
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-all duration-300 border border-red-200 hover:border-red-300"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-orange-200/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-2xl" />
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Boost visibility</h3>
              <p className="text-gray-600 mb-6">
                Boost is coming soon. For now, we'll mark this listing as Boosted in your account.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleBoost} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowBoostModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-orange-200 text-gray-700 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-orange-200/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-2xl" />
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Archive listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to archive this listing? It will no longer be visible to seekers.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleArchive} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Archive
                </button>
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-orange-200 text-gray-700 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-red-200/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-transparent rounded-2xl" />
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete listing</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleDelete} 
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <Footer />
    </div>
  )
}

export default Dashboard
