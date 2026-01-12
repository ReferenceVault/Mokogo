import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { requestsApi, RequestResponse } from '@/services/api'
import { websocketService } from '@/services/websocket'
import UserAvatar from './UserAvatar'

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

import { Listing } from '@/types'
import { formatRent, formatDateRelative } from '@/utils/formatters'

interface RequestsContentProps {
  initialTab?: 'received' | 'sent'
  onListingClick?: (listingId: string) => void
  onApprove?: (requestId: string, conversationId?: string) => void
}

const RequestsContent = ({
  initialTab = 'received',
  onListingClick,
  onApprove
}: RequestsContentProps) => {
  const navigate = useNavigate()
  const { user, allListings, requests, updateRequest } = useStore()

  const [allRequests, setAllRequests] = useState<RequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const hasListings = allListings.length > 0
  const defaultTab = hasListings ? initialTab : 'sent'
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>(defaultTab)

  useEffect(() => {
    if (hasListings && initialTab) {
      setActiveTab(initialTab)
    } else if (!hasListings) {
      setActiveTab('sent')
    }
  }, [initialTab, hasListings])

  useEffect(() => {
    fetchRequests()

    const token = localStorage.getItem('mokogo-access-token')
    if (token && user) {
      websocketService.connect(token)
    }

    const handleNewRequest = (newRequest: RequestResponse) => {
      setAllRequests(prev => {
        const exists = prev.some(
          r => (r._id || r.id) === (newRequest._id || newRequest.id)
        )
        if (exists) return prev

        const updated = [newRequest, ...prev]
        return updated.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1
          if (a.status !== 'pending' && b.status === 'pending') return 1
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          )
        })
      })
    }

    const handleRequestUpdate = (updatedRequest: RequestResponse) => {
      setAllRequests(prev => {
        const index = prev.findIndex(
          r => (r._id || r.id) === (updatedRequest._id || updatedRequest.id)
        )
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = updatedRequest
          return updated.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1
            if (a.status !== 'pending' && b.status === 'pending') return 1
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            )
          })
        }
        return prev
      })
    }

    websocketService.on('new_request', handleNewRequest)
    websocketService.on('request_updated', handleRequestUpdate)

    return () => {
      websocketService.off('new_request', handleNewRequest)
      websocketService.off('request_updated', handleRequestUpdate)
    }
  }, [user])

  const fetchRequests = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Fetch all requests (pending, approved, rejected)
      const requests = await requestsApi.getAllForOwner()
      // Sort: pending first, then by date
      const sorted = requests.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setAllRequests(sorted)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request: RequestResponse) => {
    if (!user) return
    
    setProcessingId(request._id || request.id)
    try {
      const updated = await requestsApi.update(request._id || request.id, { status: 'approved' })
      
      // Update the request in the list with new status
      setAllRequests(prev => prev.map(r => 
        (r._id || r.id) === (request._id || request.id) ? updated : r
      ))
      
      // If onApprove callback is provided, call it with conversation info
      if (onApprove) {
        // We need to get the conversation - it should be created by the backend
        // For now, we'll just navigate to messages
        onApprove(request._id || request.id)
      }
    } catch (error: any) {
      console.error('Error approving request:', error)
      alert(error.response?.data?.message || 'Failed to approve request. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (request: RequestResponse) => {
    if (!user) return
    
    if (!confirm('Are you sure you want to reject this request?')) {
      return
    }
    
    setProcessingId(request._id || request.id)
    try {
      const updated = await requestsApi.update(request._id || request.id, { status: 'rejected' })
      
      // Update the request in the list with new status
      setAllRequests(prev => prev.map(r => 
        (r._id || r.id) === (request._id || request.id) ? updated : r
      ))
    } catch (error: any) {
      console.error('Error rejecting request:', error)
      alert(error.response?.data?.message || 'Failed to reject request. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return formatDate(dateString)
  }

  const getRequesterInfo = (request: RequestResponse) => {
    const requester = typeof request.requesterId === 'object' ? request.requesterId : null
    return {
      id: requester?._id || (typeof request.requesterId === 'string' ? request.requesterId : ''),
      name: requester?.name || 'Unknown',
      email: requester?.email || '',
      profileImageUrl: requester ? (requester as any).profileImageUrl : undefined,
    }
  }


  const getListingInfo = (request: RequestResponse) => {
    const listing = typeof request.listingId === 'object' ? request.listingId : null
    return {
      id: listing?._id || (typeof request.listingId === 'string' ? request.listingId : ''),
      title: listing?.title || 'Unknown Listing',
      city: listing?.city || '',
      locality: listing?.locality || '',
      photos: listing?.photos || [],
    }
  }


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
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
      Received Requests
    </h2>

    <div className="space-y-4">
      {displayReceivedRequests.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-md">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No received requests yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Requests from seekers will appear here
          </p>
        </div>
      ) : (
        displayReceivedRequests.map((request, index) => {
          const listing = getListingForRequest(request.listingId)

          return (
            <div
              key={request.id}
              className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                    <img
                      src={
                        request.seekerAvatar ||
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                      }
                      alt={request.seekerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-base font-semibold text-gray-900">
                          {request.seekerName}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
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
                            Move-in:{' '}
                            {new Date(
                              request.desiredMoveInDate
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>

                      {listing && (
                        <div className="text-xs text-gray-500 mb-2">
                          Interested in:{' '}
                          <span className="font-semibold text-gray-700">
                            {listing.title ||
                              `${listing.roomType} in ${listing.locality}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-3 italic">
                    "{request.introMessage}"
                  </p>

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
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
      Requests
    </h2>

    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : allRequests.length === 0 ? (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No requests yet</p>
      </div>
    ) : (
      <div className="space-y-4">
        {allRequests.map((request, index) => {
          const requester = getRequesterInfo(request)
          const listing = getListingInfo(request)
          const isProcessing =
            processingId === (request._id || request.id)

          return (
            <div
              key={request._id || request.id}
              className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start gap-3">
                <UserAvatar user={requester} size="lg" />

                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                    {requester.name}
                  </h4>

                  <div className="text-xs text-gray-500 mb-2">
                    Interested in:{' '}
                    <span className="font-semibold">{listing.title}</span>
                  </div>

                  {request.message && (
                    <p className="text-sm text-gray-700 italic mb-3">
                      "{request.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    Received {formatTimeAgo(request.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </>
)}

                        </div>
                        {/* Only show action buttons for pending requests */}
                        {request.status === 'pending' && (
                          <div className="flex flex-wrap gap-2 justify-end">
                            <button 
                              onClick={() => handleReject(request)}
                              disabled={isProcessing || processingId === (request._id || request.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                            <button 
                              onClick={() => handleApprove(request)}
                              disabled={isProcessing || processingId === (request._id || request.id)}
                              className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing && processingId === (request._id || request.id) ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Accept
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {/* Show message for approved/rejected requests */}
                        {request.status === 'approved' && (
                          <div className="text-sm text-green-700 font-medium text-right">
                            ✓ Request approved - Conversation started
                          </div>
                        )}
                        {request.status === 'rejected' && (
                          <div className="text-sm text-red-700 font-medium text-right">
                            ✗ Request rejected
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Sent Requests
              </h2>

              <div className="space-y-4">
                {displaySentRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-md">
                    <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sent requests yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Requests you send to listings will appear here
                    </p>
                  </div>
                ) : (
                  displaySentRequests.map((request, index) => {
                    const listing = getListingForRequest(request.listingId)
                    if (!listing) return null

                    return (
                      <div
                        key={request.id}
                        className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 p-4 shadow-md hover:shadow-lg transition-all duration-300 group"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${
                            index * 0.1
                          }s both`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex flex-col md:flex-row gap-4">
                          {/* Listing Image */}
                          <div className="flex-shrink-0">
                            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border-2 border-orange-200">
                              <img
                                src={
                                  listing.photos?.[0] ||
                                  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
                                }
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
                                    {listing.title ||
                                      `${listing.roomType} in ${listing.locality}`}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      request.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : request.status === 'accepted'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
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
                                      {listing.status === 'fulfilled'
                                        ? 'Filled'
                                        : 'Unavailable'}
                                    </span>
                                  )}
                                </div>

                                <div className="text-xs text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                                    Sent{' '}
                                    {formatDateRelative(
                                      request.requestedAt
                                    )}
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                                  "{request.introMessage}"
                                </p>

                                {request.desiredMoveInDate && (
                                  <div className="text-xs text-gray-600 mb-4">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                      Desired move-in:{' '}
                                      {new Date(
                                        request.desiredMoveInDate
                                      ).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  handleViewListing(request.listingId)
                                }
                                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all duration-300 flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Listing
                              </button>

                              {request.status === 'pending' && (
                                <button
                                  onClick={() =>
                                    handleWithdraw(request.id)
                                  }
                                  className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-1.5"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Withdraw
                                </button>
                              )}

                              {request.status === 'accepted' && (
                                <button
                                  onClick={() =>
                                    handleMessage(request.listingId)
                                  }
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
