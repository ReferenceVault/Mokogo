import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardSidebar from '@/components/DashboardSidebar'
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
  Clock as ClockIcon,
  Eye,
  UserPlus,
  MapPin as MapPinIcon,
  MoreVertical,
  MoreHorizontal,
  FileCheck,
  Download,
  AlertTriangle,
  Shield,
  CheckCircle2,
  X,
  ArrowRight,
  Search
} from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<string>('overview')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/admin/login')
  }

  const userName = 'Admin'
  const userInitial = userName[0]?.toUpperCase() || 'A'

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
        userInitial={userInitial}
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
                {/* Stats Cards Section - Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Users Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-4 text-white">
                    <div className="absolute top-3 right-3 w-10 h-10 bg-orange-400/30 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="relative">
                      <p className="text-xs font-medium text-white/90 mb-1">Total Users</p>
                      <p className="text-2xl font-bold mb-1">12,847</p>
                      <div className="flex items-center gap-1 text-xs text-white/90">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12% from last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Listings Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
                    <div className="absolute top-3 right-3 w-10 h-10 bg-green-400/30 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div className="relative">
                      <p className="text-xs font-medium text-white/90 mb-1">Active Listings</p>
                      <p className="text-2xl font-bold mb-1">2,847</p>
                      <div className="flex items-center gap-1 text-xs text-white/90">
                        <TrendingUp className="w-3 h-3" />
                        <span>+8% from last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Reviews Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-4 text-white">
                    <div className="absolute top-3 right-3 w-10 h-10 bg-orange-400/30 rounded-lg flex items-center justify-center">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div className="relative">
                      <p className="text-xs font-medium text-white/90 mb-1">Pending Reviews</p>
                      <p className="text-2xl font-bold mb-1">72</p>
                      <div className="flex items-center gap-1 text-xs text-white/90">
                        <Clock className="w-3 h-3" />
                        <span>Requires attention</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
                    <div className="absolute top-3 right-3 w-10 h-10 bg-purple-400/30 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="relative">
                      <p className="text-xs font-medium text-white/90 mb-1">Revenue (Month)</p>
                      <p className="text-2xl font-bold mb-1">₹2.4L</p>
                      <div className="flex items-center gap-1 text-xs text-white/90">
                        <TrendingUp className="w-3 h-3" />
                        <span>+15% from last month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* User Registration Trends */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">User Registration Trends</h3>
                      <div className="flex items-center gap-2">
                        <select className="text-xs border border-gray-300 rounded-lg px-2 py-1 text-gray-700 bg-white">
                          <option>Last 30 days</option>
                          <option>Last 7 days</option>
                          <option>Last 90 days</option>
                        </select>
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="h-48">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Y-axis */}
                        <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="20" y="20" fontSize="10" fill="#6b7280">500</text>
                        <text x="20" y="60" fontSize="10" fill="#6b7280">400</text>
                        <text x="20" y="100" fontSize="10" fill="#6b7280">200</text>
                        <text x="20" y="140" fontSize="10" fill="#6b7280">100</text>
                        <text x="20" y="180" fontSize="10" fill="#6b7280">0</text>
                        <text x="15" y="100" fontSize="10" fill="#6b7280" transform="rotate(-90 15 100)">New Users</text>
                        
                        {/* X-axis */}
                        <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="100" y="195" fontSize="10" fill="#6b7280">Week 1</text>
                        <text x="170" y="195" fontSize="10" fill="#6b7280">Week 2</text>
                        <text x="240" y="195" fontSize="10" fill="#6b7280">Week 3</text>
                        <text x="310" y="195" fontSize="10" fill="#6b7280">Week 4</text>
                        
                        {/* Room Seekers line (orange) */}
                        <polyline
                          points="100,120 170,90 240,60 310,50"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2"
                        />
                        <circle cx="100" cy="120" r="4" fill="#f97316" />
                        <circle cx="170" cy="90" r="4" fill="#f97316" />
                        <circle cx="240" cy="60" r="4" fill="#f97316" />
                        <circle cx="310" cy="50" r="4" fill="#f97316" />
                        
                        {/* Room Listers line (green) */}
                        <polyline
                          points="100,160 170,150 240,140 310,130"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                        <circle cx="100" cy="160" r="4" fill="#10b981" />
                        <circle cx="170" cy="150" r="4" fill="#10b981" />
                        <circle cx="240" cy="140" r="4" fill="#10b981" />
                        <circle cx="310" cy="130" r="4" fill="#10b981" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-gray-600">Room Seekers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Room Listers</span>
                      </div>
                    </div>
                  </div>

                  {/* Listing Activity */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Listing Activity</h3>
                      <div className="flex items-center gap-2">
                        <select className="text-xs border border-gray-300 rounded-lg px-2 py-1 text-gray-700 bg-white">
                          <option>This month</option>
                          <option>Last month</option>
                          <option>Last 3 months</option>
                        </select>
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="h-48">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Y-axis */}
                        <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="20" y="20" fontSize="10" fill="#6b7280">400</text>
                        <text x="20" y="60" fontSize="10" fill="#6b7280">300</text>
                        <text x="20" y="100" fontSize="10" fill="#6b7280">200</text>
                        <text x="20" y="140" fontSize="10" fill="#6b7280">100</text>
                        <text x="20" y="180" fontSize="10" fill="#6b7280">0</text>
                        <text x="15" y="100" fontSize="10" fill="#6b7280" transform="rotate(-90 15 100)">Listings</text>
                        
                        {/* X-axis */}
                        <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="100" y="195" fontSize="10" fill="#6b7280">Week 1</text>
                        <text x="170" y="195" fontSize="10" fill="#6b7280">Week 2</text>
                        <text x="240" y="195" fontSize="10" fill="#6b7280">Week 3</text>
                        <text x="310" y="195" fontSize="10" fill="#6b7280">Week 4</text>
                        
                        {/* Bars for Week 1 */}
                        <rect x="70" y="120" width="20" height="60" fill="#f97316" rx="2" />
                        <rect x="92" y="125" width="20" height="55" fill="#10b981" rx="2" />
                        <rect x="114" y="175" width="20" height="5" fill="#ef4444" rx="2" />
                        
                        {/* Bars for Week 2 */}
                        <rect x="140" y="100" width="20" height="80" fill="#f97316" rx="2" />
                        <rect x="162" y="105" width="20" height="75" fill="#10b981" rx="2" />
                        <rect x="184" y="175" width="20" height="5" fill="#ef4444" rx="2" />
                        
                        {/* Bars for Week 3 */}
                        <rect x="210" y="80" width="20" height="100" fill="#f97316" rx="2" />
                        <rect x="232" y="85" width="20" height="95" fill="#10b981" rx="2" />
                        <rect x="254" y="175" width="20" height="5" fill="#ef4444" rx="2" />
                        
                        {/* Bars for Week 4 */}
                        <rect x="280" y="60" width="20" height="120" fill="#f97316" rx="2" />
                        <rect x="302" y="65" width="20" height="115" fill="#10b981" rx="2" />
                        <rect x="324" y="170" width="20" height="10" fill="#ef4444" rx="2" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-gray-600">New Listings</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Approved</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-600">Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* User Types Distribution */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">User Types Distribution</h3>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="h-40 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-32 h-32">
                        {/* Pie chart segments */}
                        <circle cx="100" cy="100" r="60" fill="#f97316" stroke="white" strokeWidth="2" />
                        <path
                          d="M 100 100 L 100 40 A 60 60 0 0 1 160 100 Z"
                          fill="#10b981"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <path
                          d="M 100 100 L 160 100 A 60 60 0 0 1 130 160 Z"
                          fill="#a855f7"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2 mt-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-gray-600">Room Seekers</span>
                        </div>
                        <span className="font-semibold text-gray-900">65.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Room Listers</span>
                        </div>
                        <span className="font-semibold text-gray-900">24.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-gray-600">Both</span>
                        </div>
                        <span className="font-semibold text-gray-900">10.0%</span>
                      </div>
                    </div>
                  </div>

                  {/* Popular Areas */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Popular Areas</h3>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="h-40">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Y-axis labels */}
                        <text x="10" y="30" fontSize="10" fill="#6b7280">Aundh</text>
                        <text x="10" y="55" fontSize="10" fill="#6b7280">Kothrud</text>
                        <text x="10" y="80" fontSize="10" fill="#6b7280">Wakad</text>
                        <text x="10" y="105" fontSize="10" fill="#6b7280">Baner</text>
                        <text x="10" y="130" fontSize="10" fill="#6b7280">Hinjawadi</text>
                        
                        {/* X-axis */}
                        <line x1="60" y1="150" x2="380" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="60" y="165" fontSize="9" fill="#6b7280">0</text>
                        <text x="150" y="165" fontSize="9" fill="#6b7280">250</text>
                        <text x="240" y="165" fontSize="9" fill="#6b7280">500</text>
                        <text x="330" y="165" fontSize="9" fill="#6b7280">750</text>
                        <text x="370" y="165" fontSize="9" fill="#6b7280">1000</text>
                        <text x="200" y="180" fontSize="10" fill="#6b7280">Listings</text>
                        
                        {/* Horizontal bars */}
                        <rect x="60" y="20" width="60" height="12" fill="#f97316" rx="2" />
                        <rect x="60" y="45" width="80" height="12" fill="#f97316" rx="2" />
                        <rect x="60" y="70" width="120" height="12" fill="#f97316" rx="2" />
                        <rect x="60" y="95" width="170" height="12" fill="#f97316" rx="2" />
                        <rect x="60" y="120" width="240" height="12" fill="#f97316" rx="2" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-gray-600">Active Listings</span>
                    </div>
                  </div>

                  {/* Content Moderation */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Content Moderation</h3>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">Approved Content</span>
                          <span className="text-xs font-semibold text-gray-900">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">Flagged Content</span>
                          <span className="text-xs font-semibold text-gray-900">4%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">Rejected Content</span>
                          <span className="text-xs font-semibold text-gray-900">2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Reports & Analytics Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">System Reports & Analytics</h2>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        Last 7 days
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Platform Health Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform Health</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600">System Uptime</span>
                            <span className="text-xs font-semibold text-green-600">99.8%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600">Response Time</span>
                            <span className="text-xs font-semibold text-orange-600">1.2s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600">Error Rate</span>
                            <span className="text-xs font-semibold text-red-600">0.2%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '0.2%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Engagement Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">User Engagement</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Daily Active Users</p>
                          <p className="text-lg font-bold text-gray-900">3,247</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Avg. Session Duration</p>
                          <p className="text-lg font-bold text-gray-900">12m 34s</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Bounce Rate</p>
                          <p className="text-lg font-bold text-gray-900">24.5%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Conversion Rate</p>
                          <p className="text-lg font-bold text-gray-900">8.2%</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Metrics Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Security Metrics</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Failed Login Attempts</p>
                          <p className="text-lg font-bold text-red-600">47</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Blocked IPs</p>
                          <p className="text-lg font-bold text-red-600">12</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Spam Attempts</p>
                          <p className="text-lg font-bold text-red-600">156</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-0.5">Security Score</p>
                          <p className="text-lg font-bold text-green-600">A+</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Analytics Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Revenue Analytics</h3>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="h-64">
                      <svg viewBox="0 0 600 250" className="w-full h-full">
                        {/* Y-axis */}
                        <line x1="50" y1="20" x2="50" y2="220" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="25" y="20" fontSize="10" fill="#6b7280">300k</text>
                        <text x="25" y="80" fontSize="10" fill="#6b7280">200k</text>
                        <text x="25" y="140" fontSize="10" fill="#6b7280">100k</text>
                        <text x="25" y="220" fontSize="10" fill="#6b7280">0</text>
                        <text x="15" y="120" fontSize="10" fill="#6b7280" transform="rotate(-90 15 120)">Revenue (₹)</text>
                        
                        {/* X-axis */}
                        <line x1="50" y1="220" x2="550" y2="220" stroke="#e5e7eb" strokeWidth="1" />
                        <text x="100" y="235" fontSize="10" fill="#6b7280">Jan</text>
                        <text x="180" y="235" fontSize="10" fill="#6b7280">Feb</text>
                        <text x="260" y="235" fontSize="10" fill="#6b7280">Mar</text>
                        <text x="340" y="235" fontSize="10" fill="#6b7280">Apr</text>
                        <text x="420" y="235" fontSize="10" fill="#6b7280">May</text>
                        <text x="500" y="235" fontSize="10" fill="#6b7280">Jun</text>
                        
                        {/* Revenue line and area */}
                        <defs>
                          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 100 180 L 180 170 L 260 150 L 340 130 L 420 110 L 500 90"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2"
                        />
                        <path
                          d="M 100 180 L 180 170 L 260 150 L 340 130 L 420 110 L 500 90 L 500 220 L 100 220 Z"
                          fill="url(#revenueGradient)"
                        />
                        <circle cx="100" cy="180" r="4" fill="#f97316" />
                        <circle cx="180" cy="170" r="4" fill="#f97316" />
                        <circle cx="260" cy="150" r="4" fill="#f97316" />
                        <circle cx="340" cy="130" r="4" fill="#f97316" />
                        <circle cx="420" cy="110" r="4" fill="#f97316" />
                        <circle cx="500" cy="90" r="4" fill="#f97316" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-gray-600">Revenue</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow text-left group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-orange-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Add New User</h3>
                      <p className="text-xs text-gray-600">Manually create user accounts</p>
                    </button>

                    <button className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow text-left group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Home className="w-6 h-6 text-green-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Review Listings</h3>
                      <p className="text-xs text-gray-600">Approve pending room listings</p>
                    </button>

                    <button className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow text-left group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Flag className="w-6 h-6 text-orange-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Handle Reports</h3>
                      <p className="text-xs text-gray-600">Review flagged content</p>
                    </button>

                    <button className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow text-left group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">System Settings</h3>
                      <p className="text-xs text-gray-600">Configure platform parameters</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All Activity</button>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="space-y-4">
                      {/* Activity 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Admin User approved listing "Spacious Room in Baner"</p>
                          <p className="text-xs text-gray-500 mt-0.5">2 minutes ago</p>
                        </div>
                      </div>

                      {/* Activity 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">New user Anita Desai registered as Room Seeker</p>
                          <p className="text-xs text-gray-500 mt-0.5">15 minutes ago</p>
                        </div>
                      </div>

                      {/* Activity 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Flag className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Admin User flagged listing for review</p>
                          <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
                        </div>
                      </div>

                      {/* Activity 4 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">User spam_user_123 was suspended for policy violations</p>
                          <p className="text-xs text-gray-500 mt-0.5">3 hours ago</p>
                        </div>
                      </div>

                      {/* Activity 5 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Daily analytics report generated and sent to stakeholders</p>
                          <p className="text-xs text-gray-500 mt-0.5">6 hours ago</p>
                        </div>
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
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                      <User className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                </div>

                {/* Filters and Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      All Users
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      All Roles
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Showing 1-20 of 12,847 users</p>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Activity</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Sample User Rows */}
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                                PS
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Priya Sharma</div>
                                <div className="text-xs text-gray-500">priya.sharma@email.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              Room Seeker
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Jan 15, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2 hours ago</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-orange-600 hover:text-orange-700 font-medium">Suspend</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-semibold">
                                RG
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Rahul Gupta</div>
                                <div className="text-xs text-gray-500">rahul.gupta@email.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Room Lister
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Dec 28, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">5 hours ago</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-orange-600 hover:text-orange-700 font-medium">Suspend</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                SJ
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Sneha Joshi</div>
                                <div className="text-xs text-gray-500">sneha.joshi@email.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Both
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              <ClockIcon className="w-3 h-3" />
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Feb 3, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">1 day ago</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-orange-600 hover:text-orange-700 font-medium">Suspend</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white font-semibold">
                                AP
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Amit Patel</div>
                                <div className="text-xs text-gray-500">amit.patel@email.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              Room Seeker
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle className="w-3 h-3" />
                              Suspended
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Nov 12, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">3 days ago</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4 text-sm">
                              <button className="text-orange-600 hover:text-orange-700 font-medium">View</button>
                              <button className="text-green-600 hover:text-green-700 font-medium">Restore</button>
                              <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
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
                {/* Listing Management Header */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Listing Management</h1>
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
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Active Listings</p>
                        <p className="text-2xl font-bold text-gray-900">2,847</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Pending Review</p>
                        <p className="text-2xl font-bold text-gray-900">47</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Flagged Content</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Flag className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Rejected</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-gray-600" />
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
                  {/* Active Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                          Active
                        </span>
                      </div>
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Spacious Room in Baner</h3>
                        <p className="text-lg font-bold text-gray-900">₹12,000</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Baner Road, Near Symbiosis</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                          PS
                        </div>
                        <span className="text-xs text-gray-600">Priya Sharma</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Posted 2 days ago</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>234 views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">View Details</button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">Flag</button>
                      </div>
                    </div>
                  </div>

                  {/* Pending Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                          Pending
                        </span>
                      </div>
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Cozy Room in Wakad</h3>
                        <p className="text-lg font-bold text-gray-900">₹9,500</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Wakad, Near Rajiv Gandhi IT Park</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                          RG
                        </div>
                        <span className="text-xs text-gray-600">Rahul Gupta</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Posted 1 hour ago</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>12 views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">Approve</button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Reject</button>
                      </div>
                    </div>
                  </div>

                  {/* Flagged Listing Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                          Flagged
                        </span>
                      </div>
                      <button className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Modern Room in Hinjawadi</h3>
                        <p className="text-lg font-bold text-gray-900">₹15,000</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Hinjawadi Phase 2, Near Tech Parks</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-xs font-semibold">
                          AP
                        </div>
                        <span className="text-xs text-gray-600">Amit Patel</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1 text-red-600">
                          <Flag className="w-3.5 h-3.5" />
                          <span>Flagged 3 hours ago</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flag className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-red-600">2 reports</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Review</button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
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
                {/* Content Moderation Header */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <Download className="w-4 h-4" />
                      Export Reports
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-orange-500/30">
                      <Settings className="w-4 h-4" />
                      Moderation Settings
                    </button>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Recent Reports */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
                    <div className="space-y-4">
                      {/* Inappropriate Content Card */}
                      <div className="bg-white rounded-xl shadow-md border-l-4 border-red-500 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Inappropriate Content</h3>
                            <p className="text-xs text-gray-600 mb-2">Listing ID #12847 reported for misleading photos</p>
                            <p className="text-xs text-gray-500">Reported by: user@email.com • 2 hours ago</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Review</button>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                          </div>
                        </div>
                      </div>

                      {/* Spam Content Card */}
                      <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-500 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Flag className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Spam Content</h3>
                            <p className="text-xs text-gray-600 mb-2">Multiple duplicate listings from same user</p>
                            <p className="text-xs text-gray-500">Auto-detected • 5 hours ago</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Review</button>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                          </div>
                        </div>
                      </div>

                      {/* Suspicious Activity Card */}
                      <div className="bg-white rounded-xl shadow-md border-l-4 border-yellow-500 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Suspicious Activity</h3>
                            <p className="text-xs text-gray-600 mb-2">User creating multiple accounts</p>
                            <p className="text-xs text-gray-500">System Alert • 1 day ago</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Investigate</button>
                            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">Monitor</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Moderation Queue */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Moderation Queue</h2>
                    <div className="space-y-4">
                      {/* Bright Room Card */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Bright Room in Kothrud</h3>
                            <p className="text-xs text-gray-500 mb-3">Pending photo verification</p>
                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Luxury Room Card */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Luxury Room in Aundh</h3>
                            <p className="text-xs text-gray-500 mb-3">Price verification required</p>
                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Budget Room Card */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Budget Room in Karve Nagar</h3>
                            <p className="text-xs text-gray-500 mb-3">Address verification needed</p>
                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView !== 'overview' && activeView !== 'users' && activeView !== 'listings' && activeView !== 'requests' && (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600">Content will be added here</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AdminDashboard
