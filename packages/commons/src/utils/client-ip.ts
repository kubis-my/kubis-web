/**
 * Extracts the client's IP address from an Elysia request context
 * Checks Cloudflare's CF-Connecting-IP first (most reliable behind Cloudflare),
 * then falls back to X-Forwarded-For and X-Real-IP.
 */
export function getClientIP(request: Request): string | undefined {
    // CF-Connecting-IP is set by Cloudflare to the real visitor IP (most reliable)
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        return cfConnectingIP.trim();
    }

    // Check X-Forwarded-For header (set by proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // X-Forwarded-For can contain multiple IPs (client, proxy1, proxy2, ...)
        // The first IP is the original client
        return forwardedFor.split(',')[0]!.trim();
    }

    // Check X-Real-IP header (alternative used by some proxies)
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    return undefined;
}

/**
 * Extracts device and client information from request headers
 * Returns headers that should be forwarded to the backend
 */
export function getDeviceHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    // User-Agent contains browser, OS, and device information
    const userAgent = request.headers.get('user-agent');
    if (userAgent) {
        headers['User-Agent'] = userAgent;
    }

    // Accept-Language contains user's language preferences
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        headers['Accept-Language'] = acceptLanguage;
    }

    // Origin header (useful for CORS and tracking request source)
    const origin = request.headers.get('origin');
    if (origin) {
        headers['Origin'] = origin;
    }

    // Referer header (useful for tracking navigation flow)
    const referer = request.headers.get('referer');
    if (referer) {
        headers['Referer'] = referer;
    }

    return headers;
}

/**
 * Creates headers object with X-Forwarded-For set to the client's IP
 * and includes device/client information headers
 * If the request already has X-Forwarded-For, it appends the new IP to the chain
 */
export function createForwardedHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    // Add client IP
    const clientIP = getClientIP(request);
    if (clientIP) {
        const existingForwardedFor = request.headers.get('x-forwarded-for');

        // If there's an existing X-Forwarded-For, append to it (proxy chain)
        // Otherwise, just use the client IP
        const forwardedFor = existingForwardedFor
            ? `${existingForwardedFor}, ${clientIP}`
            : clientIP;

        headers['X-Forwarded-For'] = forwardedFor;

        // Forward as a custom header that Cloudflare will not overwrite on the
        // outbound Next.js → BE leg. The BE should check this first.
        headers['x-real-client-ip'] = clientIP;
    }

    // Add device and client information headers
    const deviceHeaders = getDeviceHeaders(request);
    Object.assign(headers, deviceHeaders);

    return headers;
}
