import { Gauge, ServerCog, ShieldCheck, Workflow } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type WhyItWorksProps = {
    content: ForgeContent['whyItWorks'];
};

const ICONS = [ShieldCheck, Gauge, Workflow, ServerCog];

export default function WhyItWorks({ content }: WhyItWorksProps) {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                    {content.reasons.map((reason, index) => {
                        const Icon = ICONS[index % ICONS.length]!;

                        return (
                            <div
                                key={reason.title}
                                className="rounded-2xl border border-gray-200 bg-[#ecf0f1]/50 p-7 transition-colors hover:border-[#4CAF50]/40 dark:border-gray-800 dark:bg-gray-950/50"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4CAF50]/12 text-[#4CAF50]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                                    {reason.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {reason.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
