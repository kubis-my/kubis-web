import React from 'react'
import Image from "next/image";
import { Button } from '@repo/shadcn-ui/components/button';
import { Zap, Lock, Palette } from "lucide-react";
import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shadcn-ui/components/card';
import Link from 'next/link';

export default function Hero() {
    return (
        <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center mb-24">
                <Image
                    src="/logo.png"
                    alt="KUBIS Logo"
                    width={160}
                    height={160}
                    className="w-32 h-32 md:w-40 md:h-40"
                />
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    Welcome to KUBIS
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
                    Your unified workspace for productivity and collaboration. All your
                    essential tools in one place.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href={SSO_APP_BASE_URL}>Get Started</Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                    >
                        Explore Apps
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <Card>
                    <CardHeader>
                        <Zap className="w-10 h-10 mb-4 text-[#4CAF50]" />
                        <CardTitle>Fast & Efficient</CardTitle>
                        <CardDescription>
                            Built for speed and performance. Access all your tools instantly
                            without any lag.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Lock className="w-10 h-10 mb-4 text-[#4CAF50]" />
                        <CardTitle>Secure & Private</CardTitle>
                        <CardDescription>
                            Your data is protected with enterprise-grade security and
                            encryption.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Palette className="w-10 h-10 mb-4 text-[#4CAF50]" />
                        <CardTitle>Beautiful Design</CardTitle>
                        <CardDescription>
                            Modern, clean interface that adapts to your preferences and
                            workflow.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* CTA Section */}
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Ready to get started?</CardTitle>
                    <CardDescription className="text-lg">
                        Join thousands of users who trust KUBIS for their daily workflow
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button size="lg" className="bg-[#4CAF50] hover:bg-[#43A047]" asChild >
                        <Link href={SSO_APP_BASE_URL}>Sign In Now</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    )
}
