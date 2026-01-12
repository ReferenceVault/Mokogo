import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mokogo-access-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Remove Content-Type for FormData - browser will set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('mokogo-refresh-token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('mokogo-access-token', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('mokogo-refresh-token', newRefreshToken)
          }
          error.config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          localStorage.removeItem('mokogo-access-token')
          localStorage.removeItem('mokogo-refresh-token')
          window.location.href = '/auth'
        }
      } else {
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        window.location.href = '/auth'
      }
    }
    return Promise.reject(error)
  }
)

export interface SignupRequest {
  name: string
  email: string
  phoneNumber: string
  password: string
  termsAccepted: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    email: string
    name?: string
    roles: string[]
  }
}

export interface SignupResponse {
  message: string
  userId: string
  email: string
  name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/auth/signup', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('mokogo-access-token')
    localStorage.removeItem('mokogo-refresh-token')
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data)
    return response.data
  },

  getGoogleAuthUrl: async (): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>('/auth/google/url')
    return response.data
  },

  googleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google/callback', {
      code,
    })
    return response.data
  },
}

// Listing API interfaces
export interface CreateListingRequest {
  title?: string
  city?: string
  locality?: string
  societyName?: string
  bhkType?: string
  roomType?: string
  rent?: number
  deposit?: number
  moveInDate?: string
  furnishingLevel?: string
  bathroomType?: string
  flatAmenities?: string[]
  societyAmenities?: string[]
  preferredGender?: string
  description?: string
  photos?: string[]
  status?: 'draft' | 'live' | 'archived' | 'fulfilled'
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

export interface ListingResponse {
  _id: string
  id: string
  title: string
  ownerId: string
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

export const listingsApi = {
  create: async (data: CreateListingRequest): Promise<ListingResponse> => {
    const response = await api.post<ListingResponse>('/listings', data)
    return response.data
  },

  getAll: async (status?: string): Promise<ListingResponse[]> => {
    const params = status ? { status } : {}
    try {
      const response = await api.get<ListingResponse[]>('/listings', { 
        params,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })
      console.log('API response status:', response.status)
      console.log('API response data:', response.data)
      console.log('API response data type:', Array.isArray(response.data) ? 'array' : typeof response.data)
      return response.data || []
    } catch (error: any) {
      console.error('Error in getAll API call:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  getAllPublic: async (status?: string): Promise<ListingResponse[]> => {
    const params = status ? { status } : {}
    try {
      // Use axios directly for public endpoint (no auth token needed)
      const response = await axios.get<ListingResponse[]>(`${API_BASE_URL}/listings/public`, { 
        params,
      })
      return response.data || []
    } catch (error: any) {
      console.error('Error in getAllPublic API call:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  getById: async (id: string): Promise<ListingResponse> => {
    const response = await api.get<ListingResponse>(`/listings/${id}`)
    return response.data
  },

  update: async (id: string, data: UpdateListingRequest): Promise<ListingResponse> => {
    const response = await api.patch<ListingResponse>(`/listings/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`)
  },
}

export const uploadApi = {
  uploadPhotos: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    // Use api instance to get automatic token handling and refresh
    // The interceptor will automatically remove Content-Type for FormData
    const response = await api.post<{ urls: string[] }>(
      '/upload/photos',
      formData
    )
    return response.data.urls
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<{ url: string }>(
      '/upload/profile-image',
      formData
    )
    return response.data.url
  },
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  phoneNumber?: string
  profileImageUrl?: string
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

export interface UpdateProfileRequest {
  name?: string
  phoneNumber?: string
  profileImageUrl?: string
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

export const usersApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/profile/me')
    return response.data
  },

  updateMyProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('/users/profile/me', data)
    return response.data
  },
}

// Request API interfaces
export interface CreateRequestRequest {
  listingId: string
  message?: string
  moveInDate?: string
}

export interface RequestResponse {
  _id: string
  id: string
  listingId: string | { _id: string; title: string; city: string; locality: string; photos?: string[] }
  ownerId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  requesterId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  message?: string
  moveInDate?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface UpdateRequestRequest {
  status: 'pending' | 'approved' | 'rejected'
}

export const requestsApi = {
  create: async (data: CreateRequestRequest): Promise<RequestResponse> => {
    const response = await api.post<RequestResponse>('/requests', data)
    return response.data
  },

  getAllForOwner: async (status?: string): Promise<RequestResponse[]> => {
    const params = status ? { status } : {}
    const response = await api.get<RequestResponse[]>('/requests/owner', { params })
    return response.data || []
  },

  getAllForRequester: async (status?: string): Promise<RequestResponse[]> => {
    const params = status ? { status } : {}
    const response = await api.get<RequestResponse[]>('/requests/requester', { params })
    return response.data || []
  },

  getById: async (id: string): Promise<RequestResponse> => {
    const response = await api.get<RequestResponse>(`/requests/${id}`)
    return response.data
  },

  update: async (id: string, data: UpdateRequestRequest): Promise<RequestResponse> => {
    const response = await api.patch<RequestResponse>(`/requests/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`)
  },
}

// Message API interfaces
export interface ConversationResponse {
  _id: string
  id: string
  user1Id: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  user2Id: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  listingId: string | { _id: string; title: string; city: string; locality: string; photos?: string[] }
  lastMessageId?: string | MessageResponse
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  unreadCount?: number
}

export interface MessageResponse {
  _id: string
  id: string
  conversationId: string
  senderId: string | { _id: string; name: string; email: string; profileImageUrl?: string }
  text: string
  isRead: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMessageRequest {
  conversationId: string
  text: string
}

export const messagesApi = {
  getAllConversations: async (): Promise<ConversationResponse[]> => {
    const response = await api.get<ConversationResponse[]>('/messages/conversations')
    return response.data || []
  },

  getConversationById: async (id: string): Promise<ConversationResponse> => {
    const response = await api.get<ConversationResponse>(`/messages/conversations/${id}`)
    return response.data
  },

  getMessages: async (conversationId: string): Promise<MessageResponse[]> => {
    const response = await api.get<MessageResponse[]>(`/messages/conversations/${conversationId}/messages`)
    return response.data || []
  },

  sendMessage: async (conversationId: string, text: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(`/messages/conversations/${conversationId}/messages`, {
      conversationId,
      text,
    })
    return response.data
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    await api.post(`/messages/conversations/${conversationId}/read`)
  },

  clearMessages: async (conversationId: string): Promise<void> => {
    await api.delete(`/messages/conversations/${conversationId}/messages`)
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/messages/conversations/${conversationId}`)
  },
}

export default api

