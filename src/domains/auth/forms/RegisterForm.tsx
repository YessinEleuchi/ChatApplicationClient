import { useId, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import Tanit from "../../../shared/ui/images/Tanit.svg";

export function RegisterForm() {
    const navigate = useNavigate();

    const emailId = useId();
    const passwordId = useId();
    const confirmPasswordId = useId();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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

    const confirmError = useMemo(() => {
        if (!confirmPassword || !password) return null;
        return password === confirmPassword ? null : "Passwords do not match.";
    }, [password, confirmPassword]);

    const canSubmit =
        !emailError &&
        !passwordError &&
        !confirmError &&
        email.trim() &&
        password &&
        confirmPassword;

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2500);
        },
        onError: (err: any) => {
            setFormError(
                err?.response?.data?.message ||
                "Registration failed. Please try again."
            );
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!canSubmit) return;

        registerMutation.mutate({ email: email.trim(), password });
    };

    // Success State
    if (success) {
        return (
            <div className="w-full max-w-md mx-auto px-4 sm:px-0">
                <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg
                            className="w-12 h-12 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                        Account Created!
                    </h2>
                    <p className="text-white/70 text-lg">
                        Redirecting you to login...
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="h-1 w-32 bg-primary-500/30 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-primary-400 origin-left animate-progress" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
            {/* Glassmorphic Card */}
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
                                Create Account
                            </h1>
                            <p className="mt-1 text-white/70 text-base">
                                Join us and start chatting
                            </p>
                        </div>
                    </div>

                    {/* Global Error */}
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
                        {/* Email */}
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

                        {/* Password */}
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
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
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
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor={confirmPasswordId}
                                className="block text-sm font-semibold text-white/90"
                            >
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    id={confirmPasswordId}
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className={[
                                        "w-full px-5 py-4 pr-14 rounded-2xl bg-white/10 border text-white placeholder:text-white/40",
                                        "focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-200",
                                        confirmError
                                            ? "border-red-500/60 focus:border-red-500/80"
                                            : "border-white/20 focus:border-primary-400/60",
                                    ].join(" ")}
                                    aria-invalid={!!confirmError}
                                    aria-describedby={confirmError ? `${confirmPasswordId}-err` : undefined}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                            </div>
                            {confirmError && (
                                <p
                                    id={`${confirmPasswordId}-err`}
                                    className="text-sm text-red-300 font-medium"
                                    aria-live="polite"
                                >
                                    {confirmError}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={registerMutation.isPending || !canSubmit}
                            className={[
                                "w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-200",
                                "bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg",
                                "hover:from-primary-400 hover:to-primary-300 hover:shadow-xl hover:-translate-y-0.5",
                                "active:translate-y-0 active:shadow-md",
                                "focus:outline-none focus:ring-4 focus:ring-primary-500/40",
                                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg",
                            ].join(" ")}
                        >
                            {registerMutation.isPending ? (
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
                  Creating account...
                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Footer */}
                        <p className="text-center text-white/70 pt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-primary-300 hover:text-primary-200 underline-offset-4 hover:underline transition"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}