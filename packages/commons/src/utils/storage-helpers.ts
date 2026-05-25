import {
    ACCESS_TOKEN_KEY,
    CODE_VERIFIER_KEY,
    OTP_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    SESSION_TOKEN_KEY,
} from '../constant/cookies-key';

export { ACCESS_TOKEN_KEY, CODE_VERIFIER_KEY, OTP_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_TOKEN_KEY };

export function getToken(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

export function setToken(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
}

export function clearToken(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
}

export function clearAllTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(OTP_TOKEN_KEY);
    localStorage.removeItem(CODE_VERIFIER_KEY);
}
