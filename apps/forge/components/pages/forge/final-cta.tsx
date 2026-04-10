'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';

export default function FinalCta() {
    return (
        <section className="bg-gray-900 px-6 py-24 text-center dark:bg-gray-950">
            <div className="mx-auto max-w-2xl">
                <h2 className="mb-4 text-4xl font-bold text-white">
                    Need a Custom System for Your Business?
                </h2>
                <p className="mb-10 text-lg text-gray-400">
                    Start with an MVP, validate the workflow, then move into production with a plan
                    that grows with your business.
                </p>
                <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                    <Link href="#">Let&apos;s Discuss Your Workflow</Link>
                </Button>
            </div>
        </section>
    );
}
