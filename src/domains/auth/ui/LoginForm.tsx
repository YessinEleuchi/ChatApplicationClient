import { useId, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import Tanit from "../../../shared/ui/images/Tanit.svg";

export function LoginForm() {
    const navigate = useNavigate();
    const setTokens = useAuthStore((s) => s.setTokens);

    const emailId = useId();
    const passwordId = useId();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Client-side validation
    const emailError = useMemo(() => {
        if (!email) return null;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        return isValid ? null : "Please enter a valid email address.";
    }, [email]);

    const passwordError = useMemo(() => {
        if (!password) return null;
        return password.length >= 6 ? null : "Password must be at least 6 characters.";
    }, [password]);

    const canSubmit = !emailError && !passwordError && email.trim() && password;

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setTokens(data.accessToken, data.refreshToken);
            navigate("/chat", { replace: true });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please try again.";
            setFormError(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        loginMutation.mutate({ email: email.trim(), password });
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
            {/* Enhanced Glassmorphic Card */}
            <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="p-8 sm:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 p-3 shadow-lg backdrop-blur-sm border border-white/20">
                            <img
                                src={Tanit}
                                alt="Tanit Logo"
                                className="h-full w-full object-contain drop-shadow-md"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Welcome back
                            </h1>
                            <p className="mt-1 text-white/70 text-base">
                                Sign in to continue your conversation
                            </p>
                        </div>
                    </div>

                    {/* Global Error Alert */}
                    {formError && (
                        <div
                            className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/20 px-5 py-4 flex items-start gap-3 backdrop-blur-sm"
                            role="alert"
                            aria-live="assertive"
                        >
                            <div className="h-5 w-5 rounded-full bg-red-400/70 flex-shrink-0 mt-0.5" />
                            <p className="text-red-100 font-medium">{formError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor={emailId}
                                className="block text-sm font-semibold text-white/90"
                            >
                                Email address
                            </label>
                            <input
                                id={emailId}
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tanitai@gmail.com"
                                className={[
                                    "w-full px-5 py-4 rounded-2xl bg-white/10 border text-white placeholder:text-white/40",
                                    "focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-200",
                                    emailError
                                        ? "border-red-500/60 focus:border-red-500/80"
                                        : "border-white/20 focus:border-primary-400/60",
                                ].join(" ")}
                                aria-invalid={!!emailError}
                                aria-describedby={emailError ? `${emailId}-err` : undefined}
                                required
                            />
                            {emailError && (
                                <p
                                    id={`${emailId}-err`}
                                    className="text-sm text-red-300 font-medium"
                                    aria-live="polite"
                                >
                                    {emailError}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor={passwordId}
                                className="block text-sm font-semibold text-white/90"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id={passwordId}
                                    type={showPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className={[
                                        "w-full px-5 py-4 pr-14 rounded-2xl bg-white/10 border text-white placeholder:text-white/40",
                                        "focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-200",
                                        passwordError
                                            ? "border-red-500/60 focus:border-red-500/80"
                                            : "border-white/20 focus:border-primary-400/60",
                                    ].join(" ")}
                                    aria-invalid={!!passwordError}
                                    aria-describedby={passwordError ? `${passwordId}-err` : undefined}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
                                    aria-label={showPwd ? "Hide password" : "Show password"}
                                >
                                    {showPwd ? "Hide" : "Show"}
                                </button>
                            </div>
                            {passwordError && (
                                <p
                                    id={`${passwordId}-err`}
                                    className="text-sm text-red-300 font-medium"
                                    aria-live="polite"
                                >
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending || !canSubmit}
                            className={[
                                "w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-200",
                                "bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg",
                                "hover:from-primary-400 hover:to-primary-300 hover:shadow-xl hover:-translate-y-0.5",
                                "active:translate-y-0 active:shadow-md",
                                "focus:outline-none focus:ring-4 focus:ring-primary-500/40",
                                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg",
                            ].join(" ")}
                        >
                            {loginMutation.isPending ? (
                                <span className="flex items-center justify-center gap-3">
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
                  Signing in...
                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        {/* Footer Link */}
                        <p className="text-center text-white/70 pt-4">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="font-bold text-primary-300 hover:text-primary-200 underline-offset-4 hover:underline transition"
                            >
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}