import { Badge } from '@repo/shadcn-ui/components/badge';
import { Check } from 'lucide-react';
import type { ForgeContent } from '@/root/libs/i18n/forge-content';

type PricingProps = {
    content: ForgeContent['pricing'];
};

export default function Pricing({ content }: PricingProps) {
    return (
        <section id="pricing" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-foreground">{content.title}</h2>
                <p className="mb-16 text-center text-muted-foreground">{content.subtitle}</p>
                <div className="grid gap-8 md:grid-cols-3">
                    {content.plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="relative flex flex-col rounded-lg border border-border bg-card p-8"
                        >
                            {plan.badge && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF50] hover:bg-[#43A047]">
                                    {plan.badge}
                                </Badge>
                            )}
                            <div className="mb-6">
                                <h3 className="mb-1 text-xl font-semibold text-foreground">{plan.name}</h3>
                                <p className="mb-3 text-3xl font-bold text-foreground">
                                    {plan.price}
                                    <span className="text-base font-normal text-muted-foreground">
                                        {content.monthLabel}
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                            <ul className="mb-6 flex flex-col gap-3">
                                {plan.included.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                        <span className="text-sm text-foreground/80">{item}</span>
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
