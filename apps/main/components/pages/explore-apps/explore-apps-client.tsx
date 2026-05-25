'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft, IconArrowRight, IconArrowUpRight } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';

interface AppSlide {
    name: string;
    badge: string;
    title: string;
    description: string;
    bullets: string[];
    href: string | null;
    comingSoon: boolean;
    gradient: string;
    accentColor: string;
}

export default function ExploreAppsClient({ apps }: { apps: AppSlide[] }) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((i) => (i - 1 + apps.length) % apps.length);
    const next = () => setCurrent((i) => (i + 1) % apps.length);

    const app = apps[current];

    if (!app) return null;

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#ecf0f1] px-8 py-16 dark:bg-gray-950">
            <div className="w-full max-w-5xl">
                <div className="grid min-h-[480px] grid-cols-1 items-center gap-10 md:grid-cols-2">
                    {/* Left - content */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: app.accentColor }}
                            />
                            <span className="text-muted-foreground text-sm font-medium">
                                {app.badge}
                            </span>
                        </div>

                        <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight md:text-5xl">
                            {app.title}
                        </h1>

                        <p className="text-muted-foreground text-base leading-relaxed">
                            {app.description}
                        </p>

                        <ul className="flex flex-col gap-2">
                            {app.bullets.map((point) => (
                                <li
                                    key={point}
                                    className="text-muted-foreground flex items-start gap-2 text-sm"
                                >
                                    <span className="bg-muted-foreground/50 mt-1.5 h-1 w-1 shrink-0 rounded-full" />
                                    {point}
                                </li>
                            ))}
                        </ul>

                        {app.comingSoon ? (
                            <span className="border-border text-muted-foreground mt-2 w-fit rounded-md border px-3 py-1.5 text-xs font-medium">
                                Coming Soon
                            </span>
                        ) : app.href ? (
                            <Link
                                href={app.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                                style={{ color: app.accentColor }}
                            >
                                Open {app.name}
                                <IconArrowUpRight className="h-4 w-4" />
                            </Link>
                        ) : null}
                    </div>

                    {/* Right - visual */}
                    <div
                        className={cn(
                            'relative h-72 w-full overflow-hidden rounded-2xl bg-linear-to-br md:h-[380px]',
                            app.gradient,
                        )}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <div className="h-64 w-64 rounded-full bg-white blur-3xl" />
                        </div>
                        <div className="absolute right-6 bottom-6 flex flex-col items-end gap-1">
                            <span className="text-6xl font-black tracking-tighter text-white/20">
                                {app.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-10 flex items-center gap-4">
                    <button
                        onClick={prev}
                        className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                        <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={next}
                        className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                        <IconArrowRight className="h-4 w-4" />
                    </button>
                    <div className="flex gap-2">
                        {apps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    i === current
                                        ? 'bg-foreground w-6'
                                        : 'bg-muted-foreground/40 w-1.5',
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
