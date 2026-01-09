export const AUTH_LOGOUT_EVENT = "auth:logout";

export const dispatchLogout = (reason?: string) => {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT, { detail: { reason } }));
};
