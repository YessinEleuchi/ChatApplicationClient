import { ChatBox } from "../domains/chat/components/ChatBox"
import { HistoryList } from "../domains/chat/components/HistoryList"
import { useAuthStore } from '../domains/auth/store/authStore'
import { useNavigate } from 'react-router-dom'
import Tanit from '../shared/ui/images/Tanit.svg'
import { AuthFooter } from "../shared/ui/components/AuthFooter"

export function ChatPage() {
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-950 via-black to-primary-900">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            </div>

            {/* Subtle Noise Texture */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6 md:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 p-3 shadow-lg backdrop-blur-sm border border-white/20">
                                <img
                                    src={Tanit}
                                    alt="Tanit Logo"
                                    className="h-full w-full object-contain drop-shadow-md"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    Tanit
                                </h1>
                                <p className="text-white/60 text-sm">Your intelligent companion</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className={[
                                "px-5 py-3 rounded-xl font-medium text-sm transition-all",
                                "bg-white/10 backdrop-blur-md border border-white/20 text-white",
                                "hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5",
                                "active:translate-y-0 active:shadow-md",
                                "flex items-center gap-2",
                            ].join(" ")}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Chat Container */}
                <main className="flex-1 px-6 md:px-8 pb-6 animate-slide-up">
                    <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                        <div className="flex-1 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
                            {/* Messages Area */}
                            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                                <HistoryList />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-white/10 px-6 md:px-8 py-6 bg-white/5 backdrop-blur-xl">
                                <ChatBox />
                            </div>
                        </div>
                    </div>
                </main>

                <AuthFooter />
            </div>
        </div>
    )
}