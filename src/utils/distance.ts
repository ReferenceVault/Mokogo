import { Listing } from '@/types'

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Sort listings by distance from a reference point
 * Listings with coordinates are sorted by distance (closest first)
 * Listings without coordinates are placed at the end
 * @param listings - Array of listings to sort
 * @param referenceLat - Latitude of reference point
 * @param referenceLng - Longitude of reference point
 * @returns Sorted array of listings
 */
export const sortListingsByDistance = (
  listings: Listing[],
  referenceLat: number,
  referenceLng: number
): Listing[] => {
  return [...listings].sort((a, b) => {
    // Only listings with coordinates can be sorted by distance
    if (a.latitude && a.longitude && b.latitude && b.longitude) {
      const distanceA = calculateDistance(
        referenceLat,
        referenceLng,
        a.latitude,
        a.longitude
      )
      const distanceB = calculateDistance(
        referenceLat,
        referenceLng,
        b.latitude,
        b.longitude
      )
      return distanceA - distanceB // Sort ascending (closest first)
    }
    // Listings without coordinates go to the end
    if (a.latitude && a.longitude) return -1
    if (b.latitude && b.longitude) return 1
    return 0
  })
}

/**
 * Check if a listing is within a specified radius (in km) from a reference point
 * @param listing - Listing to check
 * @param referenceLat - Latitude of reference point
 * @param referenceLng - Longitude of reference point
 * @param radiusKm - Radius in kilometers (default: 10km)
 * @returns true if listing is within radius, false otherwise
 */
export const isListingWithinRadius = (
  listing: Listing,
  referenceLat: number,
  referenceLng: number,
  radiusKm: number = 10
): boolean => {
  if (!listing.latitude || !listing.longitude) {
    return false
  }
  const distance = calculateDistance(
    referenceLat,
    referenceLng,
    listing.latitude,
    listing.longitude
  )
  return distance <= radiusKm
}
