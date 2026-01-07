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

export default api

