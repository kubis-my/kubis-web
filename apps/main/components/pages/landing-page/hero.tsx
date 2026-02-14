import React from 'react';
import Image from 'next/image';
import { Button } from '@repo/shadcn-ui/components/button';
import { Zap, Lock, Palette } from 'lucide-react';
import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/shadcn-ui/components/card';
import Link from 'next/link';

export default function Hero() {
    return (
        <main className="mx-auto max-w-6xl px-6 pt-32 pb-20 lg:px-8">
            {/* Hero Section */}
            <div className="mb-24 flex flex-col items-center text-center">
                <Image
                    src="/logo.png"
                    alt="KUBIS Logo"
                    width={160}
                    height={160}
                    className="h-32 w-32 md:h-40 md:w-40"
                />
                <h1 className="mb-6 text-6xl leading-tight font-bold text-gray-900 md:text-7xl dark:text-white">
                    Welcome to KUBIS
                </h1>
                <p className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                    Your unified workspace for productivity and collaboration. All your essential
                    tools in one place.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                        <Link href={SSO_APP_BASE_URL}>Get Started</Link>
                    </Button>
                    <Button size="lg" variant="secondary">
                        Explore Apps
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <Zap className="mb-4 h-10 w-10 text-[#4CAF50]" />
                        <CardTitle>Fast & Efficient</CardTitle>
                        <CardDescription>
                            Built for speed and performance. Access all your tools instantly without
                            any lag.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Lock className="mb-4 h-10 w-10 text-[#4CAF50]" />
                        <CardTitle>Secure & Private</CardTitle>
                        <CardDescription>
                            Your data is protected with enterprise-grade security and encryption.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Palette className="mb-4 h-10 w-10 text-[#4CAF50]" />
                        <CardTitle>Beautiful Design</CardTitle>
                        <CardDescription>
                            Modern, clean interface that adapts to your preferences and workflow.
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
                    <Button size="lg" className="bg-[#4CAF50] hover:bg-[#43A047]" asChild>
                        <Link href={SSO_APP_BASE_URL}>Sign In Now</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
