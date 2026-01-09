import { apiClient } from '../../../shared/api/client'
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RegisterResponse
} from '../../../shared/types'

export const authApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/auth/register', data)
        return response.data
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data)
        return response.data
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
        return response.data
    },
}
