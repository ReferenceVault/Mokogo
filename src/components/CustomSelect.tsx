import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Option {
  value: string
  label: string
  group?: string
}

interface CustomSelectProps {
  label?: string
  value: string
  onValueChange?: (value: string) => void
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: string
}

const CustomSelect = ({ 
  label, 
  value, 
  onValueChange, 
  onChange, 
  options, 
  placeholder = 'Select...', 
  className = '', 
  disabled = false,
  error 
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        })
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  const selectedOption = options.find(opt => opt.value === value)
  const handleChange = onValueChange || onChange || (() => {})

  const handleSelect = (optionValue: string) => {
    handleChange(optionValue)
    setIsOpen(false)
  }

  // Group options by group if they have groups
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'default'
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(option)
    return acc
  }, {} as Record<string, Option[]>)

  const hasGroups = Object.keys(groupedOptions).length > 1 && Object.keys(groupedOptions)[0] !== 'default'

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative z-[9999]">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300 appearance-none cursor-pointer text-stone-900 font-medium text-left flex items-center justify-between ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/50' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={selectedOption ? 'text-stone-900' : 'text-stone-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu - Rendered via Portal */}
        {isOpen && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-stone-200/50 overflow-hidden animate-[fadeIn_0.2s_ease-out_forwards]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            <div className="py-2 max-h-60 overflow-y-auto overflow-x-hidden">
              {hasGroups ? (
                Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    {group !== 'default' && (
                      <div className="px-4 py-2 text-xs font-semibold text-stone-500 uppercase">
                        {group}
                      </div>
                    )}
                    {groupOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`w-full px-4 py-2.5 text-left text-stone-700 hover:bg-orange-50 transition-colors duration-150 my-1 rounded-lg ${
                          value === option.value ? 'bg-orange-100 text-orange-600 font-medium' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-stone-700 hover:bg-orange-50 transition-colors duration-150 my-1 rounded-lg ${
                      value === option.value ? 'bg-orange-100 text-orange-600 font-medium' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default CustomSelect

