import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@repo/shadcn-ui/providers/auth-provider";
import { ApolloProvider } from "@repo/shadcn-ui/providers/apollo-provider";
import ExchangeCodeForToken from "@repo/shadcn-ui/guards/exchange-code-for-token";
import { Suspense } from "react";
import { ACCOUNT_SVC_GRAPHQL_URL } from "@repo/commons/constant/base";
import { Toaster } from "@repo/shadcn-ui/components/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KUBIS",
  description: "Your unified workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ExchangeCodeForToken>
            <ApolloProvider uri={ACCOUNT_SVC_GRAPHQL_URL}>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ApolloProvider>
          </ExchangeCodeForToken>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
