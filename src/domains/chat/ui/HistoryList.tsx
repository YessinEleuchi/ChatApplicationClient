import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../api/chatApi'
import { useEffect, useRef } from 'react'

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function HistoryList() {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { data: messages, isLoading, error } = useQuery({
        queryKey: ['history'],
        queryFn: chatApi.getHistory,
        refetchInterval: 5000,
    })

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-white/60">Loading conversation...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-2">Failed to load messages</p>
                    <p className="text-white/40 text-sm">Please try refreshing the page</p>
                </div>
            </div>
        )
    }

    if (!messages?.length) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-white/80 font-medium mb-1">No messages yet</h3>
                    <p className="text-white/40 text-sm">Start a conversation by typing a message below</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
                <div key={message.id} className="space-y-3 animate-fade-in">
                    {/* User message */}
                    <div className="message-bubble message-user">
                        <p className="text-white">{message.prompt}</p>
                        <p className="text-xs text-white/50 mt-2">{formatTimestamp(message.timestamp)}</p>
                    </div>

                    {/* AI response */}
                    <div className="message-bubble message-ai">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-white/90">{message.response}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}
