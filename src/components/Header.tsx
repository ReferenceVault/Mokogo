import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Header = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  return (
    <header className="bg-white border-b border-mokogo-gray">
      <div className="max-w-7xl mx-auto px-16 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Logo />
        
        {/* Middle section with Menu items */}
        <nav className="flex items-center gap-8">
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors ${
              isActive('/explore') || isActive('/city')
                ? 'text-mokogo-primary font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find Rooms
          </Link>
          <Link 
            to="/auth" 
            className={`text-sm font-medium transition-colors ${
              isActive('/auth') || isActive('/listing') || isActive('/dashboard')
                ? 'text-mokogo-primary font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List Your Room
          </Link>
        </nav>

        {/* Right section with Log in and List a Room buttons */}
        <div className="flex items-center gap-4">
          <Link 
            to="/auth" 
            className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-md"
          >
            Log in
          </Link>
          <Link 
            to="/auth" 
            className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-500 transition-colors flex items-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            List a Room
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
