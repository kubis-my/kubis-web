import { Boxes, FileSpreadsheet, MessagesSquare, Puzzle } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type PainPointsProps = {
    content: ForgeContent['painPoints'];
};

const ICONS = [Boxes, MessagesSquare, FileSpreadsheet, Puzzle];

export default function PainPoints({ content }: PainPointsProps) {
    return (
        <section className="border-t border-gray-200 bg-white px-6 py-20 md:py-28 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {content.items.map((item, index) => {
                        const Icon = ICONS[index % ICONS.length]!;

                        return (
                            <div
                                key={item.title}
                                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#ecf0f1]/60 p-6 dark:border-gray-800 dark:bg-gray-950/60"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#4CAF50] shadow-sm dark:bg-gray-900">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
