import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';
export const runtime = 'nodejs';
export const alt = 'KUBIS: A Modular Business Software Ecosystem';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    const logoData = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png'));
    const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

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
                <img
                    src={logoSrc}
                    width={220}
                    height={220}
                    style={{ objectFit: 'contain' }}
                />
                <div style={{ fontSize: 32, color: '#4b5563', marginTop: 24 }}>
                    A Modular Business Software Ecosystem
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
