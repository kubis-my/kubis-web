import Link from 'next/link';
import { IconArrowUpRight } from '@tabler/icons-react';
import { FORGE_APP_BASE_URL, OPS_APP_BASE_URL } from '@repo/commons/constant/base';

const PRODUCTS = [
    {
        name: 'Forge',
        status: 'Available',
        comingSoon: false,
        tagline: 'Custom business systems, built around how you actually work.',
        description:
            "Some workflows don't fit off-the-shelf software, so Forge builds the system around them. Custom internal tools and business systems engineered to your operations, with the architecture of a real SaaS product behind it: multi-tenant, secure and built to last.",
        bestFor: 'Businesses told “no software does exactly what we need.”',
        href: FORGE_APP_BASE_URL || '/explore-apps',
        accent: '#4CAF50',
    },
    {
        name: 'Ops',
        status: 'In development',
        comingSoon: true,
        tagline: 'From order to production, in one connected workflow.',
        description:
            'Ops manages the journey of every order, from the moment it comes in to the moment it ships. Replace the spreadsheets, status calls and “where is this?” messages with a single workflow every team can see.',
        bestFor: 'Manufacturing and operations teams managing order-to-production flow.',
        href: OPS_APP_BASE_URL || '/explore-apps',
        accent: '#6366f1',
    },
];

export default function ProductEcosystem() {
    return (
        <section
            id="ecosystem"
            className="scroll-mt-16 border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900"
        >
            <div className="mx-auto max-w-6xl">
                <div className="max-w-3xl">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        The applications
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        A growing ecosystem of business software.
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        Forge is live today, with Ops in active development and more on the way. Each
                        application solves a real operational problem end-to-end. The ecosystem is expanding, every new application is built on the same
                        foundation, so when it ships, it's already part of your KUBIS.
                    </p>
                </div>

                {/* Live products */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {PRODUCTS.map((p) => (
                        <article
                            key={p.name}
                            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-[#ecf0f1]/50 p-6 transition-colors hover:border-gray-300 sm:p-8 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-700"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <span
                                    className="text-2xl font-bold tracking-tight"
                                    style={{ color: p.accent }}
                                >
                                    {p.name}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: p.accent }}
                                    />
                                    {p.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {p.tagline}
                            </h3>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {p.description}
                            </p>

                            <p className="mt-5 text-xs text-gray-500 dark:text-gray-500">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    Best for:
                                </span>{' '}
                                {p.bestFor}
                            </p>

                            {p.comingSoon ? (
                                <Link
                                    href="/explore-apps"
                                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 underline-offset-4 hover:underline dark:text-gray-400"
                                >
                                    Preview {p.name}
                                    <IconArrowUpRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={p.href}
                                    className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                                    style={{ color: p.accent }}
                                >
                                    Explore {p.name}
                                    <IconArrowUpRight className="h-4 w-4" />
                                </Link>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
