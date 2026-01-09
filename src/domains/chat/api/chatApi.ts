import { apiClient } from '../../../shared/api/client'
import type { ChatRequest, ChatResponse, Message } from '../../../shared/types'

export const chatApi = {
    sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post<ChatResponse>('/chat', data)
        return response.data
    },

    getHistory: async (): Promise<Message[]> => {
        const response = await apiClient.get<Message[]>('/chat/history')
        return response.data
    },
}
