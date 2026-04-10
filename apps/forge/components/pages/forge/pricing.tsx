import { Badge } from '@repo/shadcn-ui/components/badge';
import { Button } from '@repo/shadcn-ui/components/button';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Starter',
        price: 'RM500',
        description: 'Suitable for small businesses getting started.',
        badge: null,
        included: [
            'Production hosting',
            'Maintenance and monitoring',
            'Bug fixes',
            'Basic support',
            '1 active feature request at a time',
        ],
        excluded: ['Major workflow changes', 'Third-party integrations', 'New modules'],
        support: '48–72 hour response time',
        featurePolicy:
            '1 request at a time, 2-week cooldown after completion, small scope only.',
    },
    {
        name: 'Growth',
        price: 'RM1,000',
        description: 'Suitable for growing businesses.',
        badge: 'Most Popular',
        included: [
            'Everything in Starter',
            'Continuous improvements',
            '1–2 small feature requests per month',
            'Priority support',
        ],
        excluded: [],
        support: '24–48 hour response time',
        featurePolicy: null,
    },
    {
        name: 'Scale',
        price: 'RM2,000+',
        description: 'Suitable for advanced or business-critical usage.',
        badge: null,
        included: [
            'Everything in Growth',
            '3–5 feature requests per month',
            'Faster turnaround time',
            'Higher priority handling',
        ],
        excluded: [],
        support: null,
        featurePolicy: null,
    },
];

export default function Pricing() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
                    Subscription Plans
                </h2>
                <p className="mb-16 text-center text-muted-foreground">
                    Move into production with a plan that grows with your business.
                </p>
                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
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
                                <h3 className="mb-1 text-xl font-semibold text-foreground">
                                    {plan.name}
                                </h3>
                                <p className="mb-3 text-3xl font-bold text-foreground">
                                    {plan.price}
                                    <span className="text-base font-normal text-muted-foreground">
                                        /month
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>
                            <ul className="mb-6 flex flex-col gap-3">
                                {plan.included.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                        <span className="text-sm text-foreground/80">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                                {plan.excluded.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                        <span className="text-sm text-muted-foreground">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {plan.support && (
                                <p className="mb-4 text-sm text-muted-foreground">
                                    {plan.support}
                                </p>
                            )}
                            {plan.featurePolicy && (
                                <p className="mb-6 text-xs text-muted-foreground">
                                    {plan.featurePolicy}
                                </p>
                            )}
                            <Button className="mt-auto w-full bg-[#4CAF50] hover:bg-[#43A047]" asChild>
                                <Link href="#">Get Started</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
