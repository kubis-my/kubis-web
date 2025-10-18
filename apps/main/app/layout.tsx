import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@repo/shadcn-ui/providers/auth-provider";
import ExchangeCodeForToken from "@repo/shadcn-ui/guards/exchange-code-for-token";
import { Suspense } from "react";

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
            <AuthProvider>
              {children}
            </AuthProvider>
          </ExchangeCodeForToken>
        </Suspense>
      </body>
    </html>
  );
}
