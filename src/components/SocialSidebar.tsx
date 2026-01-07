import { useEffect, useState } from 'react'
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

interface SocialSidebarProps {
  position?: 'left' | 'right'
}

const SocialSidebar = ({ position = 'left' }: SocialSidebarProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in after a delay (only for left side, right side shows immediately)
    if (position === 'left') {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [position])

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/getmokogo', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/getmokogo/', label: 'Instagram' },
    { icon: Twitter, href: 'https://x.com/getmokogo', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/mokogo', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  const isRight = position === 'right'
  const positionClasses = isRight 
    ? 'right-0 rounded-l-xl' 
    : 'left-0 rounded-r-xl'
  
  const animationClasses = isRight
    ? 'translate-x-0' // Right side always visible
    : isVisible 
      ? 'translate-x-0' 
      : '-translate-x-full'

  return (
    <div 
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1 bg-white shadow-lg overflow-hidden transition-transform duration-700 ease-out ${animationClasses}`}
    >
      <div className="bg-orange-400 text-white px-3 py-2 text-xs font-medium text-center">
        <span 
          className="writing-mode-vertical block" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Connect
        </span>
      </div>
      {socialLinks.map((social, index) => {
        const Icon = social.icon
        return (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-slate-500 hover:text-orange-400 hover:bg-orange-50 transition-colors duration-300"
            aria-label={social.label}
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}

export default SocialSidebar

