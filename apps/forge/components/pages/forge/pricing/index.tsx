import { Button } from '@repo/shadcn-ui/components/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';
import type { Plan } from '@repo/commons/types/forge-service-schema.type';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';

type PricingProps = {
    content: Pick<
        ForgeContent['pricing'],
        'eyebrow' | 'title' | 'subtitle' | 'trustLine' | 'cta' | 'monthLabel'
    >;
    plans: Plan[];
};

export default function Pricing({ content, plans }: PricingProps) {
    return (
        <section
            id="pricing"
            className="relative overflow-hidden bg-[#ecf0f1] px-6 py-20 md:py-28 dark:bg-gray-950"
        >
            {/* Ambient accent glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
                <div className="h-[380px] w-[680px] rounded-full bg-[#4CAF50]/10 blur-[150px]" />
            </div>

            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold tracking-widest text-[#4CAF50] uppercase">
                        {content.eyebrow}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-gray-900 md:text-4xl dark:text-white">
                        {content.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content.subtitle}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#4CAF50]/30 bg-white/70 px-4 py-1.5 text-xs font-medium text-[#2e7d32] shadow-sm backdrop-blur-sm dark:bg-gray-900/70 dark:text-[#81c784]">
                        {content.trustLine}
                    </span>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan) => {
                        const featured = Boolean(plan.badge);

                        return (
                            <div
                                key={plan.publicId}
                                className={`relative flex flex-col rounded-2xl bg-white p-7 transition-shadow dark:bg-gray-900 ${
                                    featured
                                        ? 'shadow-xl shadow-[#4CAF50]/10 ring-2 ring-[#4CAF50] lg:-mt-2 lg:mb-2'
                                        : 'border border-gray-200 shadow-sm hover:shadow-md dark:border-gray-800'
                                }`}
                            >
                                {plan.badge && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#4CAF50] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                        {plan.badge}
                                    </span>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {(plan.priceLabel ?? '').split('/')[0]}
                                        {plan.isCustomPricing === false && (
                                            <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                                                {content.monthLabel}
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="mb-8 flex flex-col gap-3">
                                    {[...(plan.features ?? [])].sort(bySortOrder).map((feature) => (
                                        <li key={feature.id} className="flex items-start gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {feature.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    variant={featured ? 'default' : 'outline'}
                                    className={`mt-auto w-full ${
                                        featured
                                            ? 'bg-[#4CAF50] shadow-sm hover:bg-[#43A047]'
                                            : ''
                                    }`}
                                >
                                    <Link href="/projects/new">{content.cta}</Link>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
