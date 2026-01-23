import { useState, useEffect } from 'react'

interface DateOfBirthSelectorProps {
  value: string // YYYY-MM-DD format
  onChange: (value: string) => void
  error?: string
  className?: string
}

const DateOfBirthSelector = ({ value, onChange, error, className = '' }: DateOfBirthSelectorProps) => {
  const [year, setYear] = useState<string>('')
  const [month, setMonth] = useState<string>('')
  const [day, setDay] = useState<string>('')

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-')
      setYear(y || '')
      setMonth(m || '')
      setDay(d || '')
    } else {
      setYear('')
      setMonth('')
      setDay('')
    }
  }, [value])

  // Generate year options (from current year down to 100 years ago)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i).filter(y => y <= currentYear)

  // Month names
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  // Get days in month (handles leap years)
  const getDaysInMonth = (yearVal: string, monthVal: string): number => {
    if (!yearVal || !monthVal) return 31
    const y = parseInt(yearVal, 10)
    const m = parseInt(monthVal, 10)
    return new Date(y, m, 0).getDate()
  }

  // Generate day options based on selected month and year
  const daysInMonth = getDaysInMonth(year, month)
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    return String(dayNum).padStart(2, '0')
  })

  // Update parent when any field changes
  const handleYearChange = (newYear: string) => {
    setYear(newYear)
    updateDate(newYear, month, day)
  }

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth)
    // Adjust day if current day is invalid for new month
    const daysInNewMonth = getDaysInMonth(year, newMonth)
    const adjustedDay = day && parseInt(day, 10) > daysInNewMonth 
      ? String(daysInNewMonth).padStart(2, '0')
      : day
    setDay(adjustedDay)
    updateDate(year, newMonth, adjustedDay)
  }

  const handleDayChange = (newDay: string) => {
    setDay(newDay)
    updateDate(year, month, newDay)
  }

  const updateDate = (y: string, m: string, d: string) => {
    if (y && m && d) {
      const dateString = `${y}-${m}-${d}`
      // Validate that date is not in the future
      const selectedDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10))
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      
      if (selectedDate <= today) {
        onChange(dateString)
      } else {
        // Don't update if date is in future
        onChange('')
      }
    } else {
      onChange('')
    }
  }

  const baseSelectClass = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Month */}
      <select
        value={month}
        onChange={(e) => handleMonthChange(e.target.value)}
        className={`flex-1 ${baseSelectClass}`}
      >
        <option value="">Month</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Day */}
      <select
        value={day}
        onChange={(e) => handleDayChange(e.target.value)}
        className={`flex-1 ${baseSelectClass}`}
        disabled={!month}
      >
        <option value="">Day</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {parseInt(d, 10)}
          </option>
        ))}
      </select>

      {/* Year */}
      <select
        value={year}
        onChange={(e) => handleYearChange(e.target.value)}
        className={`flex-1 ${baseSelectClass}`}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateOfBirthSelector
