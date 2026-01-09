import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../domains/auth/store/authStore";
import { authApi } from "../../domains/auth/api/authApi";
import { dispatchLogout } from "../events/authEvents";

const API_BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

let isRefreshing = false;

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : token && p.resolve(token)));
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const url = originalRequest.url ?? "";
        if (url.includes("/auth/refresh")) {
            dispatchLogout("refresh_unauthorized");
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAuthStore.getState().refreshToken;

        // No refresh token => logout
        if (!refreshToken) {
            isRefreshing = false;
            dispatchLogout("missing_refresh_token");
            return Promise.reject(error);
        }

        try {
            const { accessToken: newAccessToken, refreshToken: returnedRefreshToken } =
                await authApi.refresh(refreshToken);

            // Update tokens (store)
            useAuthStore.getState().setTokens(newAccessToken, returnedRefreshToken);

            // Retry queued requests
            processQueue(null, newAccessToken);

            // Retry original request
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as Error, null);
            dispatchLogout("refresh_failed");
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
export default apiClient;