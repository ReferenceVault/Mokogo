import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
import { usersApi } from '@/services/api'
import { 
  LayoutGrid, 
  Home, 
  MessageSquare, 
  Settings,
  Users,
  User,
  TrendingUp,
  Flag,
  BarChart3,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  MapPin as MapPinIcon,
  MoreVertical,
  FileCheck,
  Download,
  AlertTriangle,
  Shield,
  X,
  Search,
  Handshake,
  Timer
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<string>('overview')
  const [timePeriod, setTimePeriod] = useState<string>('Last 7 Days')
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false)
  const timePeriodDropdownRef = useRef<HTMLDivElement>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [addUserError, setAddUserError] = useState('')
  const [addUserSuccess, setAddUserSuccess] = useState('')
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePeriodDropdownRef.current && !timePeriodDropdownRef.current.contains(event.target as Node)) {
        setShowTimePeriodDropdown(false)
      }
    }

    if (showTimePeriodDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTimePeriodDropdown])

  const timePeriodOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days']

  const handleTimePeriodSelect = (option: string) => {
    setTimePeriod(option)
    setShowTimePeriodDropdown(false)
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/admin/login')
  }

  const handleAddUserChange = (field: keyof typeof addUserForm, value: string) => {
    setAddUserForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddUserSubmit = async () => {
    setAddUserError('')
    setAddUserSuccess('')

    if (!addUserForm.name.trim() || !addUserForm.email.trim() || !addUserForm.password.trim()) {
      setAddUserError('Name, email, and password are required.')
      return
    }

    setAddUserLoading(true)
    try {
      const createUserData: any = {
        name: addUserForm.name.trim(),
        email: addUserForm.email.trim(),
        password: addUserForm.password,
      }
      
      if (addUserForm.phoneNumber.trim()) {
        createUserData.phoneNumber = addUserForm.phoneNumber.trim()
      }
      
      await usersApi.createUser(createUserData)
      setAddUserSuccess('User created successfully.')
      setAddUserForm({ name: '', email: '', phoneNumber: '', password: '' })
      setTimeout(() => {
        setShowAddUserModal(false)
        setAddUserSuccess('')
      }, 1200)
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create user.'
      setAddUserError(message)
    } finally {
      setAddUserLoading(false)
    }
  }

  const userName = 'Admin'

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Right Side Social Sidebar */}
      <SocialSidebar position="right" />
      
      {/* Dashboard Header */}
      <DashboardHeader
        activeView={activeView === 'overview' ? 'overview' : 'overview'}
        onViewChange={(view) => setActiveView(view)}
        menuItems={[
          { label: 'Dashboard', view: 'overview' }
        ]}
        userName={userName}
        userEmail="admin@mokogo.in"
        onLogout={handleLogout}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar
          title="Admin Panel"
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
              label: 'Listings',
              icon: Home,
              onClick: () => setActiveView('listings')
            },
            {
              id: 'users',
              label: 'Users',
              icon: Users,
              onClick: () => setActiveView('users')
            },
            {
              id: 'requests',
              label: 'Requests',
              icon: MessageSquare,
              onClick: () => setActiveView('requests')
            },
            {
              id: 'settings',
              label: 'Settings',
              icon: Settings,
              onClick: () => setActiveView('settings')
            }
          ]}
        />

        {/* Right Side Social Sidebar */}
        <SocialSidebar position="right" />

        {/* Main Content */}
        <main className="flex-1 pr-11 lg:pr-14">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {activeView === 'overview' && (
              <div>
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mokogo Health</h1>
                    <p className="text-sm text-gray-600 mt-1">Weekly Product Review - Week of Jan 27, 2025</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative" ref={timePeriodDropdownRef}>
                      <button 
                        onClick={() => setShowTimePeriodDropdown(!showTimePeriodDropdown)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        {timePeriod}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showTimePeriodDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showTimePeriodDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          {timePeriodOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleTimePeriodSelect(option)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                timePeriod === option ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'
                              } ${option === timePeriodOptions[0] ? 'rounded-t-lg' : ''} ${option === timePeriodOptions[timePeriodOptions.length - 1] ? 'rounded-b-lg' : ''}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-md">
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </div>

                {/* Stats Cards Section - Metric Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                  {/* Successful Connections */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Handshake className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Successful Connections</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">247</p>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="text-orange-600 font-semibold">↑ 12%</span>
                        <span className="text-gray-500">Last 7 days</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Acceptance Rate */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Request Acceptance Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">68%</p>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="text-orange-600 font-semibold">↑ 5%</span>
                        <span className="text-gray-500">+3.2pp from last week</span>
                      </div>
                    </div>
                  </div>

                  {/* Avg Time to First Response */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Avg Time to First Response</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">4.2h</p>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="text-red-600 font-semibold">↓ 8%</span>
                        <span className="text-gray-500">Median response time</span>
                      </div>
                    </div>
                  </div>

                  {/* Median Time to Fulfillment */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Timer className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Median Time to Fulfillment</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">6.3d</p>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="text-orange-600 font-semibold">↓ 6%</span>
                        <span className="text-gray-500">Listing created → marked fulfilled</span>
                      </div>
                    </div>
                  </div>

                  {/* Listings Fulfilled (%) */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Listings Fulfilled (%)</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">34%</p>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="text-orange-600 font-semibold">↑ 9%</span>
                        <span className="text-gray-500">Of active listings</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Listings with 0 Requests */}
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Active Listings with 0 Requests</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">89</p>
                      <div className="flex flex-col gap-0.5 text-xs mb-1">
                        <span className="text-red-600 font-semibold">↑ 15%</span>
                      </div>
                      <div className="space-y-0.5 text-[10px] text-gray-600">
                        <div className="flex justify-between">
                          <span>0-3d: 32</span>
                          <span>(5%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4-7d: 21</span>
                          <span>(3%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">7+d: 36</span>
                          <span className="text-red-600 font-semibold">(14%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supply & Demand Balance Section */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Supply & Demand Balance</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Key Metrics */}
                    <div className="space-y-4">
                      {/* Active Seekers */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Active Seekers</p>
                        <p className="text-3xl font-bold text-gray-900">1,842</p>
                      </div>
                      
                      {/* Active Listers */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Active Listers</p>
                        <p className="text-3xl font-bold text-gray-900">634</p>
                      </div>
                      
                      {/* Seekers per Listing */}
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-sm text-gray-600 mb-1">Seekers per Listing</p>
                        <p className="text-3xl font-bold text-orange-600">2.9</p>
                      </div>
                    </div>
                    
                    {/* Right Side - Top Cities */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Top 5 Cities by Active Listings</h4>
                      <div className="space-y-0 rounded-lg overflow-hidden border border-gray-200">
                        <div className="flex items-center justify-between px-4 py-3 bg-orange-50">
                          <span className="text-sm font-medium text-gray-900">Mumbai</span>
                          <span className="text-sm font-semibold text-gray-900">187</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-white">
                          <span className="text-sm font-medium text-gray-900">Bangalore</span>
                          <span className="text-sm font-semibold text-gray-900">156</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-orange-50">
                          <span className="text-sm font-medium text-gray-900">Delhi</span>
                          <span className="text-sm font-semibold text-gray-900">142</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-white">
                          <span className="text-sm font-medium text-gray-900">Pune</span>
                          <span className="text-sm font-semibold text-gray-900">89</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 bg-orange-50">
                          <span className="text-sm font-medium text-gray-900">Hyderabad</span>
                          <span className="text-sm font-semibold text-gray-900">60</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funnel Analysis Section */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Funnel Analysis</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Seeker Funnel */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-gray-700" />
                        <h4 className="text-base font-semibold text-gray-900">Seeker Funnel</h4>
                      </div>
                      <div className="space-y-4">
                        {/* Profiles Created */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Profiles Created</span>
                            <span className="text-sm font-bold text-gray-900">2,341</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        {/* Searches Performed */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Searches Performed</span>
                            <span className="text-sm font-bold text-gray-900">1,987</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">85% conversion</p>
                        </div>

                        {/* Requests Sent */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Requests Sent</span>
                            <span className="text-sm font-bold text-gray-900">1,124</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">57% conversion</p>
                            <p className="text-xs text-red-600 font-medium">Drop-off point</p>
                          </div>
                        </div>

                        {/* Requests Accepted */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Requests Accepted</span>
                            <span className="text-sm font-bold text-gray-900">764</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">68% conversion</p>
                        </div>

                        {/* Chats Started */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Chats Started</span>
                            <span className="text-sm font-bold text-gray-900">689</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">90% conversion</p>
                        </div>

                        {/* Listings Fulfilled */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings Fulfilled</span>
                            <span className="text-sm font-bold text-gray-900">247</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '11%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">36% conversion</p>
                        </div>
                      </div>
                    </div>

                    {/* Lister Funnel */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Home className="w-5 h-5 text-gray-700" />
                        <h4 className="text-base font-semibold text-gray-900">Lister Funnel</h4>
                      </div>
                      <div className="space-y-4">
                        {/* Listings Created */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings Created</span>
                            <span className="text-sm font-bold text-gray-900">892</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        {/* Listings Approved */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings Approved</span>
                            <span className="text-sm font-bold text-gray-900">723</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">81% conversion</p>
                        </div>

                        {/* Listings with ≥1 Request */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings with ≥1 Request</span>
                            <span className="text-sm font-bold text-gray-900">634</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">88% conversion</p>
                        </div>

                        {/* Listings with ≥1 Accepted Request */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings with ≥1 Accepted Request</span>
                            <span className="text-sm font-bold text-gray-900">421</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '47%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">66% conversion</p>
                        </div>

                        {/* Listings Closed */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">Listings Closed</span>
                            <span className="text-sm font-bold text-gray-900">247</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">59% conversion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust & Safety Health and Revenue Context Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Left Column - Two Sections Stacked */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Trust & Safety Health */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust & Safety Health</h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Profiles Fully Completed */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 text-center">82%</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Profiles Fully Completed</p>
                        </div>

                        {/* Phone/Email Verified */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 text-center">91%</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Phone/Email Verified</p>
                        </div>

                        {/* Reports per 1K Interactions */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                              <Flag className="w-5 h-5 text-yellow-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 text-center">3.2</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Reports per 1K Interactions</p>
                        </div>

                        {/* Listings Rejected */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                              <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 text-center">169</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Listings Rejected</p>
                        </div>

                        {/* Blocked Users */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center relative">
                              <User className="w-5 h-5 text-gray-600" />
                              <X className="w-3 h-3 text-gray-600 absolute -top-0.5 -right-0.5" />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 text-center">47</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Blocked Users</p>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Context */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Context</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Revenue per Fulfilled Listing */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900 text-center">₹842</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Revenue per Fulfilled Listing</p>
                          <p className="text-xs text-gray-500 text-center mt-1">Average</p>
                        </div>

                        {/* Revenue per Accepted Request */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900 text-center">₹273</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Revenue per Accepted Request</p>
                          <p className="text-xs text-gray-500 text-center mt-1">Average</p>
                        </div>

                        {/* Free → Paid Conversion */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900 text-center">18%</p>
                          <p className="text-xs text-gray-600 text-center mt-1">Free → Paid Conversion</p>
                          <p className="text-xs text-orange-600 text-center mt-1">+2% from last week</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Weekly PM Review */}
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly PM Review</h3>
                    <div className="space-y-4">
                      {/* Key Metric Change */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Key Metric Change</p>
                        <p className="text-sm text-gray-600">Acceptance rate up 5% week-over-week</p>
                      </div>

                      {/* Top Funnel Drop-off */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Top Funnel Drop-off</p>
                        <p className="text-sm text-gray-600">Searches → Requests (57% conversion)</p>
                      </div>

                      {/* Trust Issues */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Trust Issues</p>
                        <p className="text-sm text-gray-600">89 listings with 0 requests need review</p>
                      </div>

                      {/* Suggested Focus */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Suggested Focus</p>
                        <p className="text-sm text-orange-600 font-medium">Improve listing quality & visibility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'users' && (
              <div>
                {/* User Management Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Review, monitor, and manage users across the marketplace.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-64"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30"
                    >
                      <User className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                </div>

                {/* Filters and Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                      <option>All Roles</option>
                      <option>Room Seeker</option>
                      <option>Room Lister</option>
                      <option>Both</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                      <option>All Statuses</option>
                      <option>Verified</option>
                      <option>Pending</option>
                      <option>Suspended</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                      <option>All Risks</option>
                      <option>Low Risk</option>
                      <option>Medium Risk</option>
                      <option>High Risk</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                      <option>All Activity</option>
                      <option>Active</option>
                      <option>Dormant</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">Showing 1-20 of 12,847 users</p>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">USER</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ROLE</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">STATUS</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">RISK LEVEL</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LIFECYCLE</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">RECENT ACTIVITY</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">JOINED</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* User Row 1: Rohan Mehta */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                RM
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Rohan Mehta</div>
                                <div className="text-xs text-gray-500">rohan.m@example.com</div>
                                <div className="text-xs text-gray-400">ID: 8839201</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              Room Seeker
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Suspended
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <AlertTriangle className="w-3 h-3" />
                              High
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Problematic</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Reported by user</div>
                            <div className="text-xs text-gray-500">2 hours ago</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Jan 12, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-green-600 hover:text-green-700 font-medium">Restore</button>
                              <button className="text-gray-600 hover:text-gray-700">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* User Row 2: Priya Sharma */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                                PS
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Priya Sharma</div>
                                <div className="text-xs text-gray-500">priya.sharma@example.com</div>
                                <div className="text-xs text-gray-400">ID: 7723412</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Room Lister
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Low
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Active</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Created listing</div>
                            <div className="text-xs text-gray-500">1 day ago</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Oct 5, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Suspend</button>
                              <button className="text-gray-600 hover:text-gray-700">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* User Row 3: Arjun Patel */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                AP
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Arjun Patel</div>
                                <div className="text-xs text-gray-500">arjun.p@example.com</div>
                                <div className="text-xs text-gray-400">ID: 9912045</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Both
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Low
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">New</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Profile created</div>
                            <div className="text-xs text-gray-500">3 hours ago</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Apr 15, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Suspend</button>
                              <button className="text-gray-600 hover:text-gray-700">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Show</span>
                      <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-700 bg-white">
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <span className="text-sm text-gray-600">entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-500/30">1</button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">2</button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">3</button>
                      <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'listings' && (
              <div>
                {/* Listing Operations Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Listing Operations</h1>
                    <p className="text-sm text-gray-600 mt-1">Prioritize actions on pending, flagged, and stale listings.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search listings..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                      <FileCheck className="w-4 h-4" />
                      Manual Review
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Action Required Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Action Required</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">18</p>
                        <p className="text-xs text-gray-600">Pending & High Severity</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Stale Listings Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Stale Listings</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">142</p>
                        <p className="text-xs text-gray-600">Active &gt;7d with 0 reqs</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Market Health Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Market Health</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">68%</p>
                        <p className="text-xs text-gray-600">Listings with ≥1 active request</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Active Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Active</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">2,847</p>
                        <p className="text-xs text-gray-600">Across all areas</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters and Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      All Listings
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      All Areas
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Showing 1-12 of 2,847 listings</p>
                </div>

                {/* Listing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* High Risk/Flagged Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-red-100 to-red-200"></div>
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-orange-600 focus:ring-orange-500 focus:ring-2 cursor-pointer" />
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-12">
                        <div className="bg-red-600 text-white px-2.5 py-1 rounded text-xs font-semibold">
                          High Risk
                          <div className="text-[10px] font-normal opacity-90">Trust complaint</div>
                        </div>
                      </div>
                      {/* Three dots */}
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Shared Room in Koramangala</h3>
                        <p className="text-lg font-bold text-gray-900">₹8,500</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Koramangala 4th Block, Bangalore</span>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                        <span>Requests: 0</span>
                        <span>Live: 11 days</span>
                        <span className="text-blue-600">Area demand: High</span>
                      </div>
                      {/* Status Section */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-3">
                        <div className="text-xs font-semibold text-red-700 mb-1">SEVERITY: Trust & Safety</div>
                        <div className="text-xs text-red-600">FLAGGED: 2 hrs ago</div>
                      </div>
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                          RK
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">Rajesh Kumar</div>
                          <div className="text-[10px] text-gray-500">#MK9281</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Review
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pending Review Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200"></div>
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-orange-600 focus:ring-orange-500 focus:ring-2 cursor-pointer" />
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-12">
                        <div className="bg-orange-500 text-white px-2.5 py-1 rounded text-xs font-semibold">
                          Pending Review
                        </div>
                      </div>
                      {/* Three dots */}
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">2BHK Near HSR Layout</h3>
                        <p className="text-lg font-bold text-gray-900">₹12,000</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>HSR Layout Sector 2, Bangalore</span>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                        <span>Requests: 3</span>
                        <span>Live: 2 days</span>
                        <span className="text-blue-600">Area demand: High</span>
                      </div>
                      {/* Status Section */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 mb-3">
                        <div className="text-xs font-semibold text-yellow-800 mb-1">STATUS: Awaiting Approval</div>
                        <div className="text-xs text-yellow-700">SUBMITTED: 6 hrs ago</div>
                      </div>
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                          PS
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">Priya Sharma</div>
                          <div className="text-[10px] text-gray-500">#MK7642</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Approve
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stale Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200"></div>
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-orange-600 focus:ring-orange-500 focus:ring-2 cursor-pointer" />
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-12">
                        <div className="bg-yellow-500 text-white px-2.5 py-1 rounded text-xs font-semibold">
                          Stale
                        </div>
                      </div>
                      {/* Three dots */}
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Single Room in Whitefield</h3>
                        <p className="text-lg font-bold text-gray-900">₹9,500</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Whitefield, Bangalore</span>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                        <span>Requests: 0</span>
                        <span>Live: 14 days</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Area demand: Low demand</span>
                      </div>
                      {/* Status Section */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 mb-3">
                        <div className="text-xs font-semibold text-yellow-800 mb-1">ACTIVITY: No Requests</div>
                        <div className="text-xs text-yellow-700">LAST UPDATE: 14 days ago</div>
                      </div>
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                          AP
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">Amit Patel</div>
                          <div className="text-[10px] text-gray-500">#MK5129</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Review
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-700 bg-white">
                      <option>12</option>
                      <option>24</option>
                      <option>48</option>
                    </select>
                    <span className="text-sm text-gray-600">listings per page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-500/30">1</button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">2</button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">3</button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'requests' && (
              <div>
                {/* User Reports Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">User Reports</h1>
                  <p className="text-sm text-gray-600">Review reports submitted by users about listings and other users.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* New Reports Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">New Reports</p>
                    <p className="text-3xl font-bold text-gray-900">14</p>
                  </div>
                  {/* Resolved Reports Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <p className="text-sm text-gray-600 mb-2">Resolved Reports</p>
                    <p className="text-3xl font-bold text-gray-900">38</p>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                    <option>All Reports</option>
                    <option>New</option>
                    <option>Resolved</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent">
                    <option>All Types</option>
                    <option>Listing Reports</option>
                    <option>User Reports</option>
                  </select>
                </div>

                {/* Report List */}
                <div className="space-y-4">
                  {/* Report Card 1 */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Listing</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">New</span>
                      </div>
                      <span className="text-xs text-gray-500">3 hours ago</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Lister asking for payment before visit</h3>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">Reported by: Rahul Sharma - Seeker</p>
                        <p className="text-sm text-gray-600">Listing: 2BHK in Koramangala</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                          Review
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                          Mark as Resolved
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove Listing</button>
                      </div>
                    </div>
                  </div>

                  {/* Report Card 2 */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Listing</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">New</span>
                      </div>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Photos do not match actual room</h3>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">Reported by: Priya Patel - Seeker</p>
                        <p className="text-sm text-gray-600">Listing: Single Room near HSR Layout</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                          Review
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                          Mark as Resolved
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove Listing</button>
                      </div>
                    </div>
                  </div>

                  {/* Report Card 3 */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">User</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">New</span>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Suspicious user behavior</h3>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">Reported by: Anjali Mehta - Lister</p>
                        <p className="text-sm text-gray-600">User: Rajesh Kumar</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                          Review
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                          Mark as Resolved
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove User</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'settings' && (
              <div>
                {/* Settings Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-600 mt-1">Configure marketplace rules and system behavior</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      Discard Changes
                    </button>
                    <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Verification Rules Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Verification Rules</h2>
                  <p className="text-sm text-gray-600 mb-6">Control mandatory verification across the platform</p>
                  
                  <div className="space-y-6">
                    {/* Email Verification Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Email verification required</p>
                        <p className="text-xs text-gray-600">Users must verify email before accessing core features</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    {/* Phone Verification Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Phone verification required</p>
                        <p className="text-xs text-gray-600">Users must verify phone number before contacting or listing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">Applies to all users (seekers + listers)</p>
                  </div>
                </div>

                {/* Moderation & Auto-Flag Rules Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Moderation & Auto-Flag Rules</h2>
                  <p className="text-sm text-gray-600 mb-6">Automatically surface risky behavior without manual review</p>
                  
                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reports to flag a listing</label>
                      <input
                        type="number"
                        defaultValue="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reports to flag a user</label>
                      <input
                        type="number"
                        defaultValue="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time window (hours)</label>
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-orange-900">Reports within this window trigger auto-flag. When thresholds are met, listings or users are automatically flagged and appear in the Requests tab.</p>
                  </div>
                </div>

                {/* Rate Limits Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate Limits</h2>
                  <p className="text-sm text-gray-600 mb-6">Prevent abuse and spam</p>
                  
                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max listings per user</label>
                      <input
                        type="number"
                        defaultValue="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max contact requests per day</label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max reports per user per day</label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">Rate limits apply across the platform and reset daily</p>
                  </div>
                </div>

                {/* City Availability Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">City Availability</h2>
                  <p className="text-sm text-gray-600 mb-6">Control geographic rollout</p>
                  
                  {/* City List Table */}
                  <div className="border-t border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-700">City Name</div>
                      <div className="text-sm font-medium text-gray-700 text-right">Status</div>
                    </div>
                    
                    {/* City Rows */}
                    <div className="divide-y divide-gray-200">
                      {/* Pune */}
                      <div className="grid grid-cols-2 gap-4 py-4 items-center">
                        <div className="text-sm text-gray-900">Pune</div>
                        <div className="flex justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Bangalore */}
                      <div className="grid grid-cols-2 gap-4 py-4 items-center">
                        <div className="text-sm text-gray-900">Bangalore</div>
                        <div className="flex justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Mumbai */}
                      <div className="grid grid-cols-2 gap-4 py-4 items-center">
                        <div className="text-sm text-gray-900">Mumbai</div>
                        <div className="flex justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Delhi */}
                      <div className="grid grid-cols-2 gap-4 py-4 items-center">
                        <div className="text-sm text-gray-900">Delhi</div>
                        <div className="flex justify-end">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">Disabled cities: No new listings, no new searches. Existing data remains hidden.</p>
                  </div>
                </div>

                {/* Audit & Change Log Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Audit & Change Log</h2>
                  <p className="text-sm text-gray-600 mb-6">Transparency & accountability (Read-only)</p>
                  
                  {/* Audit Log Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Setting Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Change</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Changed By</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">Phone verification</td>
                          <td className="px-4 py-3 text-sm text-gray-900">OFF → ON</td>
                          <td className="px-4 py-3 text-sm text-gray-600">admin@mokogo.com</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-01-15 14:30:22</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">Pune city</td>
                          <td className="px-4 py-3 text-sm text-gray-900">Disabled → Enabled</td>
                          <td className="px-4 py-3 text-sm text-gray-600">founder@mokogo.com</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-01-12 09:15:45</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">Max listings per user</td>
                          <td className="px-4 py-3 text-sm text-gray-900">3 → 1</td>
                          <td className="px-4 py-3 text-sm text-gray-600">admin@mokogo.com</td>
                          <td className="px-4 py-3 text-sm text-gray-600">2024-01-10 16:45:12</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Warning Banner */}
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">Changes made here affect the entire platform. Please review carefully before applying.</p>
                  </div>
                </div>
              </div>
            )}

            {activeView !== 'overview' && activeView !== 'users' && activeView !== 'listings' && activeView !== 'requests' && activeView !== 'settings' && (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600">Content will be added here</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add User</h2>
            <p className="text-sm text-gray-600 mb-4">Create a new user account.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={addUserForm.name}
                  onChange={(e) => handleAddUserChange('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => handleAddUserChange('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  value={addUserForm.phoneNumber}
                  onChange={(e) => handleAddUserChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => handleAddUserChange('password', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {addUserError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {addUserError}
                </div>
              )}
              {addUserSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                  {addUserSuccess}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserSubmit}
                disabled={addUserLoading}
                className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {addUserLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AdminDashboard
