// Auth types
export interface RegisterRequest {
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
}

export interface RegisterResponse {
    id: string
    email: string
    message: string
}

export interface RefreshRequest {
    refreshToken: string
}

// Chat types
export interface ChatRequest {
    prompt: string
}

export interface ChatResponse {
    id: string
    prompt: string
    response: string
    timestamp: string
}

export interface Message {
    id: string
    prompt: string
    response: string
    timestamp: string
}

// Error types
export interface ApiError {
    status: number
    message: string
    timestamp: string
}
