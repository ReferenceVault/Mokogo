import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  min?: string
  placeholder?: string
}

const DatePicker = ({ value, onChange, min, placeholder = 'Select date' }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const minDate = min ? new Date(min) : null

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const handleDateSelect = (date: Date | null) => {
    if (!date) return
    
    if (minDate && date < minDate) return

    setSelectedDate(date)
    const dateString = date.toISOString().split('T')[0]
    onChange(dateString)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const isDisabled = (date: Date) => {
    return minDate && date < minDate
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className="relative z-50" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gradient-to-br from-white via-white to-orange-50/40 border-2 border-orange-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400 transition-all duration-200 shadow-md hover:shadow-lg hover:border-orange-400 text-gray-900 font-medium pl-12 cursor-pointer flex items-center"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {formatDisplayDate(value)}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-gradient-to-br from-white via-orange-50/20 to-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] border-2 border-orange-200/50 p-6 z-[9999] min-w-[360px] backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {monthNames[currentMonth.getMonth()]}
              </h3>
              <span className="text-xl font-bold text-gray-700">
                {currentMonth.getFullYear()}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-600 py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const disabled = isDisabled(date)
              const selected = isSelected(date)
              const isTodayDate = isToday(date)

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  disabled={disabled}
                  className={`
                    aspect-square rounded-xl text-sm font-semibold transition-all duration-200 relative
                    ${disabled
                      ? 'text-gray-300 cursor-not-allowed opacity-40'
                      : selected
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-400/40 scale-110 ring-2 ring-orange-300 ring-offset-2'
                        : isTodayDate
                          ? 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-bold border-2 border-orange-400 shadow-md hover:shadow-lg hover:scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100/50 hover:text-orange-600 hover:shadow-md hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {date.getDate()}
                  {selected && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-orange-100">
            <button
              onClick={() => {
                const todayStr = new Date().toISOString().split('T')[0]
                if (!minDate || new Date(todayStr) >= minDate) {
                  handleDateSelect(new Date())
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Today
            </button>
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate(null)
                  onChange('')
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
