import type { Listing } from '@/types'

export type FieldConfidence = 'high' | 'medium' | 'low'

export interface ListingParseResult {
  data: Partial<Listing>
  confidence: Record<string, FieldConfidence>
  missing: string[]
}

const KNOWN_CITIES = [
  'Pune',
  'Mumbai',
  'Hyderabad',
  'Bangalore',
  'Delhi',
  'Gurgaon',
  'Noida',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur'
]

const SOCIETY_AMENITIES = [
  { key: 'lift', label: 'Lift' },
  { key: 'security', label: '24×7 Security' },
  { key: 'gym', label: 'Gym' },
  { key: 'pool', label: 'Swimming Pool' },
  { key: 'parking', label: 'Parking' },
  { key: 'club', label: 'Clubhouse' },
]

const FLAT_AMENITIES = [
  { key: 'ac', label: 'Air Conditioning' },
  { key: 'wifi', label: 'WiFi' },
  { key: 'modular kitchen', label: 'Modular Kitchen' },
  { key: 'washing machine', label: 'Washing Machine' },
  { key: 'refrigerator', label: 'Refrigerator' },
  { key: 'fridge', label: 'Refrigerator' },
  { key: 'sofa', label: 'Sofa' },
]

const normalizeText = (text: string) =>
  text
    .replace(/\r\n/g, '\n')
    .replace(/[•·]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

const findCity = (text: string) => {
  const match = KNOWN_CITIES.find(city => new RegExp(`\\b${city}\\b`, 'i').test(text))
  return match || ''
}

const parseMoney = (value: string) => {
  const numeric = value.replace(/[^\d]/g, '')
  return numeric ? parseInt(numeric, 10) : 0
}

const detectAmenities = (text: string) => {
  const lower = text.toLowerCase()
  const societyAmenities = SOCIETY_AMENITIES
    .filter(item => lower.includes(item.key))
    .map(item => item.label)
  const flatAmenities = FLAT_AMENITIES
    .filter(item => lower.includes(item.key))
    .map(item => item.label)
  return { societyAmenities, flatAmenities }
}

const detectFurnishing = (text: string) => {
  const lower = text.toLowerCase()
  if (lower.includes('semi-furnished') || lower.includes('semi furnished')) return 'Semi-furnished'
  if (lower.includes('fully furnished')) return 'Fully Furnished'
  if (lower.includes('unfurnished')) return 'Unfurnished'
  return ''
}

const detectRoomType = (text: string) => {
  const lower = text.toLowerCase()
  if (lower.includes('master room')) return 'Master Room'
  if (lower.includes('private')) return 'Private Room'
  if (lower.includes('shared')) return 'Shared Room'
  if (lower.includes('flat') || /\b\d+\s*bhk\b/i.test(text)) return 'Private Room'
  return ''
}

const detectMoveInDate = (text: string) => {
  const lower = text.toLowerCase()
  if (lower.includes('immediate') || lower.includes('immediately') || lower.includes('asap') || lower.includes('ready to move')) {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
    return date.toISOString().split('T')[0]
  }
  return ''
}

export const parseListingFromText = (input: string): ListingParseResult => {
  const text = normalizeText(input)
  const confidence: Record<string, FieldConfidence> = {}

  const lines = input.split('\n').map(line => line.trim()).filter(Boolean)
  const title = lines[0] || text.split('. ')[0] || ''
  confidence.title = title ? 'high' : 'low'

  const bhkMatch = text.match(/\b(\d+)\s*BHK\b/i) || text.match(/\b(\d+)\s*bed(room)?s?\b/i)
  const bhkType = bhkMatch ? `${bhkMatch[1]}BHK` : ''
  confidence.bhkType = bhkType ? 'high' : 'low'

  const rentMatch =
    text.match(/rent\s*[:\-]?\s*₹?\s*([\d,]+)/i) ||
    text.match(/₹\s*([\d,]+)\s*(per\s*month|\/\s*month|monthly)/i) ||
    text.match(/₹\s*([\d,]+)/)
  const rent = rentMatch ? parseMoney(rentMatch[1]) : 0
  confidence.rent = rent ? 'high' : 'low'

  const depositMatch = text.match(/(deposit|security)\s*[:\-]?\s*₹?\s*([\d,]+)/i)
  const deposit = depositMatch ? parseMoney(depositMatch[2]) : 0
  confidence.deposit = deposit ? 'high' : 'low'

  const city = findCity(text)
  confidence.city = city ? 'medium' : 'low'

  let locality = ''
  let societyName = ''
  const locationMatch = input.match(/location\s*[:\-]\s*([^\n]+)/i)
  if (locationMatch) {
    const locationText = locationMatch[1].trim()
    const parts = locationText.split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 2) {
      societyName = parts[0]
      locality = parts[1]
    } else if (parts.length === 1) {
      locality = parts[0]
    }
  }
  confidence.locality = locality ? 'medium' : 'low'
  confidence.societyName = societyName ? 'medium' : 'low'

  const furnishingLevel = detectFurnishing(text)
  confidence.furnishingLevel = furnishingLevel ? 'medium' : 'low'

  const roomType = detectRoomType(text)
  confidence.roomType = roomType ? 'medium' : 'low'

  const moveInDate = detectMoveInDate(text)
  confidence.moveInDate = moveInDate ? 'medium' : 'low'

  const bathroomType = /attached/i.test(text)
    ? 'Attached'
    : /common/i.test(text)
      ? 'Common'
      : ''
  confidence.bathroomType = bathroomType ? 'low' : 'low'

  const preferredGender = /female|women|ladies/i.test(text)
    ? 'Female'
    : /male|men|boys/i.test(text)
      ? 'Male'
      : ''
  confidence.preferredGender = preferredGender ? 'low' : 'low'

  const { societyAmenities, flatAmenities } = detectAmenities(text)
  if (societyAmenities.length) confidence.societyAmenities = 'medium'
  if (flatAmenities.length) confidence.flatAmenities = 'medium'

  const description = input.trim()
  confidence.description = description ? 'high' : 'low'

  const data: Partial<Listing> = {
    title,
    city,
    locality,
    societyName,
    bhkType,
    roomType,
    rent,
    deposit,
    moveInDate,
    furnishingLevel,
    bathroomType,
    flatAmenities,
    societyAmenities,
    preferredGender,
    description,
  }

  const missing = [
    !city && 'city',
    !locality && 'locality',
    !bhkType && 'bhkType',
    !roomType && 'roomType',
    !rent && 'rent',
    !moveInDate && 'moveInDate',
    !furnishingLevel && 'furnishingLevel',
  ].filter(Boolean) as string[]

  return { data, confidence, missing }
}
