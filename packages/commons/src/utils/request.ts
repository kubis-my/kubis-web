export const getDefaultHeaders = (endpoints: string[]) => {
    const sources = [
        "'self'",
        ...endpoints
            .filter(Boolean)
            .map(val => new URL(val).origin)
    ]

    // In development, allow webpack HMR
    if (process.env.NODE_ENV === "development") {
        sources.push("ws://localhost:*");
        sources.push("http://localhost:*");
    }

    // Script CSP - allow inline scripts for Next.js
    const scriptSrc = process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" // Dev: Allow for Next.js hot reload
        : "script-src 'self' 'unsafe-inline'"; // Production: Allow inline scripts

    return [
        {
            source: "/:path*",
            headers: [
                {
                    key: "X-DNS-Prefetch-Control",
                    value: "on",
                },
                {
                    key: "Strict-Transport-Security",
                    value: "max-age=63072000; includeSubDomains; preload",
                },
                {
                    key: "X-Frame-Options",
                    value: "SAMEORIGIN",
                },
                {
                    key: "X-Content-Type-Options",
                    value: "nosniff",
                },
                {
                    key: "X-XSS-Protection",
                    value: "1; mode=block",
                },
                {
                    key: "Referrer-Policy",
                    value: "strict-origin-when-cross-origin",
                },
                {
                    key: "Permissions-Policy",
                    value: "camera=(), microphone=(), geolocation=()",
                },
                {
                    // Content Security Policy to prevent XSS attacks
                    key: "Content-Security-Policy",
                    value: [
                        "default-src 'self'",
                        scriptSrc,
                        "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-components/CSS-in-JS
                        "img-src 'self' data: https:",
                        "font-src 'self' data:",
                        `connect-src ${sources.join(" ")}`,
                        "frame-ancestors 'self'",
                        "base-uri 'self'",
                        "form-action 'self'",
                    ].join("; "),
                },
            ],
        },
    ];
}