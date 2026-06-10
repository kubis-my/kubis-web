import Link from 'next/link';
import { IconArrowUpRight, IconCheck } from '@tabler/icons-react';
import { FORGE_APP_BASE_URL, OPS_APP_BASE_URL } from '@repo/commons/constant/base';
import { cn } from '@repo/shadcn-ui/lib/utils';

type App = {
    name: string;
    badge: string;
    status: string;
    title: string;
    description: string;
    bullets: string[];
    href: string;
    comingSoon: boolean;
    gradient: string;
    accent: string;
};

const APPS: App[] = [
    {
        name: 'Forge',
        badge: 'Custom business systems',
        status: 'Available',
        title: 'Custom systems built around how you actually work.',
        description:
            "Some workflows don't fit off-the-shelf software, so Forge builds the system around them. We scope your core MVP first; once it's production-ready, you move into a flexible monthly plan. No upfront lock-in.",
        bullets: [
            'Scoped MVP delivery before any subscription',
            'Flexible monthly plan once you go live',
            'Multi-tenant, secure architecture, the standard of a real SaaS product',
            'Built specifically for your business processes and scales with your team',
        ],
        href: FORGE_APP_BASE_URL || '/author',
        comingSoon: false,
        gradient: 'from-green-600 via-emerald-600 to-teal-500',
        accent: '#4CAF50',
    },
    {
        name: 'Ops',
        badge: 'Order-to-production workflow',
        status: 'In development',
        title: 'Collect orders. Trigger production. Ship.',
        description:
            'Ops manages the journey of every order, from intake to fulfillment. Collect orders into campaign buckets, trigger production when the threshold is met and track every order through a configurable production workflow, all in one place.',
        bullets: [
            'Campaign-based order batching with threshold and deadline tracking',
            'Configurable workflow builder: stages, roles, and checklists per product',
            'Production board sorted by shipping date so deadlines are never missed',
            'Full order lifecycle from pre-order intake to fulfillment and refunds',
        ],
        href: OPS_APP_BASE_URL || '/author',
        comingSoon: true,
        gradient: 'from-blue-900 via-indigo-800 to-violet-700',
        accent: '#6366f1',
    },
];

export default function AppShowcase() {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-20 md:gap-28">
                {APPS.map((app, i) => (
                    <article
                        key={app.name}
                        className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14"
                    >
                        {/* Content */}
                        <div className={cn('flex flex-col', i % 2 === 1 && 'md:order-2')}>
                            <div className="flex items-center gap-3">
                                <span
                                    className="text-2xl font-bold tracking-tight"
                                    style={{ color: app.accent }}
                                >
                                    {app.name}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#ecf0f1]/60 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-300">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: app.accent }}
                                    />
                                    {app.status}
                                </span>
                            </div>

                            <span className="mt-4 text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                {app.badge}
                            </span>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                {app.title}
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                {app.description}
                            </p>

                            <ul className="mt-6 flex flex-col gap-3">
                                {app.bullets.map((point) => (
                                    <li
                                        key={point}
                                        className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <IconCheck
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            style={{ color: app.accent }}
                                        />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                {app.comingSoon ? (
                                    <Link
                                        href="/author"
                                        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
                                    >
                                        Get early access
                                        <IconArrowUpRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={app.href}
                                        target={app.href.startsWith('http') ? '_blank' : undefined}
                                        rel={
                                            app.href.startsWith('http')
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className="inline-flex w-fit items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
                                        style={{ backgroundColor: app.accent }}
                                    >
                                        Open {app.name}
                                        <IconArrowUpRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Visual */}
                        <div
                            className={cn(
                                'relative hidden h-64 w-full overflow-hidden rounded-2xl bg-linear-to-br md:block md:h-[360px]',
                                app.gradient,
                                i % 2 === 1 && 'md:order-1',
                            )}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <div className="h-64 w-64 rounded-full bg-white blur-3xl" />
                            </div>
                            <div className="absolute right-6 bottom-6">
                                <span className="text-6xl font-black tracking-tighter text-white/20 md:text-7xl">
                                    {app.name}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
