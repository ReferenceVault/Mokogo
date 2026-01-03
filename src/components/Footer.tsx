import { Link } from 'react-router-dom'
import Logo from './Logo'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://www.instagram.com/getmokogo/', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Twitter, href: 'https://x.com/getmokogo', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: 'https://linkedin.com/company/mokogo', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-white via-orange-50/30 to-orange-50/50 border-t border-orange-200/50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Logo, content, and Social media icons */}
          <div className="md:col-span-2">
            <div className="transform transition-transform hover:scale-105 duration-300 inline-block">
              <Logo />
            </div>
            <p className="text-sm text-gray-700 mt-4 leading-relaxed max-w-sm">
              India's safest flatmate platform. Find your perfect match without brokers.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-10 h-10 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center text-gray-600 transition-all duration-300 hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg hover:scale-110 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Column 2: For Seekers */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-base relative inline-block">
              For Seekers
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/explore" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Browse Rooms</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/safety-tips" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Safety Tips</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: For Listers */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-base relative inline-block">
              For Listers
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/auth" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">List Your Space</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Verification Process</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Premium Features</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-5 text-base relative inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/about-us" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">How It Works</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-orange-500 transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-orange-200/50 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
              <Link 
                to="/privacy-policy" 
                className="text-gray-600 hover:text-orange-500 transition-all duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/terms-of-service" 
                className="text-gray-600 hover:text-orange-500 transition-all duration-300 relative group"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/cookie-policy" 
                className="text-gray-600 hover:text-orange-500 transition-all duration-300 relative group"
              >
                Cookie Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/help-centre" 
                className="text-gray-600 hover:text-orange-500 transition-all duration-300 relative group"
              >
                Help Center
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
            <p className="text-gray-600 font-medium">
              © 2025 <span className="text-orange-500 font-bold">MOKOGO</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
