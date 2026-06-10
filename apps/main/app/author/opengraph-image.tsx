import { ImageResponse } from 'next/og';

export const alt = 'Muhammad Zarkashi Zuakafli — Senior Backend & Full-Stack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0a',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ color: '#4CAF50', fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
                    SENIOR BACKEND · FULL-STACK ENGINEER
                </div>
                <div
                    style={{
                        color: '#ffffff',
                        fontSize: 72,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginTop: 16,
                    }}
                >
                    Muhammad Zarkashi Zuakafli
                </div>
                <div style={{ color: '#9ca3af', fontSize: 30, marginTop: 24 }}>
                    NestJS · PostgreSQL · GraphQL · Multi-tenant SaaS · Kelantan, Malaysia
                </div>
                <div
                    style={{
                        width: 80,
                        height: 6,
                        background: '#4CAF50',
                        marginTop: 32,
                        borderRadius: 3,
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
