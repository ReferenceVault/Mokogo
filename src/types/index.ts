export interface User {
  id: string
  phone: string
  email: string
  name?: string
  profileImageUrl?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
  occupation?: string
  companyName?: string
  currentCity?: string
  area?: string
  about?: string
  smoking?: string
  drinking?: string
  foodPreference?: string
}

export interface Listing {
  id: string
  title: string
  city: string
  locality: string
  societyName?: string
  bhkType: string
  roomType: string
  rent: number
  deposit: number
  moveInDate: string
  furnishingLevel: string
  bathroomType?: string
  flatAmenities: string[]
  societyAmenities: string[]
  preferredGender: string
  description?: string
  photos: string[]
  status: 'draft' | 'live' | 'archived' | 'fulfilled'
  createdAt: string
  updatedAt: string
}

export interface Request {
  id: string
  listingId: string
  seekerId: string
  seekerName: string
  seekerAvatar?: string
  seekerAge?: number
  seekerGender?: string
  seekerOccupation?: string
  seekerCity?: string
  introMessage: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  requestedAt: string
  desiredMoveInDate?: string
  contactRevealed: boolean
  seekerPhone?: string
  seekerEmail?: string
}
