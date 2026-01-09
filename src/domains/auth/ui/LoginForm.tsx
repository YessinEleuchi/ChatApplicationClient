import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'

export function LoginForm() {
    const navigate = useNavigate()
    const setTokens = useAuthStore((state) => state.setTokens)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setTokens(data.accessToken, data.refreshToken)
            navigate('/chat')
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        loginMutation.mutate({ email, password })
    }

    return (
        <div className="card p-8 w-full max-w-md animate-slide-up">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-white/60 mt-2">Sign in to continue chatting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white/80">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-white/80">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <p className="text-center text-white/60 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-300 hover:text-primary-200 font-medium transition-colors">
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    )
}
