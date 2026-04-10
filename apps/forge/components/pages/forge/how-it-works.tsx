const steps = [
    {
        number: '01',
        title: 'Discovery',
        description:
            'We review your workflow, pain points, and what the system needs to achieve.',
    },
    {
        number: '02',
        title: 'MVP Build',
        description:
            'We develop the core system based on the agreed MVP scope. During development, you can monitor progress on a staging server and give feedback.',
    },
    {
        number: '03',
        title: 'Validation',
        description:
            'You review the MVP to confirm it matches your business needs and is ready for the next phase.',
    },
    {
        number: '04',
        title: 'Production Subscription',
        description:
            'Once the system is ready for live usage, it moves to production under a monthly subscription plan.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
                    How It Works
                </h2>
                <p className="mb-16 text-center text-gray-600 dark:text-gray-400">
                    A structured process from discovery to production.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                    {steps.map((step) => (
                        <div key={step.number} className="flex gap-6">
                            <span className="text-4xl font-bold text-gray-200 dark:text-gray-700">
                                {step.number}
                            </span>
                            <div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
