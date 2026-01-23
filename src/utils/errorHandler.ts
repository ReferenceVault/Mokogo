/**
 * Error handling utilities for API errors
 */

export interface ApiError {
  statusCode: number
  message: string | string[]
  timestamp?: string
  path?: string
  method?: string
}

/**
 * Error codes for specific business logic errors
 * These should match backend error messages for consistency
 */
export const ERROR_CODES = {
  LISTING_LIMIT: 'LISTING_LIMIT',
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
} as const

/**
 * Checks if an error is a listing limit error
 * Uses HTTP status code 400 and checks for listing limit indicators
 */
export const isListingLimitError = (error: any): boolean => {
  // Check HTTP status code first
  const statusCode = error?.response?.status || error?.statusCode
  if (statusCode !== 400) {
    return false
  }

  // Get error message from response
  const errorData = error?.response?.data || error
  const message = errorData?.message || errorData?.error || ''
  
  // Normalize message to string
  const messageStr = Array.isArray(message) ? message.join(' ') : String(message)
  
  // Check for listing limit indicators (centralized for easy maintenance)
  const listingLimitIndicators = [
    'already have an active listing',
    'active listing',
    'archive or fulfill',
  ]
  
  return listingLimitIndicators.some(indicator => 
    messageStr.toLowerCase().includes(indicator.toLowerCase())
  )
}

/**
 * Extracts error message from API error response
 */
export const getErrorMessage = (error: any): string => {
  const errorData = error?.response?.data || error
  const message = errorData?.message || errorData?.error || error?.message || 'An error occurred'
  
  if (Array.isArray(message)) {
    return message.join(', ')
  }
  
  return String(message)
}

/**
 * Gets error code from error response
 */
export const getErrorCode = (error: any): string | null => {
  if (isListingLimitError(error)) {
    return ERROR_CODES.LISTING_LIMIT
  }
  
  const statusCode = error?.response?.status || error?.statusCode
  if (statusCode === 401) {
    return ERROR_CODES.UNAUTHORIZED
  }
  if (statusCode === 404) {
    return ERROR_CODES.NOT_FOUND
  }
  if (statusCode === 400) {
    return ERROR_CODES.VALIDATION_ERROR
  }
  
  return null
}
