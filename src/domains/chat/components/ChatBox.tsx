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

    const isPending = sendMessageMutation.isPending
    const canSend = prompt.trim().length > 0 && !isPending

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-3 max-w-4xl mx-auto"
        >
            {/* Glassmorphic Input */}
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask Tanit anything..."
                    disabled={isPending}
                    className={[
                        "w-full px-6 py-4 pr-14 rounded-2xl",
                        "bg-white/10 backdrop-blur-xl border border-white/20",
                        "text-white placeholder:text-white/40",
                        "focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-400/60",
                        "transition-all duration-300",
                        "shadow-xl",
                        isPending && "opacity-75 cursor-not-allowed",
                    ].join(" ")}
                    aria-label="Message input"
                />

                {/* Optional: subtle inner glow on focus */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none ring-4 ring-transparent focus-within:ring-primary-500/20 transition" />
            </div>

            {/* Send Button */}
            <button
                type="submit"
                disabled={!canSend}
                aria-label={isPending ? "Sending..." : "Send message"}
                className={[
                    "relative p-4 rounded-2xl transition-all duration-300",
                    "bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg",
                    "hover:from-primary-400 hover:to-primary-300 hover:shadow-xl hover:-translate-y-1",
                    "active:translate-y-0 active:shadow-md",
                    "focus:outline-none focus:ring-4 focus:ring-primary-500/40",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg",
                ].join(" ")}
            >
                {isPending ? (
                    <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <svg
                        className="h-6 w-6 -rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                )}
            </button>
        </form>
    )
}