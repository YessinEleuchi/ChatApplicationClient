import { ChatBox } from '../domains/chat/ui/ChatBox'
import { HistoryList } from '../domains/chat/ui/HistoryList'
import { useAuthStore } from '../domains/auth/store/authStore'
import { useNavigate } from 'react-router-dom'

export function ChatPage() {
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex flex-col p-4 md:p-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-white bg-clip-text text-transparent">
                        ChatApplication
                    </h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </header>

            {/* Chat Container */}
            <main className="flex-1 card p-6 flex flex-col max-w-4xl mx-auto w-full">
                <HistoryList />
                <div className="pt-4 border-t border-white/10 mt-4">
                    <ChatBox />
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-white/30 text-sm mt-6">
                Powered by Yessine Eleuchi
            </footer>
        </div>
    )
}
