import { useState } from 'react'
import Logo from './Logo'
import UserAvatar from './UserAvatar'
import { Search, Bell, Heart as HeartIcon } from 'lucide-react'

interface DashboardHeaderProps {
  activeView?: string
  onViewChange?: (view: string) => void
  menuItems?: Array<{
    label: string
    view: string
  }>
  userName?: string
  userEmail?: string
  userImageUrl?: string
  onProfile?: () => void
  onLogout?: () => void
}

const DashboardHeader = ({
  activeView = 'overview',
  onViewChange,
  menuItems = [],
  userName = 'User',
  userEmail = '',
  userImageUrl,
  onProfile,
  onLogout
}: DashboardHeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <div className="transform transition-transform duration-300 hover:scale-105">
              <Logo />
            </div>
            
            {/* Middle section with Menu items */}
            {menuItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-8">
                {menuItems.map((item) => (
                  <button 
                    key={item.view}
                    onClick={() => onViewChange?.(item.view)}
                    className="relative group"
                  >
                    <span className={`text-sm font-medium transition-all duration-300 ${
                      activeView === item.view
                        ? 'text-orange-500 font-semibold' 
                        : 'text-gray-600 group-hover:text-orange-500'
                    }`}>
                      {item.label}
                    </span>
                    {activeView === item.view && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Right section with Search, Notifications, and User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-white/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <Search className="w-4 h-4 text-orange-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search listings, areas..." 
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64 focus:placeholder-gray-300" 
              />
            </div>
            
            <button className="relative p-2.5 text-gray-600 hover:text-orange-500 transition-all duration-300 hover:bg-orange-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <button className="p-2.5 text-gray-600 hover:text-orange-500 transition-all duration-300 hover:bg-orange-50 rounded-lg">
              <HeartIcon className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <UserAvatar 
                    user={{ name: userName, profileImageUrl: userImageUrl }}
                    size="md"
                    showBorder={false}
                    className="shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
                  />
                </div>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-200/50 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-orange-100">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  {onProfile && (
                    <button
                      onClick={() => {
                        onProfile()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      Profile
                    </button>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      Log out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}

export default DashboardHeader

