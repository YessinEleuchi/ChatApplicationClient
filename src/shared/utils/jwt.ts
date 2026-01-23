type JwtPayload = {
    sub?: string;
    email?: string;
    exp?: number;
    iat?: number;
};

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        // base64url -> base64
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );

        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function getUserIdFromAccessToken(token: string): string | null {
    return decodeJwt(token)?.sub ?? null;
}

export function getEmailFromAccessToken(token: string): string | null {
    return decodeJwt(token)?.email ?? null;
}
