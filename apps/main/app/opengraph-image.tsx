import { ImageResponse } from 'next/og';

export const alt = 'KUBIS - Your Unified Workspace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#ecf0f1',
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
                        fontSize: 100,
                        fontWeight: 800,
                        color: '#111827',
                        letterSpacing: '-4px',
                        lineHeight: 1,
                    }}
                >
                    KUBIS
                </div>
                <div style={{ fontSize: 32, color: '#4b5563', marginTop: 20 }}>
                    Your Unified Workspace
                </div>
                <div
                    style={{
                        width: 64,
                        height: 5,
                        background: '#4CAF50',
                        marginTop: 28,
                        borderRadius: 3,
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
