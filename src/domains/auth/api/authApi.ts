import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RegisterResponse
} from '../../../shared/types'
import {rawClient} from '../../../shared/api/client'

export const authApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const res = await rawClient.post<RegisterResponse>("/auth/register", data);
        return res.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await rawClient.post<AuthResponse>("/auth/login", data);
        return res.data;
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const res = await rawClient.post<AuthResponse>("/auth/refresh", { refreshToken });
        return res.data;
    },
}
