import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin,
  Calendar,
  Briefcase,
  Cake,
  MessageSquare,
  ChevronRight,
  Copy,
  Plus,
  Send,
  Eye,
  X,
  Home
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import { formatRent, formatDateRelative } from '@/utils/formatters'

interface RequestsContentProps {
  initialTab?: 'received' | 'sent'
  onListingClick?: (listingId: string) => void
}

const RequestsContent = ({ initialTab = 'received', onListingClick }: RequestsContentProps) => {
  const navigate = useNavigate()
  const { user, allListings, requests, updateRequest } = useStore()
  const hasListings = allListings.length > 0
  // Default to 'sent' tab if user has no listings, otherwise use initialTab or 'received'
  const defaultTab = hasListings ? (initialTab || 'received') : 'sent'
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>(defaultTab)

  // Update active tab when initialTab prop changes or when listings change
  useEffect(() => {
    if (hasListings && initialTab) {
      setActiveTab(initialTab)
    } else if (!hasListings) {
      // If user has no listings, force to 'sent' tab
      setActiveTab('sent')
    }
  }, [initialTab, hasListings])

  // Use formatRent and formatDateRelative from utils/formatters

  // Get user's listing IDs
  const userListingIds = allListings.map(l => l.id)

  // Filter received requests (requests for user's listings)
  const receivedRequests = requests.filter(request => 
    userListingIds.includes(request.listingId)
  )

  // Filter sent requests (requests sent by current user)
  const sentRequests = requests.filter(request => 
    request.seekerId === user?.id
  )

  // Get listing details for a request
  const getListingForRequest = (listingId: string): Listing | undefined => {
    return allListings.find(l => l.id === listingId)
  }

  // Get status counts for received requests
  const receivedStats = {
    total: receivedRequests.length,
    pending: receivedRequests.filter(r => r.status === 'pending').length,
    accepted: receivedRequests.filter(r => r.status === 'accepted').length,
    rejected: receivedRequests.filter(r => r.status === 'rejected').length,
  }

  // Get status counts for sent requests
  const sentStats = {
    total: sentRequests.length,
    pending: sentRequests.filter(r => r.status === 'pending').length,
    accepted: sentRequests.filter(r => r.status === 'accepted').length,
    rejected: sentRequests.filter(r => r.status === 'rejected').length,
  }

  // Handle withdraw request
  const handleWithdraw = (requestId: string) => {
    if (window.confirm('Are you sure you want to withdraw this request?')) {
      updateRequest(requestId, { status: 'rejected' }) // Or create a 'withdrawn' status
    }
  }

  // Handle view listing
  const handleViewListing = (listingId: string) => {
    if (onListingClick) {
      // Navigate within dashboard
      onListingClick(listingId)
    } else {
      // Fallback: navigate to public listing page (shouldn't happen in dashboard context)
      navigate(`/listings/${listingId}`)
    }
  }

  // Handle message (if accepted)
  const handleMessage = (_listingId: string) => {
    // Navigate to messages with the lister
    navigate('/dashboard?view=messages')
  }

  // Mock data for received requests display (using Request type structure)
  const mockReceivedRequests = [
    {
      id: '1',
      listingId: '1',
      seekerId: 'seeker1',
      seekerName: 'Rahul Gupta',
      seekerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      seekerAge: 28,
      seekerOccupation: 'Software Engineer at TCS',
      seekerCity: 'Mumbai',
      introMessage: "Hi Priya! I'm relocating to Pune for a new job at TCS and your room in Baner looks perfect. I'm a clean, responsible tenant with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. My budget aligns perfectly with your asking price. Would love to schedule a virtual tour this weekend if possible. Looking forward to hearing from you!",
      status: 'pending' as const,
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      desiredMoveInDate: '2024-12-15',
      contactRevealed: false
    },
    {
      id: '2',
      listingId: '1',
      seekerId: 'seeker2',
      seekerName: 'Sneha Joshi',
      seekerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      seekerAge: 26,
      seekerOccupation: 'Marketing Manager at Wipro',
      seekerCity: 'Bangalore',
      introMessage: "Hello! I'm Sneha, moving to Pune for work. I'm particularly interested in your room as I value cleanliness and a peaceful environment. I work in marketing, have flexible hours, and am very respectful of shared spaces. I've been looking for a place with a female roommate preference. Can we arrange a video call to discuss further?",
      status: 'pending' as const,
      requestedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      desiredMoveInDate: '2025-01-01',
      contactRevealed: false
    }
  ]

  // Mock data for sent requests
  const mockSentRequests = [
    {
      id: '3',
      listingId: '2',
      seekerId: user?.id || 'current-user',
      seekerName: user?.name || 'You',
      introMessage: "Hi! I'm very interested in this room. I'm a working professional looking for a clean, quiet place. The location is perfect for my commute. Would love to schedule a visit!",
      status: 'pending' as const,
      requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      desiredMoveInDate: '2024-12-20',
      contactRevealed: false
    },
    {
      id: '4',
      listingId: '3',
      seekerId: user?.id || 'current-user',
      seekerName: user?.name || 'You',
      introMessage: "Hello! This room looks perfect for my needs. I'm a software engineer with flexible work hours. I maintain a clean lifestyle and respect shared spaces.",
      status: 'accepted' as const,
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      desiredMoveInDate: '2025-01-05',
      contactRevealed: true
    },
    {
      id: '5',
      listingId: '4',
      seekerId: user?.id || 'current-user',
      seekerName: user?.name || 'You',
      introMessage: "Hi, I'm interested in viewing this property. The amenities match what I'm looking for.",
      status: 'rejected' as const,
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      desiredMoveInDate: '2024-12-25',
      contactRevealed: false
    }
  ]

  // Use mock data if requests array is empty (for demo purposes)
  const displayReceivedRequests = receivedRequests.length > 0 ? receivedRequests : mockReceivedRequests
  const displaySentRequests = sentRequests.length > 0 ? sentRequests : mockSentRequests

  const responseTemplates = [
    {
      title: 'Acceptance Template',
      content: "Hi [Name]! Thank you for your interest in my room. Your profile looks great and I'd love to chat further. I've accepted your request - let's schedule a virtual tour this weekend. Looking forward to connecting!",
      icon: CheckCircle
    },
    {
      title: 'More Info Request',
      content: "Hi [Name]! Thanks for reaching out. I'd like to know more about your lifestyle preferences, work schedule, and any questions you have about the room. Could you share more details about yourself?",
      icon: MessageSquare
    },
    {
      title: 'Polite Rejection',
      content: "Hi [Name]! Thank you for your interest in my room listing. After reviewing all applications, I've decided to move forward with another candidate. I wish you the best in your room search!",
      icon: XCircle
    },
    {
      title: 'Schedule Visit',
      content: "Hi [Name]! Your profile looks promising. I'd like to arrange a visit to show you the room and discuss house rules. Are you available this weekend for a virtual or in-person tour?",
      icon: Calendar
    },
    {
      title: 'Room On Hold',
      content: "Hi [Name]! Thanks for your interest. The room is currently on hold pending another applicant's decision. I'll keep you updated and reach out if it becomes available again.",
      icon: Clock
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-8 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Requests
              </h1>
              <p className="text-sm text-gray-700">
                Manage your room requests - both sent and received
              </p>
            </div>

            {/* Tab Navigation - Only show Received tab if user has listings */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-orange-200/50 shadow-md">
              {hasListings && (
                <button
                  onClick={() => setActiveTab('received')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'received'
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Received ({receivedStats.total})
                </button>
              )}
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'sent'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Send className="w-4 h-4" />
                Sent ({sentStats.total})
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-3 lg:flex-nowrap">
            {activeTab === 'received' ? (
              <>
                {[
                  { value: receivedStats.total.toString(), label: 'Total', icon: MessageSquare, color: 'from-blue-400 to-blue-500' },
                  { value: receivedStats.pending.toString(), label: 'Pending', icon: Clock, color: 'from-yellow-400 to-yellow-500' },
                  { value: receivedStats.accepted.toString(), label: 'Accepted', icon: CheckCircle, color: 'from-green-400 to-green-500' },
                  { value: receivedStats.rejected.toString(), label: 'Rejected', icon: XCircle, color: 'from-red-400 to-red-500' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-200/50 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group flex-1 min-w-[100px]"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <stat.icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                          {stat.value}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { value: sentStats.total.toString(), label: 'Total Sent', icon: Send, color: 'from-blue-400 to-blue-500' },
                  { value: sentStats.pending.toString(), label: 'Pending', icon: Clock, color: 'from-yellow-400 to-yellow-500' },
                  { value: sentStats.accepted.toString(), label: 'Accepted', icon: CheckCircle, color: 'from-green-400 to-green-500' },
                  { value: sentStats.rejected.toString(), label: 'Rejected', icon: XCircle, color: 'from-red-400 to-red-500' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="relative bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-200/50 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group flex-1 min-w-[100px]"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <stat.icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                          {stat.value}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Requests Section */}
      <section className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'received' ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Received Requests</h2>
              
              <div className="space-y-4">
                {displayReceivedRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-md">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No received requests yet</p>
                    <p className="text-sm text-gray-500 mt-2">Requests from seekers will appear here</p>
                  </div>
                ) : (
                  displayReceivedRequests.map((request, index) => {
                    const listing = getListingForRequest(request.listingId)
                    return (
                      <div
                        key={request.id}
                        className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                              <img 
                                src={request.seekerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'} 
                                alt={request.seekerName} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h4 className="text-base font-semibold text-gray-900">{request.seekerName}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {request.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                                  {request.seekerOccupation && (
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                                      {request.seekerOccupation}
                                    </span>
                                  )}
                                  {request.seekerAge && (
                                    <span className="flex items-center gap-1">
                                      <Cake className="w-3.5 h-3.5 text-orange-500" />
                                      {request.seekerAge} years old
                                    </span>
                                  )}
                                  {request.seekerCity && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                      Currently in {request.seekerCity}
                                    </span>
                                  )}
                                  {request.desiredMoveInDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                      Move-in: {new Date(request.desiredMoveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>
                                  )}
                                </div>
                                {listing && (
                                  <div className="text-xs text-gray-500 mb-2">
                                    Interested in: <span className="font-semibold text-gray-700">{listing.title || `${listing.roomType} in ${listing.locality}`}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3 italic">"{request.introMessage}"</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-orange-500" />
                                Received {formatDateRelative(request.requestedAt)}
                              </span>
                            </div>
                            {request.status === 'pending' && (
                              <div className="flex flex-wrap gap-2 justify-end">
                                <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all duration-300 flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                                <button className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Accept
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Sent Requests</h2>
              
              <div className="space-y-4">
                {displaySentRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-md">
                    <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sent requests yet</p>
                    <p className="text-sm text-gray-500 mt-2">Requests you send to listings will appear here</p>
                  </div>
                ) : (
                  displaySentRequests.map((request, index) => {
                    const listing = getListingForRequest(request.listingId)
                    if (!listing) return null

                    return (
                      <div
                        key={request.id}
                        className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex flex-col md:flex-row gap-4">
                          {/* Listing Image */}
                          <div className="flex-shrink-0">
                            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border-2 border-orange-200">
                              <img 
                                src={listing.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'} 
                                alt={listing.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>

                          {/* Request Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {listing.title || `${listing.roomType} in ${listing.locality}`}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {request.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    {listing.locality}, {listing.city}
                                  </span>
                                  <span className="flex items-center gap-1 font-semibold text-gray-900">
                                    <Home className="w-4 h-4 text-orange-500" />
                                    {formatRent(listing.rent)}/month
                                  </span>
                                  {listing.status !== 'live' && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                      {listing.status === 'fulfilled' ? 'Filled' : 'Unavailable'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                                    Sent {formatDateRelative(request.requestedAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                                  "{request.introMessage}"
                                </p>
                                {request.desiredMoveInDate && (
                                  <div className="text-xs text-gray-600 mb-4">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                      Desired move-in: {new Date(request.desiredMoveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleViewListing(request.listingId)}
                                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all duration-300 flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Listing
                              </button>
                              {request.status === 'pending' && (
                                <button
                                  onClick={() => handleWithdraw(request.id)}
                                  className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-1.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Withdraw
                                </button>
                              )}
                              {request.status === 'accepted' && (
                                <button
                                  onClick={() => handleMessage(request.listingId)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Message
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Response Templates Section (only for received requests) */}
      {activeTab === 'received' && (
        <section className="px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Quick Response Templates</h2>
            <p className="text-sm text-gray-600 mb-4">Save time with pre-written responses for common scenarios</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {responseTemplates.map((template, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <template.icon className="w-4 h-4 text-white" />
                      </div>
                      <button className="p-1 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1.5 text-xs">{template.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{template.content}</p>
                    <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Use This Template <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-orange-300/50 p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center h-full min-h-[140px] text-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-xs">Create Custom</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Create your own template for specific scenarios or frequently asked questions. Save time with personalized responses.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default RequestsContent
