import { ChevronDown } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type FaqProps = {
    content: ForgeContent['faq'];
};

export default function Faq({ content }: FaqProps) {
    return (
        <section
            id="faq"
            className="scroll-mt-16 bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950"
        >
            <div className="mx-auto max-w-3xl">
                <div className="text-center">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                </div>

                <div className="mt-12 flex flex-col gap-3">
                    {content.items.map((faq) => (
                        <details
                            key={faq.question}
                            className="group rounded-2xl border border-gray-200 bg-white px-6 shadow-sm transition-colors open:border-[#4CAF50]/30 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-gray-900 [&::-webkit-details-marker]:hidden dark:text-white">
                                {faq.question}
                                <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-[#4CAF50]" />
                            </summary>
                            <p className="pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
