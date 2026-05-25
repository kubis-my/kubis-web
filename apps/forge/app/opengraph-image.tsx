import { ImageResponse } from 'next/og';

export const alt = 'Kubis Forge - Build First, Subscribe When Ready';
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
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: 80,
                        fontWeight: 800,
                        color: '#ffffff',
                        letterSpacing: '-2px',
                        lineHeight: 1,
                    }}
                >
                    Kubis Forge
                </div>
                <div style={{ fontSize: 30, color: '#4CAF50', marginTop: 20 }}>
                    Build First, Subscribe When Ready
                </div>
                <div style={{ fontSize: 22, color: '#6b7280', marginTop: 12 }}>
                    Custom business systems built around your workflow
                </div>
            </div>
        ),
        { ...size }
    );
}
