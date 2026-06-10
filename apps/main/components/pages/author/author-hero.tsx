'use client';

import Link from 'next/link';
import { scrollToSection } from '@repo/commons/utils/dom';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    IconMapPin,
    IconBrandLinkedin,
    IconBrandGithub,
    IconMail,
    IconExternalLink,
    IconArrowRight,
    IconServer,
    IconStack2,
    IconBolt,
    IconSettingsAutomation,
} from '@tabler/icons-react';

const buildCards = [
    { icon: IconServer, title: 'Backend Systems', desc: 'APIs, services & data layers' },
    { icon: IconStack2, title: 'SaaS Platforms', desc: 'Multi-tenant, production-grade' },
    { icon: IconBolt, title: 'Real-time Apps', desc: 'WebSocket & live workflows' },
    { icon: IconSettingsAutomation, title: 'DevOps Automation', desc: 'Docker, CI/CD pipelines' },
];

const trust = [
    '5+ Years Experience',
    '8+ Products Built',
    'Multi-tenant SaaS',
    'REST / GraphQL APIs',
    'Docker / CI-CD',
];

export default function AuthorHero() {
    return (
        <section className="relative overflow-hidden bg-[#ecf0f1] px-6 pt-20 pb-16 md:pt-28 md:pb-20 dark:bg-gray-950">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-[420px] w-[760px] rounded-full bg-[#4CAF50]/10 blur-[150px]" />
            </div>

            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left — identity & pitch */}
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#2e7d32] dark:text-[#81c784]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                            The founder behind KUBIS
                        </span>

                        <div className="mt-6 flex items-center gap-4">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 scale-110 rounded-full bg-linear-to-br from-[#4CAF50] to-teal-400 opacity-40 blur-md" />
                                <div className="relative h-16 w-16 rounded-full bg-linear-to-br from-[#4CAF50] to-emerald-600 p-0.5 shadow-lg">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#ecf0f1] dark:bg-gray-950">
                                        <span className="text-xl font-bold text-[#4CAF50]">MZZ</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Muhammad Zarkashi Zuakafli
                                </h2>
                                <span className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <IconMapPin className="h-4 w-4 text-[#4CAF50]" />
                                    Kelantan, Malaysia
                                </span>
                            </div>
                        </div>

                        <h1 className="mt-8 max-w-xl text-4xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                            Senior Backend Engineer &amp; Full-Stack Developer building{' '}
                            <span className="text-[#4CAF50]">production-ready SaaS.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-400">
                            Full-stack engineer from Kelantan, Malaysia with 5+ years building
                            production-grade NestJS &amp; PostgreSQL backends, RESTful and GraphQL
                            APIs, multi-tenant SaaS platforms, real-time workflows and business
                            automation tools. Available for remote work.
                        </p>

                        {/* Contact meta */}
                        <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                            <Link
                                href="mailto:zarkashi@kubis.my"
                                className="flex items-center gap-1.5 transition-colors hover:text-[#4CAF50]"
                            >
                                <IconMail className="h-4 w-4" />
                                Email
                            </Link>
                            <Link
                                href="https://github.com/kashi93"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 transition-colors hover:text-[#4CAF50]"
                            >
                                <IconBrandGithub className="h-4 w-4" />
                                GitHub
                                <IconExternalLink className="h-3 w-3 opacity-60" />
                            </Link>
                            <Link
                                href="https://linkedin.com/in/zarkashi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 transition-colors hover:text-[#4CAF50]"
                            >
                                <IconBrandLinkedin className="h-4 w-4" />
                                LinkedIn
                                <IconExternalLink className="h-3 w-3 opacity-60" />
                            </Link>
                        </div>

                        {/* CTAs */}
                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                                <Link
                                    href="#projects"
                                    onClick={(e) => scrollToSection(e, 'projects')}
                                >
                                    View Projects
                                    <IconArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link
                                    href="#contact"
                                    onClick={(e) => scrollToSection(e, 'contact')}
                                >
                                    Contact Me
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right — what I build */}
                    <div className="relative">
                        <div className="pointer-events-none absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br from-[#4CAF50]/20 via-transparent to-teal-400/10 blur-2xl" />
                        <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-6 shadow-xl backdrop-blur-md md:p-8 dark:border-gray-800 dark:bg-gray-900/60">
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                    What I build
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-[#4CAF50]">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4CAF50]" />
                                    Available
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {buildCards.map((card) => (
                                    <div
                                        key={card.title}
                                        className="group flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white/60 p-4 transition-colors hover:border-[#4CAF50]/40 dark:border-gray-800 dark:bg-gray-950/40"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] transition-colors group-hover:bg-[#4CAF50] group-hover:text-white">
                                            <card.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {card.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {card.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust strip */}
                <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3 lg:grid-cols-5 dark:border-gray-800 dark:bg-gray-800">
                    {trust.map((item) => (
                        <div
                            key={item}
                            className="bg-white px-4 py-5 text-center dark:bg-gray-900"
                        >
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
