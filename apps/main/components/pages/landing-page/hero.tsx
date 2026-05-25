import React from 'react';
import Image from 'next/image';
import { IconTool, IconRoute, IconBuildingStore } from '@tabler/icons-react';
import { Card, CardDescription, CardTitle } from '@repo/shadcn-ui/components/card';
import HeroCta from './hero-cta';

export default function Hero() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-16 bg-[#ecf0f1] px-6 pt-16 text-center md:pt-0 dark:bg-gray-950">
            <div className="flex flex-col items-center">
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
                <HeroCta />
            </div>
            {/* Features Grid */}
            <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                <Card>
                    <div className="flex flex-col items-center px-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950">
                            <IconTool className="h-6 w-6 text-[#4CAF50]" />
                        </div>
                        <CardTitle className="mb-1.5">Tailored to Your Workflow</CardTitle>
                        <CardDescription>
                            Systems built around how your business actually operates. Not generic
                            templates forced onto your process.
                        </CardDescription>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col items-center px-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950">
                            <IconRoute className="h-6 w-6 text-[#4CAF50]" />
                        </div>
                        <CardTitle className="mb-1.5">End-to-End Operations</CardTitle>
                        <CardDescription>
                            From intake to fulfillment, manage your entire business process in one
                            connected workspace.
                        </CardDescription>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col items-center px-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950">
                            <IconBuildingStore className="h-6 w-6 text-[#4CAF50]" />
                        </div>
                        <CardTitle className="mb-1.5">Built for Growing Businesses</CardTitle>
                        <CardDescription>
                            Purpose built tools for growing businesses ready to move beyond
                            spreadsheets and manual processes.
                        </CardDescription>
                    </div>
                </Card>
            </div>
        </main>
    );
}
