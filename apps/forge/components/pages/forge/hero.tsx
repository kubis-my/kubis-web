'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
            <div className="flex max-w-3xl flex-col items-center gap-6">
                <h1 className="text-5xl leading-tight font-bold text-gray-900 md:text-6xl dark:text-white">
                    Build First, Subscribe When Ready
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Custom business systems built around your workflow. We build your core MVP
                    first. Once it is ready for real production use, you move into a monthly
                    subscription.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="#">Book a Discovery Call</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#how-it-works">See How the MVP Process Works</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
