/**
 * Formatter utility functions
 * Centralized formatting functions to avoid code duplication
 */

/**
 * Format a number as Indian currency (INR)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹15,000")
 */
export const formatRent = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format a number as price (Indian number format, no currency symbol)
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "15,000")
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

/**
 * Format a date string to a readable format (e.g., "15 January 2024")
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Format a date string to a relative time (e.g., "2 hours ago", "3 days ago")
 * Falls back to formatted date if older than 7 days
 * @param dateString - ISO date string
 * @returns Relative time string or formatted date
 */
export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
