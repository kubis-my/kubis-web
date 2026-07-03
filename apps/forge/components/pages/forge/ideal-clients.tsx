import { Check } from 'lucide-react';
import { Button } from '@repo/shadcn-ui/components/button';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type IdealClientsProps = {
    content: ForgeContent['idealClients'];
    primaryCta: string;
};

export default function IdealClients({ content, primaryCta }: IdealClientsProps) {
    return (
        <section className="bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                    <Button
                        size="lg"
                        asChild
                        className="mt-8 bg-[#4CAF50] shadow-sm hover:bg-[#43A047]"
                    >
                        <Link href="/projects/new">{primaryCta}</Link>
                    </Button>
                </div>

                <ul className="flex flex-col gap-3">
                    {content.clients.map((client) => (
                        <li
                            key={client}
                            className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4CAF50]/12 text-[#4CAF50]">
                                <Check className="h-4 w-4" />
                            </span>
                            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                {client}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
