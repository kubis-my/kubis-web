export const getDefaultHeaders = (
    endpoints: string[],
    options?: { scriptSrc?: string[]; frameSrc?: string[]; frameAncestors?: string[] },
) => {
    const origins = endpoints.filter(Boolean).map((val) => new URL(val).origin);

    // Add wss:// variants for https:// origins (for WebSocket connections)
    const wsOrigins = origins
        .filter((origin) => origin.startsWith('https://'))
        .map((origin) => origin.replace('https://', 'wss://'));

    const sources = ["'self'", ...origins, ...wsOrigins];

    // In development, allow webpack HMR
    if (process.env.NODE_ENV === 'development') {
        sources.push('ws://localhost:*');
        sources.push('http://localhost:*');
    }

    // Script CSP - allow inline scripts for Next.js
    const scriptSrc = [
        "script-src 'self'",
        process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '', // Dev: Allow for Next.js hot reload
        "'unsafe-inline'",
        'https://static.cloudflareinsights.com',
        ...(options?.scriptSrc ?? []),
    ]
        .filter(Boolean)
        .join(' ');

    const frameSrc = options?.frameSrc?.length
        ? `frame-src 'self' ${options.frameSrc.join(' ')}`
        : null;

    const frameAncestors = options?.frameAncestors?.length
        ? `frame-ancestors 'self' ${options.frameAncestors.join(' ')}`
        : "frame-ancestors 'self'";

    return [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'X-DNS-Prefetch-Control',
                    value: 'on',
                },
                {
                    key: 'Strict-Transport-Security',
                    value: 'max-age=63072000; includeSubDomains; preload',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN',
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                },
                {
                    key: 'Permissions-Policy',
                    value: 'camera=(), microphone=(), geolocation=()',
                },
                {
                    // Content Security Policy to prevent XSS attacks
                    key: 'Content-Security-Policy',
                    value: [
                        "default-src 'self'",
                        scriptSrc,
                        "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-components/CSS-in-JS
                        "img-src 'self' data: https:",
                        "font-src 'self' data:",
                        `connect-src ${sources.join(' ')}`,
                        frameSrc,
                        frameAncestors,
                        "base-uri 'self'",
                        "form-action 'self'",
                    ]
                        .filter(Boolean)
                        .join('; '),
                },
            ],
        },
    ];
};
