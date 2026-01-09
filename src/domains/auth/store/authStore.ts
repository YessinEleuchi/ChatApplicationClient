import { create } from 'zustand'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    setTokens: (accessToken: string, refreshToken?: string) => void
    logout: () => void
    hydrate: () => void
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    setTokens: (accessToken: string, refreshToken?: string) => {
        const finalRefreshToken =
            refreshToken ?? localStorage.getItem(REFRESH_TOKEN_KEY)

        if (finalRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, finalRefreshToken)
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

        set({
            accessToken,
            refreshToken: finalRefreshToken,
            isAuthenticated: Boolean(accessToken && finalRefreshToken),
        })
    },


    logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        })
    },

    hydrate: () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

        if (accessToken && refreshToken) {
            set({
                accessToken,
                refreshToken,
                isAuthenticated: true,
            })
        }
    },
}))
