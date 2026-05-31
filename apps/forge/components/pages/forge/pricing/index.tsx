import { Badge } from '@repo/shadcn-ui/components/badge';
import { Check } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';
import type { Plan } from '@repo/commons/types/forge-service-schema.type';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';

type PricingProps = {
    content: Pick<ForgeContent['pricing'], 'title' | 'subtitle' | 'monthLabel'>;
    plans: Plan[];
};

export default function Pricing({ content, plans }: PricingProps) {
    return (
        <section id="pricing" className="px-6 py-16 md:py-24">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-foreground mb-4 text-center text-3xl font-bold md:text-4xl">
                    {content.title}
                </h2>
                <p className="text-muted-foreground mb-16 text-center">{content.subtitle}</p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.publicId}
                            className="border-border bg-card relative flex flex-col rounded-lg border p-8"
                        >
                            {plan.badge && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF50] hover:bg-[#43A047]">
                                    {plan.badge}
                                </Badge>
                            )}
                            <div className="mb-6">
                                <h3 className="text-foreground mb-1 text-xl font-semibold">
                                    {plan.name}
                                </h3>
                                <p className="text-foreground mb-3 text-3xl font-bold">
                                    {(plan.priceLabel ?? '').split('/')[0]}
                                    {plan.isCustomPricing === false && (
                                        <span className="text-muted-foreground text-base font-normal">
                                            {content.monthLabel}
                                        </span>
                                    )}
                                </p>
                                <p className="text-muted-foreground text-sm">{plan.description}</p>
                            </div>
                            <ul className="mb-6 flex flex-col gap-3">
                                {[...(plan.features ?? [])].sort(bySortOrder).map((feature) => (
                                    <li key={feature.id} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                        <span className="text-foreground/80 text-sm">
                                            {feature.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
