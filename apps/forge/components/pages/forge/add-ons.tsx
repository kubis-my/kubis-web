import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';
import { ROUTE } from '@/root/libs/constants';
import { AddOn, AddOnCategory } from '@repo/commons/types/forge-service-schema.type';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';

type AddOnsProps = {
    content: ForgeContent['addOns'];
    addons: AddOn[];
};

export default function AddOns({ content, addons }: AddOnsProps) {
    const standards = addons
        .filter((row) => row.category === AddOnCategory.STANDARD)
        .sort(bySortOrder);
    const optionals = addons
        .filter((row) => row.category === AddOnCategory.OPTIONAL)
        .sort(bySortOrder);

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
                    <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                </div>

                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {standards.map((item) => (
                        <div
                            key={item.publicId}
                            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#ecf0f1]/50 p-5 transition-colors hover:border-[#4CAF50]/40 dark:border-gray-800 dark:bg-gray-950/50"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4CAF50]/12 text-[#4CAF50]">
                                <Plus className="h-4 w-4" />
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.name}
                            </h3>
                        </div>
                    ))}
                </div>

                {optionals.length > 0 && (
                    <div className="mt-14">
                        <h3 className="mb-5 text-center text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            {content.optionalTitle}
                        </h3>
                        <ul className="flex flex-wrap justify-center gap-3">
                            {optionals.map((item) => (
                                <li
                                    key={item.publicId}
                                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                                >
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-gray-200 bg-[#ecf0f1]/60 p-8 text-center dark:border-gray-800 dark:bg-gray-950/60">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {content.noteTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.note}{' '}
                        <Link
                            href={ROUTE.FORGE.HOME}
                            className="font-medium text-[#2e7d32] underline underline-offset-2 hover:text-[#4CAF50] dark:text-[#81c784]"
                        >
                            {content.noteCta}
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
