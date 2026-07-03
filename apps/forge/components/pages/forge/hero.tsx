'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import KubisSvg from '@repo/shadcn-ui/custom-components/kubis-svg';
import { scrollToSection } from '@repo/commons/utils/dom';
import { IconArrowRight } from '@tabler/icons-react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type HeroProps = {
    content: ForgeContent['hero'];
};

export default function Hero({ content }: HeroProps) {
    return (
        <section className="relative overflow-hidden bg-[#ecf0f1] px-6 pt-20 pb-20 md:pt-28 md:pb-28 dark:bg-gray-950">
            {/* Ambient accent glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-[440px] w-[760px] rounded-full bg-[#4CAF50]/10 blur-[150px]" />
            </div>
            {/* Soft grid texture */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />

            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wide text-[#2e7d32] shadow-sm backdrop-blur-sm dark:bg-gray-900/70 dark:text-[#81c784]">
                    <KubisSvg className="h-4 w-4" />
                    {content.badge}
                </span>

                <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance text-gray-900 sm:text-5xl md:text-6xl md:leading-[1.05] dark:text-white">
                    {content.title}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    {content.description}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        asChild
                        className="bg-[#4CAF50] shadow-sm hover:bg-[#43A047]"
                    >
                        <Link href="/projects/new">{content.primaryCta}</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="bg-white/70 backdrop-blur-sm">
                        <Link
                            href="#how-it-works"
                            onClick={(e) => scrollToSection(e, 'how-it-works')}
                        >
                            {content.secondaryCta}
                        </Link>
                    </Button>
                </div>

                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">{content.trustLine}</p>

                {/* Model at a glance: Build MVP -> Validate -> Production */}
                <div className="mt-14 flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    {content.flow.map((step, index) => (
                        <div key={step} className="flex items-center gap-3 sm:flex-1">
                            <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-left shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4CAF50]/12 text-xs font-semibold text-[#2e7d32] dark:text-[#81c784]">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {step}
                                </span>
                            </div>
                            {index < content.flow.length - 1 && (
                                <ChevronRight className="hidden h-5 w-5 shrink-0 text-gray-400 sm:block dark:text-gray-600" />
                            )}
                        </div>
                    ))}
                </div>

                <Link
                    href="/projects"
                    className="mt-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                >
                    {content.dashboardCta}
                    <IconArrowRight className="size-3.5" />
                </Link>
            </div>
        </section>
    );
}
