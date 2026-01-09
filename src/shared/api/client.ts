import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../domains/auth/store/authStore'

const API_BASE_URL = 'http://localhost:8080'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Flag to prevent multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: Error) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else if (token) {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

// Request interceptor - attach access token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If not 401 or already retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                    }
                    return apiClient(originalRequest)
                })
                .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = useAuthStore.getState().refreshToken

        if (!refreshToken) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(error)
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
            })

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)

            processQueue(null, newAccessToken)

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            }

            return apiClient(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError as Error, null)
            useAuthStore.getState().logout()
            window.location.href = '/login'
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)
export default apiClient