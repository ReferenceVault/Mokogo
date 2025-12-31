import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter, 
  ArrowUpDown,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Cake,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  MoreVertical,
  Play,
  Handshake,
  TrendingUp,
  Users,
  Shield,
  FileText,
  BarChart3,
  ChevronRight,
  Copy,
  Plus
} from 'lucide-react'

const RequestsList = () => {
  const [filter, setFilter] = useState<'all' | 'priority' | 'recent' | 'responded'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'match' | 'oldest'>('recent')
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  // Mock data for requests
  const priorityRequests = [
    {
      id: '1',
      name: 'Rahul Gupta',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: true,
      badges: ['Premium Member', '95% Match'],
      occupation: 'Software Engineer at TCS',
      age: 28,
      location: 'Currently in Mumbai',
      moveInDate: 'Dec 15',
      message: "Hi Priya! I'm relocating to Pune for a new job at TCS and your room in Baner looks perfect. I'm a clean, responsible tenant with excellent references. I don't smoke, rarely have guests, and prefer a quiet environment for work. My budget aligns perfectly with your asking price. Would love to schedule a virtual tour this weekend if possible. Looking forward to hearing from you!",
      receivedTime: '2 hours ago',
      profileViews: 15,
      positiveReviews: 5,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Sneha Joshi',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      verified: true,
      badges: ['Female', '92% Match'],
      occupation: 'Marketing Manager at Wipro',
      age: 26,
      location: 'Currently in Bangalore',
      moveInDate: 'Jan 1',
      message: "Hello! I'm Sneha, moving to Pune for work. I'm particularly interested in your room as I value cleanliness and a peaceful environment. I work in marketing, have flexible hours, and am very respectful of shared spaces. I've been looking for a place with a female roommate preference. Can we arrange a video call to discuss further?",
      receivedTime: '4 hours ago',
      profileViews: 8,
      positiveReviews: 4,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    }
  ]

  const recentRequests = [
    {
      id: '3',
      name: 'Amit Patel',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Male', '78% Match'],
      occupation: 'Product Manager',
      age: 30,
      location: 'Currently in Pune',
      moveInDate: 'ASAP',
      message: "Hi! I'm looking for a room in Baner area. I work in tech and maintain a clean, quiet lifestyle. Your listing caught my attention due to the great location and amenities. Would love to know more about the house rules and schedule a visit.",
      receivedTime: '6 hours ago',
      profileViews: 3,
      positiveReviews: 0,
      interestedIn: 'Modern Room in Hinjawadi',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Kavya Singh',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Female', '85% Match'],
      occupation: 'UI/UX Designer',
      age: 24,
      location: 'Currently in Delhi',
      moveInDate: 'Dec 20',
      message: "Hello Priya! I'm a designer moving to Pune for a new opportunity. I love your room setup and the location seems perfect for my commute. I'm tidy, respectful, and enjoy cooking. Looking for a friendly environment. Can we connect?",
      receivedTime: '8 hours ago',
      profileViews: 5,
      positiveReviews: 0,
      interestedIn: 'Spacious Room in Baner',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Vikram Reddy',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      verified: false,
      badges: ['Male', 'Quick Move'],
      occupation: 'Business Analyst',
      age: 27,
      location: 'Currently in Hyderabad',
      moveInDate: 'This Week',
      message: "Hi! I need to move to Pune urgently for work. Your room seems ideal and I'm ready to move in immediately. I'm a working professional with steady income and can provide all necessary documents. Please let me know if we can fast-track this.",
      receivedTime: '12 hours ago',
      profileViews: 0,
      positiveReviews: 0,
      interestedIn: 'Modern Room in Hinjawadi',
      status: 'urgent',
      urgent: true
    }
  ]

  const previouslyResponded = [
    {
      id: '6',
      name: 'Arjun Mehta',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      status: 'accepted',
      occupation: 'Student',
      age: 22,
      location: 'Moving from Mumbai',
      chatActive: true,
      lastMessage: '2 hours ago',
      room: 'Budget Room in Karve Nagar',
      respondedAt: '2 days ago'
    },
    {
      id: '7',
      name: 'Ravi Kumar',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      status: 'rejected',
      occupation: 'Software Developer',
      age: 29,
      location: 'Budget mismatch',
      reason: "Budget requirements didn't align",
      room: 'Spacious Room in Baner',
      respondedAt: '1 week ago'
    }
  ]

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

  const safetyGuidelines = [
    {
      title: 'Verify Identity',
      description: 'Always verify seekers\' identity through video calls before in-person meetings.',
      icon: Shield
    },
    {
      title: 'Meet in Groups',
      description: 'Conduct initial meetings in public places or with a friend present.',
      icon: Users
    },
    {
      title: 'Check References',
      description: 'Request and verify employment details, previous landlord references.',
      icon: FileText
    },
    {
      title: 'Trust Your Instincts',
      description: 'If something feels off, don\'t hesitate to decline or ask for more information.',
      icon: CheckCircle
    }
  ]

  const toggleSelectRequest = (id: string) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    const allIds = [...priorityRequests, ...recentRequests].map(r => r.id)
    setSelectedRequests(allIds)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 flex flex-col">
      <Header />
      
      {/* Right Side Social Sidebar */}
      <SocialSidebar position="right" />

      <main className="flex-1 pr-11 lg:pr-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-11 pb-12 sm:pt-12 sm:pb-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                Contact Requests
              </h1>
              <p className="text-lg text-gray-700">
                Manage inquiries for your room listings and connect with potential roommates
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: '12', label: 'New Requests', icon: MessageSquare, color: 'from-blue-400 to-blue-500' },
                { value: '8', label: 'Accepted', icon: CheckCircle, color: 'from-green-400 to-green-500' },
                { value: '3', label: 'Pending', icon: Clock, color: 'from-yellow-400 to-yellow-500' },
                { value: '5', label: 'Rejected', icon: XCircle, color: 'from-red-400 to-red-500' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedRequests.length === [...priorityRequests, ...recentRequests].length && selectedRequests.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4 text-orange-500 border-orange-300 rounded focus:ring-orange-400"
                />
                <span className="text-sm font-medium text-gray-700">Select All</span>
              </div>
              {selectedRequests.length > 0 && (
                <>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Accept Selected
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject Selected
                  </button>
                </>
              )}
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="all">All Requests</option>
                    <option value="priority">Priority</option>
                    <option value="recent">Recent</option>
                    <option value="responded">Responded</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-orange-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="match">Highest Match</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Listings Section */}
        <section className="px-6 md:px-[10%] py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Your Active Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { title: 'Spacious Room in Baner', status: 'Active', rent: '₹12,000/month', details: '1 Bed • Female Preferred', requests: '8 new requests', color: 'green' },
                { title: 'Modern Room in Hinjawadi', status: 'Active', rent: '₹15,000/month', details: '1 Bed • Any Gender', requests: '3 new requests', color: 'green' },
                { title: 'Cozy Room in Wakad', status: 'Paused', rent: '₹9,500/month', details: 'Shared Bath • Male Preferred', requests: '1 pending request', color: 'yellow' }
              ].map((listing, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{listing.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        listing.color === 'green' 
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
                          : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{listing.rent} • {listing.details}</p>
                    <p className={`text-sm font-semibold mb-4 ${
                      listing.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {listing.requests}
                    </p>
                    <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                      {listing.status === 'Paused' ? (
                        <>
                          Reactivate <Play className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Details <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Priority Requests Section */}
        <section className="px-6 md:px-[10%] py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Priority Requests</h2>
              <p className="text-sm text-gray-600">Verified users and high-match profiles</p>
            </div>

            <div className="space-y-6">
              {priorityRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => toggleSelectRequest(request.id)}
                          className="absolute -top-2 -left-2 w-5 h-5 text-orange-500 border-orange-300 rounded focus:ring-orange-400 z-10"
                        />
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200">
                          <img src={request.profileImage} alt={request.name} className="w-full h-full object-cover" />
                          <div className="absolute top-0 right-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">Seeker</h3>
                              <h4 className="text-lg font-bold text-gray-900">{request.name}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {request.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                              {request.badges.map((badge, i) => (
                                <span key={i} className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  badge.includes('Premium') 
                                    ? 'bg-blue-100 text-blue-700'
                                    : badge.includes('Match')
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-pink-100 text-pink-700'
                                }`}>
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-orange-500" />
                                {request.occupation}
                              </span>
                              <span className="flex items-center gap-1">
                                <Cake className="w-4 h-4 text-orange-500" />
                                {request.age} years old
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                {request.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                Move-in: {request.moveInDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                              <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">"{request.message}"</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            Received {request.receivedTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-orange-500" />
                            Profile viewed {request.profileViews} times
                          </span>
                          {request.positiveReviews > 0 && (
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 text-green-500" />
                              {request.positiveReviews} positive reviews
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <span className="text-xs text-gray-600 mb-2 block">Interested in:</span>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {request.interestedIn}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all duration-300 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-300 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message First
                          </button>
                          <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Accept & Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Requests Section */}
        <section className="px-6 md:px-[10%] py-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Requests</h2>
              <p className="text-sm text-gray-600">10 new requests in the last 24 hours</p>
            </div>

            <div className="space-y-4">
              {recentRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => toggleSelectRequest(request.id)}
                        className="absolute -top-2 -left-2 w-5 h-5 text-orange-500 border-orange-300 rounded focus:ring-orange-400 z-10"
                      />
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-200">
                        <img src={request.profileImage} alt={request.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Seeker</h3>
                            <h4 className="text-base font-semibold text-gray-900">{request.name}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {request.badges.map((badge, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                badge.includes('Match')
                                  ? 'bg-green-100 text-green-700'
                                  : badge.includes('Quick')
                                  ? 'bg-orange-100 text-orange-700'
                                  : badge === 'Male'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-pink-100 text-pink-700'
                              }`}>
                                {badge}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                              {request.occupation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Cake className="w-3.5 h-3.5 text-orange-500" />
                              {request.age} years old
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" />
                              {request.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-orange-500" />
                              Move-in: {request.moveInDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3 italic">"{request.message}"</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          Received {request.receivedTime}
                        </span>
                        {request.profileViews > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-orange-500" />
                            Profile viewed {request.profileViews} times
                          </span>
                        )}
                        {request.urgent && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            Urgent request
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-xs text-gray-600 mb-1 block">Interested in:</span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {request.interestedIn}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all duration-300 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-semibold hover:bg-yellow-100 transition-all duration-300 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Message
                        </button>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Previously Responded Section */}
        <section className="px-6 md:px-[10%] py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Previously Responded</h2>
              <Link to="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                View All History <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {previouslyResponded.map((request, index) => (
                <div
                  key={request.id}
                  className={`relative overflow-hidden rounded-xl border p-5 shadow-lg ${
                    request.status === 'accepted'
                      ? 'bg-green-50/50 border-green-200/50'
                      : 'bg-red-50/50 border-red-200/50'
                  }`}
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className={`absolute inset-0 ${
                    request.status === 'accepted'
                      ? 'bg-gradient-to-br from-green-50/50 via-transparent to-transparent'
                      : 'bg-gradient-to-br from-red-50/50 via-transparent to-transparent'
                  }`} />
                  <div className="relative flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-200">
                        <img src={request.profileImage} alt={request.name} className="w-full h-full object-cover" />
                      </div>
                      {request.status === 'accepted' ? (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <XCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-600">Seeker</h3>
                            <h4 className="text-base font-semibold text-gray-900">{request.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {request.occupation} • {request.age} years old • {request.location}
                          </p>
                          {request.status === 'accepted' ? (
                            <p className="text-sm text-green-700 flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              Chat active • Last message {request.lastMessage}
                            </p>
                          ) : (
                            <p className="text-sm text-red-700">
                              Reason: {request.reason}
                            </p>
                          )}
                        </div>
                        {request.status === 'accepted' ? (
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-all duration-300 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Open Chat
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                              <Handshake className="w-4 h-4" />
                              Finalize Deal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <XCircle className="w-5 h-5" />
                            <span className="text-sm">Rejected</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-xs text-gray-600">Room:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                            request.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {request.room}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {request.status === 'accepted' ? 'Accepted' : 'Rejected'} {request.respondedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300">
                  Load More Requests
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Matching Insights Section */}
        <section className="px-6 md:px-[10%] py-8 bg-gradient-to-br from-orange-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Smart Matching Insights</h2>
            <p className="text-gray-600 mb-8">AI-powered recommendations to help you make better decisions</p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: 'Match Score Insights',
                  description: 'Profiles with 85%+ match scores are 3x more likely to result in successful roommate relationships.',
                  tip: 'Tip: Prioritize verified users with high match scores',
                  icon: TrendingUp,
                  color: 'from-purple-400 to-purple-500'
                },
                {
                  title: 'Response Time Impact',
                  description: 'Responding within 24 hours increases acceptance rates by 67% and shows professionalism.',
                  tip: 'You have 12 requests pending response',
                  icon: Clock,
                  color: 'from-blue-400 to-blue-500'
                },
                {
                  title: 'Profile Completeness',
                  description: 'Seekers with complete profiles (photo, occupation, references) are more serious candidates.',
                  tip: '8 out of 12 requests have complete profiles',
                  icon: Users,
                  color: 'from-green-400 to-green-500'
                }
              ].map((insight, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <insight.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{insight.description}</p>
                    <p className="text-xs font-semibold text-orange-600">{insight.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Response Templates Section */}
        <section className="px-6 md:px-[10%] py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Quick Response Templates</h2>
            <p className="text-gray-600 mb-8">Save time with pre-written responses for common scenarios</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {responseTemplates.map((template, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <template.icon className="w-5 h-5 text-white" />
                      </div>
                      <button className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{template.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{template.content}</p>
                    <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Use This Template <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-orange-300/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center justify-center h-full min-h-[180px] text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Create Custom</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">Create your own template for specific scenarios or frequently asked questions. Save time with personalized responses.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Guidelines Section */}
        <section className="px-6 md:px-[10%] py-8 bg-gradient-to-br from-orange-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Safety Guidelines for Listers</h2>
            <p className="text-gray-600 mb-8">Best practices to ensure secure interactions with potential roommates</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {safetyGuidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <guideline.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{guideline.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{guideline.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-6 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl" />
              <div className="relative flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Keep all initial communications within the RoomEasy platform. This ensures message history is maintained and provides an additional layer of security. Only share personal contact details after you're comfortable with the seeker.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Listing Performance Section */}
        <section className="px-6 md:px-[10%] py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Your Listing Performance</h2>
            <p className="text-gray-600 mb-8">Track how your listings are performing and optimize for better results</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Response Rate Analytics */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-6 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl" />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Response Rate Analytics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { listing: 'Spacious Room in Baner', rate: 85 },
                      { listing: 'Modern Room in Hinjawadi', rate: 92 },
                      { listing: 'Cozy Room in Wakad', rate: 67 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.listing}</span>
                          <span className="text-sm font-semibold text-orange-600">{item.rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Average Response Rate</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">81.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Request Trends */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-6 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl" />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Weekly Request Trends
                  </h3>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday', requests: 3 },
                      { day: 'Tuesday', requests: 2 },
                      { day: 'Wednesday', requests: 4 },
                      { day: 'Thursday', requests: 5 },
                      { day: 'Friday', requests: 3 },
                      { day: 'Weekend', requests: 1 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.day}</span>
                          <span className="text-sm font-semibold text-gray-900">{item.requests} requests</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.requests / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-orange-200">
                      <p className="text-xs font-semibold text-orange-600">Peak Day: Thursday (5 requests)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '18', label: 'Total Requests This Month', icon: MessageSquare },
                { value: '4.8', label: 'Average Rating', icon: Star, isRating: true },
                { value: '12hrs', label: 'Average Response Time', icon: Clock },
                { value: '78%', label: 'Acceptance Rate', icon: CheckCircle }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {stat.isRating ? (
                        <div className="flex items-center gap-0.5">
                          <span className="text-lg font-bold text-white">{stat.value}</span>
                          <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        </div>
                      ) : (
                        <stat.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    {!stat.isRating && (
                      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
                        {stat.value}
                      </h3>
                    )}
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default RequestsList
