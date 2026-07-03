import { Check, Plus } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type MvpScopeProps = {
    content: ForgeContent['mvpScope'];
};

export default function MvpScope({ content }: MvpScopeProps) {
    return (
        <section className="bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {/* Included in MVP */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#4CAF50]/25 bg-white p-8 shadow-sm dark:border-[#4CAF50]/20 dark:bg-gray-900">
                        <div className="absolute inset-x-0 top-0 h-1 bg-[#4CAF50]" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {content.includedTitle}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {content.includedNote}
                        </p>
                        <ul className="mt-6 flex flex-col gap-3.5">
                            {content.included.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4CAF50]/12 text-[#4CAF50]">
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Available after MVP */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gray-300 dark:bg-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {content.excludedTitle}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {content.excludedNote}
                        </p>
                        <ul className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                            {content.excluded.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                        <Plus className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
