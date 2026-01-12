import React from 'react'

interface UserAvatarProps {
  user?: {
    name?: string
    profileImageUrl?: string
  } | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBorder?: boolean
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '',
  showBorder = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }
  
  const sizeClass = sizeClasses[size] || sizeClasses.md
  const initial = user?.name?.[0]?.toUpperCase() || 'U'
  const imageUrl = user?.profileImageUrl

  // Use custom background if provided, otherwise default to orange-100
  const bgClass = className.includes('bg-') ? '' : 'bg-orange-100'
  const baseClasses = `${sizeClass} rounded-full ${bgClass} flex items-center justify-center overflow-hidden ${className}`
  const borderClass = showBorder ? 'border-2 border-orange-200' : ''
  const textColorClass = className.includes('text-white') ? 'text-white' : 'text-orange-600'

  return (
    <div className={`${baseClasses} ${borderClass}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={user?.name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show initial
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('span')) {
              const span = document.createElement('span')
              span.className = `${textColorClass} font-semibold`
              span.textContent = initial
              parent.appendChild(span)
            }
          }}
        />
      ) : (
        <span className={`${textColorClass} font-semibold`}>
          {initial}
        </span>
      )}
    </div>
  )
}

export default UserAvatar

