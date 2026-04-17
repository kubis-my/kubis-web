import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@repo/shadcn-ui/providers/auth-provider';
import { ApolloProvider } from '@repo/shadcn-ui/providers/apollo-provider';
import { SocketProvider } from '@repo/shadcn-ui/providers/socket-provider';
import ExchangeCodeForToken from '@repo/shadcn-ui/guards/exchange-code-for-token';
import { Suspense } from 'react';
import { Toaster } from '@repo/shadcn-ui/components/sonner';
import { env } from '@repo/commons/constant/env';

const SOCKET_URL = env.NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL.replace(/\/graphql\/?$/, '');

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Kubis Ops',
    description: 'Process Management System',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Suspense fallback={null}>
                    <ExchangeCodeForToken>
                        <ApolloProvider>
                            <AuthProvider>
                                <SocketProvider url={SOCKET_URL}>{children}</SocketProvider>
                            </AuthProvider>
                        </ApolloProvider>
                    </ExchangeCodeForToken>
                </Suspense>
                <Toaster />
            </body>
        </html>
    );
}
