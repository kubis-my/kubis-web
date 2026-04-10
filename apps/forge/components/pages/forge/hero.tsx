'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
            <div className="flex max-w-3xl flex-col items-center gap-6">
                <h1 className="text-5xl leading-tight font-bold text-foreground md:text-6xl">
                    Build First, Subscribe When Ready
                </h1>
                <p className="text-xl text-muted-foreground">
                    Custom business systems built around your workflow. We build your core MVP
                    first. Once it is ready for real production use, you move into a monthly
                    subscription.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
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
