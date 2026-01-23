import {LoginForm}  from "../domains/auth/forms/LoginForm"
import {AuthFooter} from "../shared/ui/components/AuthFooter.tsx";

export function LoginPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-950 via-black to-primary-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
            </div>
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">

                {/* Form Card */}
                <div className="w-full max-w-md animate-slide-up">
                    <LoginForm />
                </div>

                <AuthFooter />
            </div>
        </div>
    )
}