import { create } from "zustand";
import { getUserIdFromAccessToken, getEmailFromAccessToken } from "../../../shared/utils/jwt";

interface AuthState {
    userId: string | null;
    email: string | null;

    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    setTokens: (accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    hydrate: () => void;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const useAuthStore = create<AuthState>((set) => ({
    userId: null,
    email: null,

    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    setTokens: (accessToken: string, refreshToken?: string) => {
        const finalRefreshToken = refreshToken ?? localStorage.getItem(REFRESH_TOKEN_KEY);

        if (finalRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, finalRefreshToken);
        }
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

        const userId = getUserIdFromAccessToken(accessToken);
        const email = getEmailFromAccessToken(accessToken);

        set({
            userId,
            email,
            accessToken,
            refreshToken: finalRefreshToken,
            isAuthenticated: Boolean(accessToken && finalRefreshToken && userId),
        });
    },

    logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        set({
            userId: null,
            email: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    hydrate: () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!accessToken || !refreshToken) return;

        const userId = getUserIdFromAccessToken(accessToken);
        const email = getEmailFromAccessToken(accessToken);

        if (!userId) {
            // token corrupt / invalid -> clear
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            set({
                userId: null,
                email: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            });
            return;
        }

        set({
            userId,
            email,
            accessToken,
            refreshToken,
            isAuthenticated: true,
        });
    },
}));
