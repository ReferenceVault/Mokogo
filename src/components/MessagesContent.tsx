import { useState } from 'react'
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Shield,
  Star,
  Calendar,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Send,
  X,
  Flag,
  Archive
} from 'lucide-react'

const MessagesContent = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all')
  const [selectedConversation, setSelectedConversation] = useState<string | null>('rahul')
  const [message, setMessage] = useState('')
  const [showProfile, setShowProfile] = useState(true)

  const conversations = [
    {
      id: 'rahul',
      name: 'Rahul Gupta',
      avatar: 'https://i.pravatar.cc/150?img=12',
      lastMessage: "That sounds perfect! When can we...",
      timestamp: '2 min ago',
      role: 'Room Seeker',
      location: 'Baner Area',
      isOnline: true,
      unread: 0,
      isVerified: true
    },
    {
      id: 'sneha',
      name: 'Sneha Joshi',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: "Hi! I'm interested in your room listing...",
      timestamp: '1 hour ago',
      role: 'Room Seeker',
      location: 'Wakad Area',
      isOnline: false,
      unread: 0,
      isVerified: true
    },
    {
      id: 'amit',
      name: 'Amit Patel',
      avatar: 'https://i.pravatar.cc/150?img=15',
      lastMessage: "You: Thanks for the information. I'll...",
      timestamp: '3 hours ago',
      role: 'Room Lister',
      location: 'Hinjawadi Area',
      isOnline: false,
      unread: 0,
      isVerified: true
    },
    {
      id: 'vikram',
      name: 'Vikram Singh',
      avatar: 'https://i.pravatar.cc/150?img=8',
      lastMessage: "The room looks great! Can we schedule...",
      timestamp: 'Yesterday',
      role: 'Room Seeker',
      location: 'Aundh Area',
      isOnline: false,
      unread: 2,
      isVerified: true
    },
    {
      id: 'anita',
      name: 'Anita Desai',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: "You: The deposit amount is ₹15,000...",
      timestamp: '2 days ago',
      role: 'Room Seeker',
      location: 'Kothrud Area',
      isOnline: false,
      unread: 0,
      isVerified: true
    },
    {
      id: 'arjun',
      name: 'Arjun Mehta',
      avatar: 'https://i.pravatar.cc/150?img=20',
      lastMessage: "Is the room still available for...",
      timestamp: '3 days ago',
      role: 'Room Seeker',
      location: 'Karve Nagar',
      isOnline: false,
      unread: 0,
      isVerified: true
    }
  ]

  const messages = [
    {
      id: '1',
      type: 'system',
      text: 'Connection Approved. Rahul has accepted your contact request. You can now message each other securely.',
      timestamp: 'Today'
    },
    {
      id: '2',
      sender: 'rahul',
      text: "Hi Priya! Thanks for showing interest in my room listing. I'd be happy to answer any questions you have.",
      timestamp: '10:30 AM'
    },
    {
      id: '3',
      sender: 'you',
      text: "Hello Rahul! I'm really interested in the room. Could you tell me more about the neighborhood and the other roommates?",
      timestamp: '10:32 AM'
    },
    {
      id: '4',
      sender: 'rahul',
      text: "Great! The apartment is in a very safe and well-connected area. We're just 10 minutes from Symbiosis and there are plenty of cafes and restaurants nearby.\n\nCurrently, there are 2 other working professionals - one in IT and another in marketing. We're all pretty easy-going and maintain a clean, peaceful environment.",
      timestamp: '10:35 AM'
    },
    {
      id: '5',
      sender: 'you',
      text: "That sounds perfect! I work in tech too, so I think I'd fit in well. What about parking and Wi-Fi?",
      timestamp: '10:38 AM'
    },
    {
      id: '6',
      sender: 'rahul',
      text: "Excellent! We have dedicated 2-wheeler parking included in the rent. For 4-wheeler, there's covered parking available for an additional ₹1,000/month.\n\nWi-Fi is high-speed fiber - 100 Mbps - perfect for work from home. It's shared among all of us, so the cost is split.\n\nQuick Amenities Overview:\n\n• High-Speed Wi-Fi\n• AC in Room\n• Parking Available\n• Fully Equipped Kitchen",
      timestamp: '10:42 AM'
    },
    {
      id: '7',
      sender: 'you',
      text: "This all sounds great! When would be a good time to visit and see the room in person?",
      timestamp: '10:45 AM'
    },
    {
      id: '8',
      sender: 'rahul',
      text: "Perfect! I'm available this weekend. How about Saturday afternoon around 3 PM? That way you can meet the other roommates too and get a feel for the place.\n\nSuggested Visit Time\n\nSaturday, Dec 16 at 3:00 PM",
      timestamp: '10:48 AM'
    },
    {
      id: '9',
      sender: 'you',
      text: "Saturday at 3 PM works perfectly for me! Should I bring any documents or anything specific?",
      timestamp: '10:50 AM'
    },
    {
      id: '10',
      sender: 'rahul',
      text: "Just bring a valid ID for verification. If you like the place and want to proceed, we can discuss the security deposit and agreement details.\n\nI'll share the exact address and any parking instructions closer to Saturday. Looking forward to meeting you!",
      timestamp: '10:52 AM'
    }
  ]

  const quickReplies = [
    "Thanks for the info!",
    "Can we schedule a call?",
    "I'm interested!",
    "What about the deposit?"
  ]

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'active') return conv.isOnline
    if (activeTab === 'archived') return false // You can add archived logic
    return true
  })

  return (
    <div className="h-[calc(100vh-120px)] flex bg-gray-50">
      {/* Left Panel - Messages List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            <button className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
              <span className="text-xl">+</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All (12)
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active (8)
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'archived'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Archived (4)
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conv.id ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                      {conv.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-1">{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{conv.role}</span>
                    <span>•</span>
                    <span>{conv.location}</span>
                    {conv.unread > 0 && (
                      <>
                        <span>•</span>
                        <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">
                          {conv.unread}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedConv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{selectedConv.name}</span>
                    {selectedConv.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {selectedConv.isOnline && <span className="text-green-500">Online now</span>}
                    <span>•</span>
                    <span>Software Engineer</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Room Listing Banner */}
            <div className="p-4 border-b border-gray-200 bg-orange-50/50">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop"
                  alt="Room"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-1">Spacious Room in Baner</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>₹12,000/month</span>
                    <span>•</span>
                    <span>Baner Road, Near Symbiosis</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">Available Now</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-orange-400 text-white text-sm font-semibold rounded-lg hover:bg-orange-500 transition-colors">
                  View Listing
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 max-w-md">
                        <p className="text-xs text-green-800 text-center">{msg.text}</p>
                      </div>
                    </div>
                  )
                }

                const isYou = msg.sender === 'you'
                return (
                  <div key={msg.id} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isYou && (
                        <img
                          src={selectedConv.avatar}
                          alt={selectedConv.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className={`rounded-lg px-4 py-2 ${isYou ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                        <span className={`text-xs mt-1 block ${isYou ? 'text-orange-100' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Visit
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Request Call
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Agreement
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>End-to-end encrypted</span>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2 mb-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl text-gray-600">+</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-lg">😊</span>
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quick Replies */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Quick replies:</span>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(reply)}
                    className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Right Panel - User Profile */}
      {selectedConv && showProfile && (
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {selectedConv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{selectedConv.name}</span>
                    {selectedConv.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-green-500">Online now</div>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profession</span>
                  <span className="text-gray-900 font-medium">Software Engineer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="text-gray-900 font-medium">28 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="text-gray-900 font-medium">Male</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-900 font-medium">Baner, Pune</span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Verification Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ID Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Background Check</span>
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Pending</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Working professional with 5+ years in tech. Clean, organized, and respectful roommate. Love cooking and occasional Netflix binges. Non-smoker, social drinker.
              </p>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {['Non-Smoker', 'Vegetarian', 'Early Riser', 'Work From Home'].map((pref) => (
                  <span
                    key={pref}
                    className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Reviews (4.8/5)</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Sneha J.</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">"Excellent roommate! Very clean and respectful. Great communication."</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Vikram S.</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">"Responsible and friendly. Would definitely recommend as a roommate."</p>
                </div>
                <button className="text-xs text-orange-400 hover:text-orange-500 font-medium">
                  View all reviews
                </button>
              </div>
            </div>

            {/* Mutual Connections */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Mutual Connections (2)</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?img=15"
                    alt="Amit"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Amit Patel</div>
                    <div className="text-xs text-gray-600">Software Engineer at TechCorp</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/150?img=1"
                    alt="Anita"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Anita Desai</div>
                    <div className="text-xs text-gray-600">Marketing Manager</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Privacy */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Safety & Privacy</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Block User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive Conversation
                </button>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-green-900 mb-1">Safe Communication Active</div>
                    <p className="text-xs text-green-700">
                      Your messages are encrypted and monitored for safety. Never share personal financial information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesContent

