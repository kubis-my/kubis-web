import { Badge } from '@repo/shadcn-ui/components/badge';
import { Check } from 'lucide-react';

const PLANS = [
    {
        name: 'Maintenance',
        price: 'RM200',
        description: 'For stable systems with no active development needs.',
        included: [
            'Production hosting',
            'Uptime monitoring',
            'Bug fixes only',
            'Email support',
            '72-hour response time',
        ],
    },
    {
        name: 'Starter',
        price: 'RM500',
        description: 'Suitable for small businesses getting started.',
        included: [
            'Production hosting',
            'Maintenance and monitoring',
            'Bug fixes',
            'Basic support',
            '1 active feature request at a time',
            '48-72 hour response time',
        ],
    },
    {
        name: 'Growth',
        price: 'RM1,000',
        description: 'Suitable for growing businesses.',
        badge: 'Most Popular',
        included: [
            'Everything in Starter',
            'Continuous improvements',
            '1-2 small feature requests per month',
            'Priority support',
            'Managed DB and auto updates',
            'Performance server',
            '24-48 hour response time',
        ],
    },
    {
        name: 'Scale',
        price: 'RM2,000+',
        description: 'Suitable for advanced or business-critical usage.',
        included: [
            'Everything in Growth',
            '3-5 feature requests per month',
            'Faster turnaround time',
            'Higher priority handling',
            'Under 24 hour response time',
        ],
    },
];

const ADD_ONS = ['Minor Changes', 'New Module', 'Integration', 'Complex Automation'];

const OPTIONAL_ADD_ONS = [
    'Data migration',
    'Multi-branch setup',
    'Role and permission expansion',
    'Audit trail enhancements',
];

export default function SubscriptionPricing() {
    return (
        <div className="bg-[#ecf0f1] dark:bg-gray-950">
            <section className="px-6 py-16 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        Subscription Plans
                    </h1>
                    <p className="mb-16 text-center text-lg text-gray-600 dark:text-gray-300">
                        Move into production with a plan that grows with your business.
                    </p>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {PLANS.map((plan) => (
                            <article
                                key={plan.name}
                                className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900"
                            >
                                {plan.badge && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF50] hover:bg-[#43A047]">
                                        {plan.badge}
                                    </Badge>
                                )}
                                <div className="mb-6">
                                    <h2 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">
                                        {plan.name}
                                    </h2>
                                    <p className="mb-3 text-5xl font-bold text-gray-900 dark:text-white">
                                        {plan.price}
                                        <span className="ml-1 text-2xl font-normal text-gray-600 dark:text-gray-300">
                                            /month
                                        </span>
                                    </p>
                                    <p className="text-base text-gray-600 dark:text-gray-300">
                                        {plan.description}
                                    </p>
                                </div>
                                <ul className="flex flex-col gap-3">
                                    {plan.included.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4CAF50]" />
                                            <span className="text-base text-gray-700 dark:text-gray-200">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-16 md:pb-24">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        Add-Ons
                    </h2>
                    <p className="mb-16 text-center text-lg text-gray-600 dark:text-gray-300">
                        Extend your system beyond the subscription scope with scoped add-ons.
                    </p>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {ADD_ONS.map((item) => (
                            <article
                                key={item}
                                className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {item}
                                </h3>
                            </article>
                        ))}
                    </div>
                    <div className="mt-16">
                        <h3 className="mb-6 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Optional Add-Ons
                        </h3>
                        <ul className="flex flex-wrap justify-center gap-3">
                            {OPTIONAL_ADD_ONS.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-full border border-gray-200 bg-white px-6 py-2 text-base text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
