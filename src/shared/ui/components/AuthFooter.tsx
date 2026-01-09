export function AuthFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/40 text-sm">
            © {currentYear} Tanit. All rights reserved.
        </footer>
    );
}