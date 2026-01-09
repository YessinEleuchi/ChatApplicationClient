import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGOUT_EVENT } from "../shared/events/authEvents";
import { useAuthStore } from "../domains/auth/store/authStore";

export default function AuthEventListener() {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => {
            // 1) clear store
            useAuthStore.getState().logout();
            // 2) redirect without full reload
            navigate("/login", { replace: true });
        };

        window.addEventListener(AUTH_LOGOUT_EVENT, handler);
        return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
    }, [navigate]);

    return null;
}
