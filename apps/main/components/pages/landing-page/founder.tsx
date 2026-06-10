import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

const STACK = [
    'NestJS',
    'ReactJS',
    'PostgreSQL',
    'Docker',
    'CI/CD',
    'Multi-Tenant Architecture',
    'System Integrations',
    'Transportation Management Systems',
    'Business Operations Systems',
    'Workflow Automation',
    'Custom Enterprise Solutions',
];

export default function Founder() {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        Behind KUBIS
                    </span>
                    <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        Built and maintained by one engineer who's shipped this kind of software
                        before.
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        KUBIS is founder-led and engineering-first. It's built by a software engineer
                        with 5+ years of professional experience building production SaaS, the kind
                        with real users, real uptime requirements and real architecture behind it.
                    </p>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        That includes multi-tenant systems, transportation and operations platforms,
                        workflow automation and custom enterprise solutions, the exact problems
                        KUBIS is built to solve. No outsourced roadmap. No committee. Just an
                        engineer building the software ecosystem they wish their clients already had.
                    </p>

                    <Link
                        href="/author"
                        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#4CAF50] underline-offset-4 hover:underline"
                    >
                        Meet the founder
                        <IconArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    <blockquote className="rounded-2xl border-l-2 border-[#4CAF50] bg-[#ecf0f1]/60 p-6 text-base leading-relaxed font-medium text-gray-800 sm:text-lg dark:bg-gray-950/50 dark:text-gray-200">
                        “Most businesses don't need more software. They need the right software,
                        built for how they actually work. That's what KUBIS is for.”
                    </blockquote>

                    <div>
                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                            Stack &amp; domain
                        </span>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {STACK.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-md border border-gray-200 bg-[#ecf0f1]/60 px-2.5 py-1 font-mono text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-950/50 dark:text-gray-400"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
