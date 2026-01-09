import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chatApi'

export function ChatBox() {
    const [prompt, setPrompt] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const sendMessageMutation = useMutation({
        mutationFn: chatApi.sendMessage,
        onSuccess: () => {
            setPrompt('')
            queryClient.invalidateQueries({ queryKey: ['history'] })
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return
        sendMessageMutation.mutate({ prompt: prompt.trim() })
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message..."
                className="input-field flex-1"
                disabled={sendMessageMutation.isPending}
            />
            <button
                type="submit"
                disabled={sendMessageMutation.isPending || !prompt.trim()}
                className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {sendMessageMutation.isPending ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                )}
            </button>
        </form>
    )
}
